import { Dice, DiceResult } from "./dice";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityDataId, FacilityType, Facility,
         Character, CharacterData, CharacterDataId, CharacterType } from "./facility";
import { shuffle } from "./utils";
import { CardManager, EffectManager, PlayerCards } from "./card_manager";

export enum Phase {
    StartGame,
    // Loop b/w StartTurn and EndTurn.
    StartTurn,  // Draw a card.
    CharacterCard,
    DiceRoll,
    // DiceRollAgain,
    FacilityAction,
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
    Blue,
    Green,
    Red,
    Purple,
    Build,
    Character,
    Dice,
    Salary,
    Quit,
}

export class Event {
    public step: number = 0;
    public type: EventType = EventType.None;
    public moneys: number[] = [0, 0, 0, 0];
    public card_id: CardId = null;
    public dice: DiceResult = null;

    public toJSON(): Object {
        return {
            class_name: "Event",
            step: this.step,
            type: this.type,
            moneys: this.moneys,
            card_id: this.card_id,
            dice: this.dice ? this.dice.toJSON() : null,
        }
    }

    static fromJSON(json): Event {
        let event = new Event();
        event.step = json.step;
        event.type = json.type;
        event.moneys = json.moneys;
        event.card_id = json.card_id;
        event.dice = json.dice ? DiceResult.fromJSON(json.dice) : null;
        return event;
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
    private dice_result: DiceResult;  // TODO: change it to Events.

    constructor() {
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
        this.dice_result = null;
    }

    public toJSON(): Object {
        return {
            class_name: "Session",
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
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
        };
    }

    static fromJSON(json): Session {
        let board: Board = Board.fromJSON(json.board);
        let players: Player[] = json.players.map(player => { return Player.fromJSON(player); });
        let session: Session = new Session();
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
        session.dice_result = json.dice_result ? DiceResult.fromJSON(json.dice_result) : null;
        return session;
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
        if (phase === Phase.StartGame) {
            this.phase = Phase.StartTurn;
            return;
        }

        if (phase === Phase.StartTurn) {
            this.phase = Phase.CharacterCard;
            return;
        }

        if (phase === Phase.CharacterCard) {
            this.phase = Phase.DiceRoll;
            return;
        }

        if (phase === Phase.DiceRoll) {
            this.phase = Phase.FacilityAction;
            return;
        }

        if (phase === Phase.FacilityAction) {
            this.phase = Phase.PaySalary;
            return;
        }

        if (phase === Phase.PaySalary) {
            this.phase = Phase.BuildFacility;
            return;
        }

        if (phase === Phase.BuildFacility) {
            // Check EndGame
            let landmarks: CardId[] = this.card_manager.getLandmarks();
            let num_landmarks: number = 0;
            for (let landmark of landmarks) {
                if (this.card_manager.getOwner(landmark) === this.current_player_id) {
                    num_landmarks++;
                }
            }
            // TODO: support multiple landmarks.
            if (num_landmarks > 0) {
                this.winner = this.current_player_id;
                this.phase = Phase.EndGame;
                return;
            }
            this.phase = Phase.EndTurn;
            return;
        }

        if (phase === Phase.EndTurn) {
            this.phase = Phase.StartTurn;
            return;
        }

        if (phase === Phase.EndGame) {
            // Do nothing.
            return;
        }
    }

    public doNext(): boolean {
        if (this.phase === Phase.StartGame) {
            return this.startGame();
        }

        if (this.phase === Phase.StartTurn) {
            return this.startTurn();
        }

        if (this.phase === Phase.CharacterCard) {
            return false;  // Need interactions.
        }

        if (this.phase === Phase.DiceRoll) {
            return false;  // Need interactions.
        }

        if (this.phase === Phase.FacilityAction) {
            return this.facilityAction();
        }

        if (this.phase === Phase.PaySalary) {
            return this.paySalary();
        }

        if (this.phase === Phase.BuildFacility) {
            return false;  // Need interactions.
        }

        if (this.phase === Phase.EndTurn) {
            return this.endTurn();
        }

        if (this.phase === Phase.EndGame) {
            return this.endGame();
        }

        return false;
    }

    public addPlayer(user_id: string, name: string, money: number, salary: number,
                     is_auto: boolean): number {
        let player_id: PlayerId = this.players.length;
        if (player_id > 4) {
            return -1;
        }
        // team === player_id (no 2vs2 so far).
        this.players.push(new Player(user_id, player_id, name, money, salary, player_id, is_auto));
        return player_id;
    }

    public addFacility(player_id: PlayerId, facility_data_id: FacilityDataId): boolean {
        return this.card_manager.addFacility(player_id, facility_data_id);
    }

    public addCharacter(player_id: PlayerId, character_data_id: CharacterDataId): boolean {
        return this.card_manager.addCharacter(player_id, character_data_id);
    }

    public isValid(player_id: PlayerId, phase: Phase): boolean {
        return (this.current_player_id === player_id && this.isValidPhase(phase));
    }

    public startGame(): boolean {
        this.setLandmark();

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
        this.getPlayerCards(this.current_player_id).dealToHand();
        this.done(Phase.StartTurn);
        return true;
    }

    public diceRoll(player_id: number, dice_num: number, aim: number): boolean {
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        let delta: number = this.effect_manager.getDiceDelta();
        this.dice_result = Dice.roll(dice_num, aim, delta);
        let event: Event = new Event();
        this.events.push(event);
        event.type = EventType.Dice;
        event.dice = this.dice_result;
        event.step = this.step;
        event.moneys[player_id] = 1;
        this.done(Phase.DiceRoll);
        return true;
    }

    public facilityAction(): boolean {
        let number: number = this.dice_result.result();
        if (number < 1 || 12 < number) {
            this.done(Phase.FacilityAction);
            return true;
        }

        let facilities: CardId[] = [];
        for (let y: number = 0; y < 5; y++) {
            let card_id: CardId = this.getCardIdOnBoard(number - 1, 4 - y);
            if (card_id !== -1) {
                facilities.push(card_id);
            }
        }

        let type_order: FacilityType[] =
            [FacilityType.Blue, FacilityType.Green, FacilityType.Red, FacilityType.Purple];
        for (let type of type_order) {
            for (let card_id of facilities) {
                let facility: Facility = this.getFacility(card_id);
                if (facility.getType() !== type) {
                    continue;
                }
                this.doFacilityAction(card_id);
            }
        }
        this.done(Phase.FacilityAction);
        return true;
    }

    public moveMoney(player_id_from: PlayerId, player_id_to: PlayerId, money: number): number {
        if (player_id_from === player_id_to) {
            return 0;
        }
        if (money < 0) {
            return this.moveMoney(player_id_to, player_id_from, -money);
        }
        let actual: number = -(this.getPlayer(player_id_from).addMoney(-money));
        this.getPlayer(player_id_to).addMoney(actual);
        return actual;
    }

    public doFacilityAction(card_id: CardId) {
        let facility: Facility = this.getFacility(card_id);
        let player_id: PlayerId = this.getCurrentPlayerId();
        let owner_id: PlayerId = this.getOwnerId(card_id);
        let owner: Player = this.getOwner(card_id);
        let event: Event = new Event();
        event.step = this.step;
        event.card_id = card_id;

        // TODO: Add event log.
        if (facility.getType() === FacilityType.Blue) {
            let amount: number = owner.addMoney(facility.getPropertyValue());
            event.type = EventType.Blue;
            event.moneys[owner_id] += amount;
        }
        else if (facility.getType() === FacilityType.Green) {
            if (player_id === owner_id) {
                let amount: number = owner.addMoney(facility.getPropertyValue());
                event.type = EventType.Green;
                event.moneys[owner_id] += amount;
            }
        }
        else if (facility.getType() === FacilityType.Red) {
            if (player_id !== owner_id) {
                let value: number = facility.getPropertyValue();
                let amount: number = this.moveMoney(player_id, owner_id, value);
                event.type = EventType.Red;
                event.moneys[player_id] -= amount;
                event.moneys[owner_id] += amount;
            }
        }
        else if (facility.getType() === FacilityType.Purple) {
            if (player_id === owner_id) {
                let value: number = facility.getPropertyValue();
                event.type = EventType.Purple;
                for (let pid: number = 0; pid < this.players.length; ++pid) {
                    if (pid === owner_id) {
                        continue;
                    }
                    let amount: number = this.moveMoney(pid, owner_id, value);
                    event.moneys[pid] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
        }

        if (event.type !== EventType.None) {
            this.events.push(event);
        }
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

    // Build a facility in the player's talon.
    // No overwrite an existing facility or no exceed the cost of the player's money.
    public buildInitialFacility(player_id: PlayerId) {
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

    public setLandmark(): boolean {  // Reserve the area for landmark.
        const landmark_data_id: number = 10000;
        let landmark: Facility = new Facility(landmark_data_id);
        let landmark_id: CardId = this.card_manager.addLandmark(landmark);

        let positions: [number, number][] = shuffle(this.availablePosition(landmark_id));
        if (positions.length === 0) {
            console.error("Landmark cannot be built.");
            return false;
        }

        let [x, y] = positions[0];
        this.board.setCardId(x, y, landmark_id, landmark.size);
        return true;
    }

    public useCharacter(player_id: PlayerId, card_id: CardId): boolean {
        if (!this.isValid(player_id, Phase.CharacterCard)) {
            return false;
        }

        // Is character.
        if (!this.isCharacter(card_id)) {
            return false;
        }

        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return false;
        }

        // Add card to the effect manager.
        let character: Character = this.card_manager.getCharacter(card_id);
        let event: Event = new Event();
        event.type = EventType.Character;
        event.card_id = card_id;
        event.step = this.step;
        this.events.push(event);

        if (character.type === CharacterType.DrawCards) {
            let i: number = 0;
            for (; i < character.getPropertyValue(); ++i) {
                if (this.getPlayerCards(player_id).dealToHand() === -1) {
                    break;
                }
            }
            event.moneys[player_id] = i;  // TODO: rename moneys to values.
        }
        else {
            this.effect_manager.addCard(character.data_id, this.round, this.turn);
        }

        // Move the card to discard.
        if (!this.card_manager.moveHandToDiscard(card_id)) {
            // Something is wrong.
            console.warn(`moveHandToDiscard(${card_id}) failed.`);
            return false;
        }

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

    public buildFacility(player_id: PlayerId, x: number, y: number,
                         card_id: CardId): boolean {
        // Facility is a landmark?
        if (this.card_manager.isLandmark(card_id)) {
            return this.buildLandmark(player_id, card_id);
        }

        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return false;
        }

        // Is pass?  (valid action, but not build a facility).
        if (x === -1 && y === -1 && card_id === -1) {
            this.done(Phase.BuildFacility);
            return true;
        }

        // Facility is valid?
        let facility: Facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return false;
        }

        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return false;
        }

        // Facility's owner is valid?
        let facility_owner: PlayerId = this.getOwnerId(card_id);
        if (facility_owner !== player_id) {
            return false;
        }

        // Facility's area is valid?
        let area: number = x + 1;
        if (!this.card_manager.isInArea(area, card_id)) {
            return false;
        }

        let event: Event = new Event();
        let overlapped: CardId[] = this.getOverlappedFacilities(x, y, facility.size);

        for (let card_id_on_board of overlapped) {
            // Facility on the board is overwritable?
            if (!this.card_manager.canOverwrite(card_id_on_board)) {
                return false;
            }
        }

        // Money is valid?
        let overwrite_costs: number[] = this.getOverwriteCosts(x, y, facility.size);
        let total_cost: number = facility.cost;
        for (let i: number = 0; i < overwrite_costs.length; ++i) {
            total_cost += overwrite_costs[i];
        }

        let player: Player = this.players[player_id];
        if (total_cost > player.getMoney()) {
            return false;
        }

        // Update the data.
        this.board.removeCards(x, y, facility.size);
        for (let card_id_on_board of overlapped) {
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

        // Merge overwrite_costs and total_cost;
        overwrite_costs[player_id] -= total_cost;

        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Build;
        event.moneys = overwrite_costs;
        event.card_id = card_id;

        this.board.setCardId(x, y, card_id, facility.size);
        for (let i: number = 0; i < this.players.length; ++i) {
            this.players[i].addMoney(overwrite_costs[i]);
        }

        this.done(Phase.BuildFacility);
        return true;
    }

    public buildLandmark(player_id: PlayerId, card_id: CardId): boolean {
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return false;
        }

        // Is a landmark?
        if (!this.card_manager.isLandmark(card_id)) {
            return false;
        }

        // Facility is valid?
        let facility: Facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return false;
        }

        // Isn't already built?
        let facility_owner: PlayerId = this.getOwnerId(card_id);
        if (facility_owner !== -1) {
            // Already built.
            return false;
        }

        // Money is valid?
        let player: Player = this.players[player_id];
        let cost: number = facility.getCost();
        let balance: number = player.getMoney() - cost;
        if (balance < 0) {
            return false;
        }

        // Update the data.
        player.setMoney(balance);
        this.card_manager.buildLandmark(player_id, card_id);

        let event: Event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Build;
        event.moneys[player_id] -= cost;
        event.card_id = card_id;

        this.done(Phase.BuildFacility);
        return true;
    }

    public paySalary(): boolean {
        let salary: number = this.getCurrentPlayer().paySalary();

        let event: Event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Salary;
        event.moneys[this.current_player_id] += salary;

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
        event.moneys[player_id] = -1;

        // TODO: Do not end the game. Swith to AI.
        this.phase = Phase.EndGame;
        this.step++;
        return true;
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
}
