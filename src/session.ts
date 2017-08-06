import { Dice, DiceResult } from "./dice";
import { Player, Board, PlayerId } from "./board";
import { CardId, CardDataId, CardType, FacilityType, CardData, Facility, FacilityProperty,
         Character, CharacterData, CharacterType, SelectType } from "./facility";
import { shuffle } from "./utils";
import { CardState, CardManager, CardManagerQuery, EffectManager, PlayerCards } from "./card_manager";
import * as Query from "./query";
import { DiceEvenOdd, DiceNum, DiceEffects } from "./types";
import { GameMode, Protocol } from "./protocol";

export enum Phase {
    StartGame,
    // Loop b/w StartTurn and EndTurn.
    StartTurn,  // Draw a card.
    CharacterCard,
    DiceRoll,
    // DiceRollAgain,
    FacilityAction,  // Blue and Greeen
    FacilityActionRed,
    FacilityActionPurple,
    FacilityActionWithInteraction,
    // FacilityAction2,
    // FacilityAction3,
    // FacilityAction4,
    // FacilityAction5,
    PaySalary,
    BuildFacility,
    CardRemoval,
    EndTurn,
    EndGame,
}

export enum EventType {
    None,
    Draw,
    Character,
    Dice,
    Blue,
    Green,
    Red,
    Purple,
    Build,
    Salary,
    Interaction,
    Open,  // 休業
    Quit,
}

export class Event {
    public step: number = 0;
    public round: number = 0;
    public turn: number = 0;
    public type: EventType = EventType.None;
    public player_id: PlayerId = -1;
    public moneys: number[] = [0, 0, 0, 0];
    public card_id: CardId = null;
    public position: [number, number] = null;
    public target_player_id: PlayerId = -1;
    public target_card_ids: CardId[] = [];
    public close: boolean = false;
    public dice: DiceResult = null;
    public valid: boolean = false;

    public toJSON(): Object {
        return {
            class_name: "Event",
            step: this.step,
            round: this.round,
            turn: this.turn,
            type: this.type,
            player_id: this.player_id,
            moneys: this.moneys,
            card_id: this.card_id,
            position: this.position,
            target_player_id: this.target_player_id,
            target_card_ids: this.target_card_ids,
            close: this.close,
            dice: this.dice ? this.dice.toJSON() : null,
            valid: this.valid,
        }
    }

    static fromJSON(json): Event {
        let event = new Event();
        event.step = json.step;
        event.round = json.round;
        event.turn = json.turn;
        event.type = json.type;
        event.player_id = json.player_id;
        event.moneys = json.moneys;
        event.card_id = json.card_id;
        event.position = json.position;
        event.target_player_id = json.target_player_id;
        event.target_card_ids = json.target_card_ids;
        event.close = json.close;
        event.dice = json.dice ? DiceResult.fromJSON(json.dice) : null;
        event.valid = json.valid;
        return event;
    }
}

function ConvertToFacilityType(type: SelectType): FacilityType {
    switch(type) {
        case SelectType.Blue:
            return FacilityType.Blue;
        case SelectType.Green:
            return FacilityType.Green;
        case SelectType.Red:
            return FacilityType.Red;
        case SelectType.Purple:
            return FacilityType.Purple;
        default:
            return null;
    }
}

export class Session {
    private board: Board;
    private players: Player[];
    private card_manager: CardManager;
    private effect_manager: EffectManager;
    private events: Event[];
    private step: number;  // Server starts from 1. Client starts from 0.
    private phase: Phase;
    private round: number;
    private turn: number;
    private current_player_id: PlayerId;
    private winner: PlayerId;
    private target_facilities: CardId[];
    private dice_result: DiceResult;  // TODO: change it to Events.
    private watcher_user_ids: string[] = [];

    constructor(readonly session_id: number, readonly mode: GameMode) {
        this.board = new Board();
        this.players = [];
        this.card_manager = new CardManager();
        this.effect_manager = new EffectManager();
        this.events = [];
        this.step = 1;
        this.phase = Phase.StartGame;
        this.round = 0;
        this.turn = 0;
        this.current_player_id = 0;
        this.winner = -1;  // NO_PLAYER
        this.target_facilities = [];
        this.dice_result = null;
    }

    public toJSON(): Object {
        return {
            class_name: "Session",
            session_id: this.session_id,
            mode: this.mode,
            board: this.board.toJSON(),
            players: this.players.map(player => { return player.toJSON(); }),
            card_manager: this.card_manager.toJSON(),
            effect_manager: this.effect_manager.toJSON(),
            events: this.events.map(event => { return event.toJSON(); }),
            step: this.step,
            phase: this.phase,
            round: this.round,
            turn: this.turn,
            current_player_id: this.current_player_id,
            winner: this.winner,
            target_facilities: this.target_facilities,
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
            watcher_user_ids: this.watcher_user_ids,
        };
    }

    static fromJSON(json): Session {
        let board: Board = Board.fromJSON(json.board);
        let players: Player[] = json.players.map(player => { return Player.fromJSON(player); });
        let session: Session = new Session(json.session_id, json.mode);
        session.board = board;
        session.players = players;
        session.card_manager = CardManager.fromJSON(json.card_manager);
        session.effect_manager = EffectManager.fromJSON(json.effect_manager);
        session.events = json.events.map(event => { return Event.fromJSON(event); });
        session.step = json.step,
        session.phase = json.phase,
        session.round = json.round;
        session.turn = json.turn;
        session.current_player_id = json.current_player_id;
        session.winner = json.winner;
        session.target_facilities = json.target_facilities;
        session.dice_result = json.dice_result ? DiceResult.fromJSON(json.dice_result) : null;
        session.watcher_user_ids = json.watcher_user_ids;
        return session;
    }

    private newEvent(): Event {
        let event: Event = new Event();
        event.step = this.step;
        event.round = this.round;
        event.turn = this.turn;
        return event;
    }

    public isValidPhase(phase: Phase): boolean {
        if (this.phase === phase) {
            return true;
        }
        // Character card can be skipped.
        if (this.phase === Phase.CharacterCard && phase === Phase.DiceRoll) {
            return true;
        }
        return false;
    }

    public done(phase: Phase): void {
        if (!this.isValidPhase(phase) || this.phase === Phase.EndGame) {
            return;
        }
        this.step++;
        switch(phase) {
            case Phase.StartGame:
                this.phase = Phase.StartTurn;
                return;

            case Phase.StartTurn:
                this.phase = Phase.CharacterCard;
                return;

            case Phase.CharacterCard:
                this.phase = Phase.DiceRoll;
                return;

            case Phase.DiceRoll:
                this.phase = Phase.FacilityAction;
                return;

            case Phase.FacilityAction:
                this.phase = Phase.FacilityActionRed;
                return;

            case Phase.FacilityActionRed:
                this.phase = Phase.FacilityActionPurple;
                return;

            case Phase.FacilityActionPurple:
                if (this.target_facilities.length === 0) {
                    this.phase = Phase.PaySalary;
                    return;
                }
                this.phase = Phase.FacilityActionWithInteraction;
                return;

            case Phase.FacilityActionWithInteraction:
                if (this.target_facilities.length > 0) {
                    // If target_facilities remains, go back to the previous step.
                    this.phase = Phase.FacilityActionPurple;
                    return;
                }
                this.phase = Phase.PaySalary;
                return;

            case Phase.PaySalary:
                this.phase = Phase.BuildFacility;
                return;

            case Phase.BuildFacility:
                // Check EndGame
                const landmarks: CardId[] = this.card_manager.getLandmarks();
                const team_id: number = this.getTeamId(this.current_player_id);
                let num_landmarks: number = 0;
                for (let landmark of landmarks) {
                    if (this.getTeamId(this.card_manager.getOwner(landmark)) === team_id) {
                        num_landmarks++;
                    }
                }
                if (num_landmarks > (landmarks.length / this.players.length)) {
                    this.winner = this.current_player_id;
                    this.phase = Phase.EndGame;
                    return;
                }
                this.phase = Phase.EndTurn;
                return;

            case Phase.EndTurn:
                this.phase = Phase.StartTurn;
                return;

            case Phase.EndGame:
                // Do nothing.
                return;
        }
    }

    public doNext(): boolean {
        switch(this.phase) {
            case Phase.StartGame:
                return this.startGame();
             case Phase.StartTurn:
                return this.startTurn();
            case Phase.CharacterCard:
                return false;  // Need interactions.
            case Phase.DiceRoll:
                return false;  // Need interactions.
            case Phase.FacilityAction:
                return this.facilityAction(this.phase);
            case Phase.FacilityActionRed:
                return this.facilityAction(this.phase);
            case Phase.FacilityActionPurple:
                return this.facilityAction(this.phase);
            case Phase.FacilityActionWithInteraction:
                return false;
            case Phase.PaySalary:
                return this.paySalary();
            case Phase.BuildFacility:
                return false;  // Need interactions.
            case Phase.EndTurn:
                return this.endTurn();
            case Phase.EndGame:
                return this.endGame();
        }
        return false;
    }

    public addPlayer(user_id: string, name: string, money: number, salary: number,
                     is_auto: boolean): number {
        const player_id: PlayerId = this.players.length;
        if (player_id > 4) {
            return -1;
        }

        const team_id: number = this.getTeamId(player_id);
        this.players.push(new Player(user_id, player_id, name, money, salary, team_id, is_auto));
        return player_id;
    }

    public getTeamId(player_id: PlayerId): number {
        return player_id % Protocol.getTeamCount(this.mode);
    }

    public addFacility(player_id: PlayerId, facility_data_id: CardDataId): boolean {
        return this.card_manager.addFacility(player_id, facility_data_id);
    }

    public addCharacter(player_id: PlayerId, character_data_id: CardDataId): boolean {
        return this.card_manager.addCharacter(player_id, character_data_id);
    }

    public isValid(player_id: PlayerId, phase: Phase): boolean {
        return (this.current_player_id === player_id && this.isValidPhase(phase));
    }

    public startGame(): boolean {
        const landmark_ids: CardDataId[] = shuffle(CardData.getAvailableLandmarks());
        const num_landmarks: number = (this.players.length + 1);
        for (let i: number = 0; i < num_landmarks; i++) {
            this.setLandmark(landmark_ids[i]);
        }

        for (let r: number = 0; r < 2; r++) {
            for (let p: PlayerId = 0; p < this.players.length; p++) {
                this.buildInitialFacility(p);
            }
        }

        for (let r: number = 0; r < 5; r++) {
            for (let p: PlayerId = 0; p < this.players.length; p++) {
                this.getPlayerCards(p).dealToHand();
            }
        }
        this.done(Phase.StartGame);
        return true;
    }

    public startTurn(): boolean {
        this.effect_manager.expire(this.round, this.turn);
        let card_ids = this.drawCards(this.current_player_id, 1);

        // This is a hack to avoid drawing an event before game start.
        // TODO: Stop this hack.
        let is_first: boolean = (this.round === 0 && this.turn === 0);
        if (!is_first) {
            let event: Event = new Event();
            this.events.push(event);
            event.type = EventType.Draw;
            event.step = this.step;
            event.player_id = this.current_player_id;
            event.target_card_ids = card_ids;
        }
        this.done(Phase.StartTurn);
        return true;
    }

    public processDiceCommand(query: Query.DiceQuery): boolean {
        const player_id: PlayerId = query.player_id;
        const aim: number = query.aim;
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        const effects: DiceEffects = this.effect_manager.getDiceEffects();
        this.dice_result = Dice.roll(query.dice_num, aim, effects);

        // TODO: Move this to other place?
        this.target_facilities = this.getFacilitiesInArea(this.dice_result.result());

        let event: Event = new Event();
        this.events.push(event);
        event.type = EventType.Dice;
        event.dice = this.dice_result;
        event.step = this.step;
        event.player_id = player_id;
        this.done(Phase.DiceRoll);
        return true;
    }

    public processInteractCommand(query: Query.InteractQuery): boolean {
        const player_id: PlayerId = query.player_id;
        const card_id: CardId = query.card_id;
        if (!this.isValid(player_id, Phase.FacilityActionWithInteraction)) {
            return false;
        }

        if (this.target_facilities.length === 0) {
            return false;
        }

        if (this.target_facilities[0] !== card_id) {
            return false;
        }

        const event: Event = this.getEventInteractCommand(query);
        return this.processEventInteractCommand(event);
    }

    public getEventInteractCommand(query: Query.InteractQuery): Event {
        const player_id: PlayerId = query.player_id;
        const card_id: CardId = query.card_id;
        const target_id: PlayerId = query.target_player_id;

        let event: Event = new Event();
        const facility: Facility = this.getFacility(card_id);
        if (facility.getType() !== FacilityType.Purple) {
            return event;
        }

        if (facility.property.all === true) {
            return event;
        }

        const owner_id: PlayerId = this.getOwnerId(card_id);
        if (player_id !== owner_id) {
            return event;
        }

        if (this.willFacilityClose(card_id)) {
            event.close = true;
        }

        event.step = this.step;
        event.card_id = card_id;
        event.player_id = player_id;
        event.type = EventType.Purple;

        const value: number = this.getFacilityValue(card_id);
        const amount: number = this.checkMoveMoney(target_id, owner_id, value);
        event.moneys[target_id] -= amount;
        event.moneys[owner_id] += amount;

        return event;
    }

    public processEventInteractCommand(event: Event): boolean {
        if (event == null || event.type === EventType.None) {
            return false;
        }

        for (let pid: PlayerId = 0; pid < event.moneys.length; ++pid) {
            if (event.moneys[pid] !== 0) {
                this.getPlayer(pid).addMoney(event.moneys[pid]);
            }
        }
        if (event.close === true) {
            let facility: Facility = this.getFacility(event.card_id);
            facility.is_open = false;
        }

        this.events.push(event);
        this.target_facilities.shift();
        this.done(Phase.FacilityActionWithInteraction);
        return true;
    }

    public facilityAction(phase: Phase): boolean {
        let number: number = this.dice_result.result();
        let facility_types: FacilityType[] = [];
        switch(phase) {
            case Phase.FacilityAction:
                facility_types = [FacilityType.Blue, FacilityType.Green];
                break;
            case Phase.FacilityActionRed:
                facility_types = [FacilityType.Red];
                break;
            case Phase.FacilityActionPurple:
            case Phase.FacilityActionWithInteraction:  // Only Purple has interactive facilities.
                facility_types = [FacilityType.Purple];
                break;
        }

        while (this.target_facilities.length > 0) {
            let card_id: CardId = this.target_facilities[0];
            let facility: Facility = this.getFacility(card_id);
            if (facility_types.indexOf(facility.getType()) === -1) {
                break;
            }

            if (!this.doFacilityAction(card_id)) {
                // The facility requires user's interaction.
                break;
            }
            this.target_facilities.shift();
        }

        this.done(phase);
        return true;
    }

    public getFacilitiesInArea(area: number): CardId[] {
        let x: number = area - 1;
        let card_ids: CardId[] = [];
        if (x < 0 || 11 < x) {
            return card_ids;
        }

        let map_y: { [card_id: number]: number } = {};
        for (let y: number = 0; y < 5; y++) {
            let card_id: CardId = this.getCardIdOnBoard(x, y);
            if (this.card_manager.isFacility(card_id)) {
                card_ids.push(card_id);
                map_y[card_id] = y;
            }
        }

        return card_ids.sort((id1: CardId, id2: CardId) => {
            let f1: Facility = this.getFacility(id1);
            let f2: Facility = this.getFacility(id2);

            // Blue < Green < Red < Purple
            if (f1.getType() !== f2.getType()) {
                return f1.getType() - f2.getType();
            }

            // TODO: change the order for Red.

            // y4 < y3 < y2 < y1 < y0;
            return map_y[id2] - map_y[id1];
        });
    }

    public checkMoveMoney(pid_from: PlayerId, pid_to: PlayerId, money: number): number {
        if (pid_from === pid_to) {
            return 0;
        }
        if (money < 0) {
            return -Math.min(this.getPlayer(pid_to).getMoney(), -money);
        }
        return Math.min(this.getPlayer(pid_from).getMoney(), money);
    }

    public moveMoney(pid_from: PlayerId, pid_to: PlayerId, money: number): number {
        const actual: number = this.checkMoveMoney(pid_from, pid_to, money);
        this.getPlayer(pid_from).addMoney(-actual);
        this.getPlayer(pid_to).addMoney(actual);
        return actual;
    }

    public getFacilityValue(card_id: CardId): number {
        const facility: Facility = this.getFacility(card_id);
        const value: number = facility.getValue();
        let boost: number = Math.max(0, 1.0 + this.effect_manager.getBoost(card_id));

        let multi: number = 1.0;
        if (facility.property.multi != undefined) {
            const card_query: CardManagerQuery = {
                data_id: facility.data_id,
                state: CardState.Field,
            };
            const card_ids: CardId[] = this.queryCards(card_query);
            if (card_ids.length > 1) {
                multi = facility.property.multi;
            }
        }

        const landmark_ids: CardId[] = this.card_manager.getBuiltLandmarks();

        // Boost by number of built landmarks.
        let lmboost: number = 1.0;
        if (facility.property.lmboost != undefined && landmark_ids.length >= 2) {
            lmboost = facility.property.lmboost;
        }

        // Boost by effects of built landmarks.
        boost += this.getBoostByBuiltLandmark(card_id);

        return value * boost * lmboost * multi;
    }

    public getBoostByBuiltLandmark(card_id: CardId): number {
        const landmark_ids: CardId[] = this.card_manager.getBuiltLandmarks();
        let boost: number = 0.0;

        // TODO: Merge landmark related logics.
        for (let landmark_id of landmark_ids) {
            const landmark: Facility = this.getFacility(landmark_id);
            if (landmark.property.effect !== CharacterType.Boost) {
                continue;
            }
            const card_query: CardManagerQuery = {
                card_type: CardType.Facility,
                facility_type: ConvertToFacilityType(landmark.property.type),
                state: CardState.Field,
            };
            const card_ids: CardId[] = this.queryCards(card_query);
            if (card_ids.indexOf(card_id) !== -1) {
                boost += landmark.property.boost;
            }
        }
        return boost;
    }

    public getEventFacilityAction(player_id: PlayerId, card_id: CardId): Event {
        const facility: Facility = this.getFacility(card_id);
        const owner_id: PlayerId = this.getOwnerId(card_id);
        const owner: Player = this.getOwner(card_id);
        let event: Event = new Event();
        event.step = this.step;
        event.card_id = card_id;
        event.player_id = player_id;

        if (facility.getType() === FacilityType.Blue) {
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            if (this.willFacilityClose(card_id)) {
                event.close = true;
            }

            let amount: number = this.getFacilityValue(card_id);
            event.type = EventType.Blue;
            event.moneys[owner_id] += amount;
            return event;
        }
        if (facility.getType() === FacilityType.Green) {
            if (player_id !== owner_id) {
                return event;
            }
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            if (this.willFacilityClose(card_id)) {
                event.close = true;
            }

            let amount: number = this.getFacilityValue(card_id);
            event.type = EventType.Green;
            event.moneys[owner_id] += amount;
            return event;
        }
        if (facility.getType() === FacilityType.Red) {
            if (player_id === owner_id) {
                return event;
            }
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            if (this.willFacilityClose(card_id)) {
                event.close = true;
            }

            let value: number = this.getFacilityValue(card_id);
            event.type = EventType.Red;
            if (facility.property.all) {
                for (let pid: number = 0; pid < this.players.length; ++pid) {
                    if (pid === owner_id) {
                        continue;
                    }
                    let amount: number = this.checkMoveMoney(pid, owner_id, value);
                    event.moneys[pid] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
            else {
                let amount: number = this.checkMoveMoney(player_id, owner_id, value);
                event.moneys[player_id] -= amount;
                event.moneys[owner_id] += amount;
            }
            return event;
        }
        if (facility.getType() === FacilityType.Purple) {
            if (player_id !== owner_id) {
                return event;
            }

            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }

            let value: number = this.getFacilityValue(card_id);
            if (facility.property.all !== true) {  // TODO: Update the logic.
                event.type = EventType.Interaction;
            }
            else {
                if (this.willFacilityClose(card_id)) {
                    event.close = true;
                }
                event.type = EventType.Purple;
                for (let pid: number = 0; pid < this.players.length; ++pid) {
                    if (pid === owner_id) {
                        continue;
                    }
                    let amount: number = this.checkMoveMoney(pid, owner_id, value);
                    event.moneys[pid] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
            return event;
        }
        return event;
    }

    public willFacilityClose(facility_id: CardId): boolean {
        const facility: Facility = this.getFacility(facility_id);
        if (facility.property.close === true) {
            return true;
        }
        // TODO: Merge landmark related logics.
        const landmark_ids: CardId[] = this.card_manager.getBuiltLandmarks();
        for (let landmark_id of landmark_ids) {
            const landmark: Facility = this.getFacility(landmark_id);
            if (landmark.property.effect !== CharacterType.Close) {
                continue;
            }
            const card_query: CardManagerQuery = {
                card_type: CardType.Facility,
                facility_type: ConvertToFacilityType(landmark.property.type),
                state: CardState.Field,
            };
            const card_ids: CardId[] = this.queryCards(card_query);
            if (card_ids.indexOf(facility_id) !== -1) {
                return true;
            }
        }
        return false;
    }

    public doFacilityAction(card_id: CardId): boolean {
        const event: Event = this.getEventFacilityAction(this.getCurrentPlayerId(), card_id);
        return this.processEventFacilityAction(event);
    }

    public processEventFacilityAction(event: Event): boolean {
        let facility: Facility = this.getFacility(event.card_id);
        if (event.type !== EventType.None) {
            this.events.push(event);
        }

        if (event.type === EventType.Interaction) {
            // The facility requires user's interaction.
            return false;
        }

        if (event.type === EventType.Open) {
            facility.is_open = true;
            return true;
        }

        for (let pid: PlayerId = 0; pid < event.moneys.length; ++pid) {
            if (event.moneys[pid] !== 0) {
                this.getPlayer(pid).addMoney(event.moneys[pid]);
            }
        }
        if (event.close === true) {
            facility.is_open = false;
        }
        return true;
    }

    private getOverwriteCosts(x: number, y: number, size: number): number[] {
        let costs = [0, 0, 0, 0];
        for (let card_id of this.getOverlappedFacilities(x, y, size)) {
            let owner_id: PlayerId = this.getOwnerId(card_id);
            if (owner_id === this.getCurrentPlayerId()) {
                continue;
            }

            costs[owner_id] += this.getFacility(card_id).getCost() * 2;
        }
        return costs;
    }

    public availablePosition(card_id: CardId): [number, number][] {
        let positions: [number, number][] = [];
        let facility: Facility = this.card_manager.getFacility(card_id);
        // TODO: support multiple x. (e.g. 7-9)
        let area: number[] = facility.getArea();
        let columns: number[];
        if (area.length === 0) {
            // area.length === 0 means anywhere.
            columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].splice(0, 13 - facility.size);
        }
        else {
            columns = area.map((x) => { return x - 1; });  // area is 1-origin.
        }
        for (let y: number = 0; y < this.board.row; y++) {
            for (let x of columns) {
                let available: boolean = true;
                for (let s: number = 0; s < facility.size; ++s) {
                    if (this.getCardIdOnBoard(x + s, y) !== -1) {
                        available = false;
                        break;
                    }
                }
                if (available) {
                    positions.push([x, y]);
                }
            }
        }
        return positions;
    }

    public queryCards(query: CardManagerQuery): CardId[] {
        const card_ids: CardId[] = this.card_manager.queryCards(query);
        let results: CardId[] = [];
        for (let card_id of card_ids) {
            let facility: Facility = this.card_manager.getFacility(card_id);
            if (query.is_open && query.is_open !== facility.is_open) {
                continue;
            }
            results.push(card_id);
        }
        return results;
    }

    // Build a facility in the player's talon.
    // No overwrite an existing facility or no exceed the cost of the player's money.
    public buildInitialFacility(player_id: PlayerId): boolean {
        // Player ID is valid?
        if (player_id >= this.players.length) {
            return false;
        }

        let player: Player = this.getPlayer(player_id);
        let card_id_list: CardId[] = shuffle(this.getPlayerCards(player_id).getTalon());

        for (let card_id of card_id_list) {
            if (this.isCharacter(card_id)) {
                continue;
            }
            let facility: Facility = this.card_manager.getFacility(card_id);
            let balance: number = player.getMoney() - facility.getCost();
            if (balance < 0) {
                continue;
            }
            let positions: [number, number][] = shuffle(this.availablePosition(card_id));
            if (positions.length === 0) {
                continue;
            }

            if (!this.card_manager.moveTalonToField(card_id)) {
                // Something is wrong.
                console.warn(`moveTalonToField(${card_id}) failed.`);
                return false;
            }

            let [x, y] = positions[0];
            this.board.setCardId(x, y, card_id, facility.size);
            player.setMoney(balance);
            return true;
        }

        return true;  // True is returned even if no facility was built.
    }

    public setLandmark(data_id: CardDataId): boolean {  // Reserve the area for landmark.
        let landmark: Facility = new Facility(data_id);
        const landmark_id: CardId = this.card_manager.addLandmark(landmark);

        const positions: [number, number][] = shuffle(this.availablePosition(landmark_id));
        if (positions.length === 0) {
            console.error("Landmark cannot be built.");
            return false;
        }

        const [x, y]: [number, number] = positions[0];
        this.board.setCardId(x, y, landmark_id, landmark.size);
        return true;
    }

    private drawCards(player_id: PlayerId, num_cards: number): CardId[] {
        let card_ids: CardId[] = [];
        for (let i: number = 0; i < num_cards; ++i) {
            let drawn: CardId = this.getPlayerCards(player_id).dealToHand();
            if (drawn === -1) {
                break;
            }
            card_ids.push(drawn);
        }
        return card_ids;
    }

    // TODO: Support other additional arguments.
    public processCharacterCommand(query: Query.CharacterQuery): boolean {
        const event: Event = this.getEventCharacterCommand(query);
        return this.processEventCharacterCommand(event);
    }

    public getEventCharacterCommand(query: Query.CharacterQuery): Event {
        const player_id: PlayerId = query.player_id;
        const card_id: CardId = query.card_id;
        const target_player_id: PlayerId = query.target_player_id;
        if (!this.isValid(player_id, Phase.CharacterCard)) {
            return null;
        }

        // Is character.
        if (!this.isCharacter(card_id)) {
            return null;
        }

        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return null;
        }

        // Add card to the effect manager.
        let character: Character = this.card_manager.getCharacter(card_id);
        let event: Event = this.newEvent();
        event.type = EventType.Character;
        event.card_id = card_id;
        event.player_id = player_id;
        event.valid = true;

        switch (character.type) {
            case CharacterType.DrawCards: {
                const size: number = character.getPropertyValue();
                event.target_card_ids = this.card_manager.getCardsFromTalon(player_id, size);
                event.player_id = player_id;
                return event;
            }
            case CharacterType.MoveMoney: {
                const money: number =
                    this.checkMoveMoney(target_player_id, player_id, character.property.money);
                event.target_player_id = target_player_id;
                event.moneys[player_id] += money;
                event.moneys[target_player_id] -= money;
                return event;
            }
            case CharacterType.DiceDelta:
            case CharacterType.DiceOne:
            case CharacterType.DiceTwo:
            case CharacterType.DiceEven:
            case CharacterType.DiceOdd:
            case CharacterType.SalaryFactor: {
                return event;
            }
            case CharacterType.Boost: {
                if (character.property.type === SelectType.Facility) {
                    event.target_card_ids.push(query.target_card_id);
                }
                else {
                    let owner_id = player_id;
                    if (character.property.boost < 0) {
                        owner_id = query.target_player_id;
                    }
                    const card_query: CardManagerQuery = {
                        card_type: CardType.Facility,
                        facility_type: ConvertToFacilityType(character.property.type),
                        state: CardState.Field,
                        owner_id: owner_id,
                    };
                    event.target_card_ids = this.queryCards(card_query);
                }
                return event;
            }
            case CharacterType.Close: {
                if (character.property.type === SelectType.Facility) {
                    event.target_card_ids.push(query.target_card_id);
                }
                else {
                    const card_query: CardManagerQuery = {
                        card_type: CardType.Facility,
                        facility_type: ConvertToFacilityType(character.property.type),
                        state: CardState.Field,
                        is_open: true,
                    };
                    event.target_card_ids = this.queryCards(card_query);
                }
                return event;
            }
            case CharacterType.Open: {
                const query: CardManagerQuery = {
                    card_type: CardType.Facility,
                    state: CardState.Field,
                    is_open: false,
                };
                event.target_card_ids = this.queryCards(query);
                return event;
            }
        }
        return null;
    }

    public processEventCharacterCommand(event: Event): boolean {
        if (event == null) {
            return false;
        }

        const card_id: CardId = event.card_id;
        const character: Character = this.card_manager.getCharacter(card_id);

        // Move the card to discard.
        if (!this.card_manager.moveHandToDiscard(card_id)) {
            // Something is wrong.
            console.warn(`moveHandToDiscard(${card_id}) failed.`);
            return false;
        }

        // Process event
        switch (character.type) {
            case CharacterType.DrawCards: {
                for (let drawn_card_id of event.target_card_ids) {
                    this.card_manager.moveTalonToHand(drawn_card_id);
                }
                break;
            }
            case CharacterType.MoveMoney: {
                for (let i: number = 0; i < this.players.length; ++i) {
                    this.players[i].addMoney(event.moneys[i]);
                }
                break;
            }
            case CharacterType.DiceDelta:
            case CharacterType.DiceOne:
            case CharacterType.DiceTwo:
            case CharacterType.DiceEven:
            case CharacterType.DiceOdd:
            case CharacterType.SalaryFactor: {
                this.effect_manager.addCard(character.data_id, event.round, event.turn);
                break;
            }

            case CharacterType.Boost: {
                this.effect_manager.addCard(
                    character.data_id, event.round, event.turn, event.target_card_ids);
                break;
            }
            case CharacterType.Close: {
                for (let card_id of event.target_card_ids) {
                    let facility: Facility = this.card_manager.getFacility(card_id);
                    facility.is_open = false;
                }
                break;
            }
            case CharacterType.Open: {
                for (let card_id of event.target_card_ids) {
                    let facility: Facility = this.card_manager.getFacility(card_id);
                    facility.is_open = true;
                }
                break;
            }
        }
        this.events.push(event);
        this.done(Phase.CharacterCard);
        return true;
    }

    // TODO: move this function to Board?
    public getOverlappedFacilities(x: number, y: number, size: number): CardId[] {
        let card_ids: CardId[] = [];
        let prev_id: CardId = -1;
        for (let i: number = 0; i < size; ++i) {
            let card_id: CardId = this.board.getCardId(x + i, y);
            if (card_id === prev_id || card_id === -1) {
                continue;
            }
            card_ids.push(card_id);
            prev_id = card_id;
        }
        return card_ids;
    }

    public processBuildCommand(query: Query.BuildQuery): boolean {
        let event: Event = this.getEventBuildCommand(query);
        return this.processEventBuild(event);
    }

    public getEventBuildCommand(query: Query.BuildQuery): Event {
        const player_id: PlayerId = query.player_id;
        const x: number = query.x;
        const y: number = query.y;
        const card_id: CardId = query.card_id;

        if (x == null || y == null && player_id == null && card_id == null) {
            return null;
        }

        // Facility is a landmark?
        if (this.card_manager.isLandmark(card_id)) {
            return this.getEventBuildLandmark(query);
        }

        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return null;
        }

        let event: Event = new Event();
        event.step = this.step;
        event.type = EventType.Build;
        event.player_id = player_id;
        event.position = [x, y];

        // Is pass?  (valid action, but not build a facility).
        if (x === -1 && y === -1 && card_id === -1) {
            event.card_id = -1;
            event.valid = true;
            return event;
        }

        // Facility is valid?
        let facility: Facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return null;
        }

        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return null;
        }

        // Facility's owner is valid?
        let facility_owner: PlayerId = this.getOwnerId(card_id);
        if (facility_owner !== player_id) {
            return null;
        }

        // Facility's area is valid?
        let area: number = x + 1;
        if (!this.card_manager.isInArea(area, card_id)) {
            return null;
        }

        let overlapped: CardId[] = this.getOverlappedFacilities(x, y, facility.size);
        for (let card_id_on_board of overlapped) {
            // Facility on the board is overwritable?
            if (!this.card_manager.canOverwrite(card_id_on_board)) {
                return null;
            }
        }

        // Money is valid?
        let overwrite_costs: number[] = this.getOverwriteCosts(x, y, facility.size);
        let total_cost: number = facility.cost;
        for (let i: number = 0; i < overwrite_costs.length; ++i) {
            total_cost += overwrite_costs[i];
        }
        if (total_cost <= this.getPlayer(player_id).getMoney()) {
            event.valid = true;
        }

        // Merge overwrite_costs and total_cost;
        overwrite_costs[player_id] -= total_cost;

        event.moneys = overwrite_costs;
        event.card_id = card_id;
        event.target_card_ids = overlapped;

        return event;
    }

    private getEventBuildLandmark(query: Query.BuildQuery): Event {
        const player_id: PlayerId = query.player_id;
        const card_id: CardId = query.card_id;

        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return null;
        }

        // Is a landmark?
        if (!this.card_manager.isLandmark(card_id)) {
            return null;
        }

        // Facility is valid?
        let facility: Facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return null;
        }

        // Isn't already built?
        let facility_owner: PlayerId = this.getOwnerId(card_id);
        if (facility_owner !== -1) {
            // Already built.
            return null;
        }

        let event: Event = new Event();

        // Money is valid?
        let cost: number = facility.getCost();
        if (cost <= this.getPlayer(player_id).getMoney()) {
            event.valid = true;
        }

        event.player_id = player_id;
        event.step = this.step;
        event.type = EventType.Build;
        event.moneys[player_id] -= cost;
        event.card_id = card_id;

        return event;
    }

    public processEventBuild(event): boolean {
        if (event == null || !event.valid) {
            return false;
        }

        this.events.push(event);
        const card_id: CardId = event.card_id;

        // End turn, no build.
        if (card_id === -1) {
            this.done(Phase.BuildFacility);
            return true;
        }

        // Landmark
        if (this.card_manager.isLandmark(card_id)) {
            this.getPlayer(event.player_id).addMoney(event.moneys[event.player_id]);
            this.card_manager.buildLandmark(event.player_id, card_id);

            this.done(Phase.BuildFacility);
            return true;
        }

        const facility: Facility = this.getFacility(card_id);
        const [x, y]: [number, number] = event.position;

        // Update the data.
        this.board.removeCards(x, y, facility.size);
        for (let card_id_on_board of event.target_card_ids) {
            // Delete the existing facility.
            if (!this.card_manager.moveFieldToDiscard(card_id_on_board)) {
                // Something is wrong.
                console.warn(`moveFieldToDiscard(${card_id_on_board}) failed.`);
                return false;
            }
        }

        // Build the new facility.
        if (!this.card_manager.moveHandToField(card_id)) {
            // Something is wrong.
            console.warn(`moveHandToField(${card_id}) failed.`);
            return false;
        }

        this.board.setCardId(x, y, card_id, facility.size);
        for (let i: number = 0; i < this.players.length; ++i) {
            this.players[i].addMoney(event.moneys[i]);
        }

        this.done(Phase.BuildFacility);
        return true;
    }

    public paySalary(): boolean {
        const event: Event = this.getEventPaySalary(this.current_player_id);
        return this.processEventPaySalary(event);
    }

    public getSalaryBoost(): number {
        const boost: number =
            1.0 + this.effect_manager.getSalaryBoost() + this.getSalaryBoostByBuiltLandmark();
        return Math.max(0, boost);
    }

    public getSalaryBoostByBuiltLandmark(): number {
        const landmark_ids: CardId[] = this.card_manager.getBuiltLandmarks();
        let boost: number = 0.0;

        for (let landmark_id of landmark_ids) {
            const landmark: Facility = this.getFacility(landmark_id);
            if (landmark.property.effect === CharacterType.SalaryFactor) {
                boost += landmark.property.boost;
            }
        }
        return boost;
    }

    public getEventPaySalary(player_id: PlayerId): Event {
        const boost: number = this.getSalaryBoost();
        const salary: number = this.getPlayer(player_id).salary * boost;

        let event: Event = this.newEvent();
        event.type = EventType.Salary;
        event.player_id = player_id;
        event.moneys[player_id] += salary;
        return event;
    }

    public processEventPaySalary(event: Event): boolean {
        this.events.push(event);
        this.getPlayer(event.player_id).addMoney(event.moneys[event.player_id]);
        this.done(Phase.PaySalary);
        return true;
    }

    public endTurn(): boolean {
        if (this.current_player_id === this.players.length - 1) {
            this.current_player_id = 0;
            this.round += 1;
            this.turn = 0;
        }
        else {
            this.current_player_id += 1;
            this.turn += 1;
        }

        this.done(Phase.EndTurn);
        return true;
    }

    public endGame(): boolean {
        // Do nothing so far.
        this.done(Phase.EndGame);
        return true;
    }

    public quit(player_id: PlayerId): boolean {
        let event: Event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Quit;
        event.player_id = player_id;

        // TODO: Do not end the game. Swith to AI.
        this.phase = Phase.EndGame;
        this.step++;
        return true;
    }

    public processQuitCommand(query: Query.QuitQuery): boolean {
        const user_id: string = query.user_id;
        this.removeWatcher(user_id);
        const player_id: number = this.getPlayerId(user_id);
        if (player_id === -1) {
            return false;
        }
        return this.quit(player_id);
    }

    public getEvents(): Event[] {
        return this.events;
    }
    public getStep(): number {
        return this.step;
    }
    public getPhase(): Phase {
        return this.phase;
    }

    public getBoard(): Board {
        return this.board;
    }
    public getPlayers(): Player[] {
        return this.players;
    }
    public getFacility(card_id: CardId): Facility {
        return this.card_manager.getFacility(card_id);
    }
    public isFacility(card_id: CardId): boolean {
        return this.card_manager.isFacility(card_id);
    }
    public getCardIdOnBoard(x: number, y: number): CardId {
        return this.board.getCardId(x, y);
    }
    public getFacilityOnBoard(x: number, y: number): Facility {
        return this.card_manager.getFacility(this.getCardIdOnBoard(x, y));
    }
    public getOwnerIdOnBoard(x: number, y: number): PlayerId {
        return this.getOwnerId(this.getCardIdOnBoard(x, y));
    }
    public getCurrentPlayerId(): PlayerId {
        return this.current_player_id;
    }
    public getCurrentPlayer(): Player {
        return this.getPlayer(this.current_player_id);
    }
    public getPlayerId(user_id: string): PlayerId {
        for (let pid: number = 0; pid < this.players.length; ++pid) {
            if (this.players[pid].user_id === user_id) {
                return pid;
            }
        }
        return -1;
    }
    public getPlayer(player_id: PlayerId): Player {
        if (player_id == null || player_id < 0) {
            return null;
        }
        return this.players[player_id];
    }
    public getPlayerCards(player_id: PlayerId): PlayerCards {
        return this.card_manager.getPlayerCards(player_id);
    }
    public getSortedHand(player_id: PlayerId): CardId[] {
        return this.card_manager.sortFacilitiesForHand(this.getPlayerCards(player_id).getHand());
    }
    public isLandmark(card_id: CardId): boolean {
        return this.card_manager.isLandmark(card_id);
    }
    public getLandmarks(): CardId[] {
        return this.card_manager.getLandmarks();
    }
    public getOwnerId(card_id: CardId): PlayerId {
        return this.card_manager.getOwner(card_id);
    }
    public getOwner(card_id: CardId): Player {
        return this.getPlayer(this.getOwnerId(card_id));
    }
    public getWinner(): PlayerId {
        return this.winner;
    }
    public getPosition(card_id: CardId): [number, number] {
        return this.board.getPosition(card_id);
    }
    public getDiceResult(): DiceResult {
        return this.dice_result;
    }
    public isCharacter(card_id: CardId): boolean {
        return this.card_manager.isCharacter(card_id);
    }
    public getCharacter(card_id: CardId): Character {
        return this.card_manager.getCharacter(card_id);
    }
    public getDiceDelta(): number {
        return this.effect_manager.getDiceDelta();
    }
    public getDiceEffects(): DiceEffects {
        return this.effect_manager.getDiceEffects();
    }
    public getTargetFacilities(): CardId[] {
        return this.target_facilities;
    }
    public isEnd(): boolean {
        return (this.phase === Phase.EndGame);
    }
    public getWatchers(): string[] {
        return this.watcher_user_ids;
    }
    public processWatchCommand(query: Query.WatchQuery): boolean {
        const user_id: string = query.user_id;
        if (this.watcher_user_ids.indexOf(user_id) === -1) {
            this.watcher_user_ids.push(user_id);
        }
        return true;
    }
    public removeWatcher(user_id: string): void {
        const index: number = this.watcher_user_ids.indexOf(user_id);
        if (index !== -1) {
            this.watcher_user_ids.splice(index, 1);
        }
    }
    public getCardDataId(card_id: CardId): CardDataId {
        return this.card_manager.getCardDataId(card_id);
    }
}
