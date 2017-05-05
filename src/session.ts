import { Dice, DiceResult } from "./dice";
import { Player, Board, Field, PlayerId } from "./board";
import { FacilityId, FacilityType, Facility } from "./facility";

export class PlayerCards {
    private talon: FacilityId[];    // 山札
    private hand: FacilityId[];     // 手札
    private field: FacilityId[];    // 使用中 (建設中)
    private discard: FacilityId[];  // 捨て札

    constructor(
        talon: FacilityId[] = [],
        hand: FacilityId[] = [],
        field: FacilityId[] = [],
        discard: FacilityId[] = []) {
        this.talon = talon;
        this.hand = hand;
        this.field = field;
        this.discard = discard;
    }

    public toJSON(): Object {
        return {
            class_name: "PlayerCards",
            talon: this.talon,
            hand: this.hand,
            field: this.field,
            discard: this.discard,
        }
    }

    static fromJSON(json): PlayerCards {
        return new PlayerCards(json.talon, json.hand, json.field, json.discard);
    }

    public getSize(): number {
        return this.talon.length + this.hand.length + this.field.length + this.discard.length;
    }

    private getIndex(facility_id: FacilityId, facility_array: FacilityId[]): number {
        // indexOf is type sensitive (e.g. "1" is different value from 1).
        // facility_id could be a string.
        if (typeof facility_id !== 'number') {
            console.log(`WARNING: facility_id(${facility_id}) is not a number`);
            facility_id = Number(facility_id);
        }
        return facility_array.indexOf(facility_id);
    }

    private deleteFacilityId(facility_id: FacilityId, facility_array: FacilityId[]): boolean {
        let index: number = this.getIndex(facility_id, facility_array);
        if (index < 0) {
            console.log("WARNING: deleteFacilityId - index < 0.");
            return false;
        }
        facility_array.splice(index, 1);
        return true;
    }

    private moveFacilityId(
        facility_id: FacilityId, array_from: FacilityId[], array_to: FacilityId[]): boolean {
        if (facility_id < 0) {
            console.log("WARNING: facility_id < 0.");
            return false;
        }
        if (!this.deleteFacilityId(facility_id, array_from)) {
            console.log("WARNING: deleteFacilityId failed.");
            console.log(facility_id);
            console.log(array_from);
            return false;
        }
        array_to.push(facility_id);
        return true;
    }

    public addTalon(facility_id: FacilityId): boolean {
        if (facility_id < 0) {
            console.log("WARNING: facility_id < 0.");
            return false;
        }
        this.talon.push(facility_id);
        return true;
    }

    public getHand(): FacilityId[] {
        return this.hand;
    }

    // Move a random facility from Talon to Hand.
    public dealToHand(): FacilityId {
        if (this.talon.length == 0) {
            return -1;
        }
        let random_index: number = Math.floor(Math.random() * this.talon.length);
        let facility_id: FacilityId = this.talon[random_index];
        this.moveTalonToHand(facility_id);
        return facility_id;
    }

    public getTalonSize(): number {
        return this.talon.length;
    }

    public getHandSize(): number {
        return this.hand.length;
    }

    public moveTalonToHand(facility_id: FacilityId): boolean {
        return this.moveFacilityId(facility_id, this.talon, this.hand);
    }

    public isInHand(facility_id: FacilityId): boolean {
        let index: number = this.getIndex(facility_id, this.hand);
        return (index >= 0);
    }

    public moveHandToField(facility_id: FacilityId): boolean {
        return this.moveFacilityId(facility_id, this.hand, this.field);
    }

    public moveFieldToDiscard(facility_id: FacilityId): boolean {
        return this.moveFacilityId(facility_id, this.field, this.discard);
    }
}

export class CardManager {
    private facilities: { [key: number]: Facility; };
    private player_cards_list: PlayerCards[];
    readonly max_card_size: number = 1000;

    constructor(
        facilities: { [key: number]: Facility; } = {},
        player_cards_list: PlayerCards[] = null) {
        this.facilities = facilities;
        if (player_cards_list) {
            this.player_cards_list = player_cards_list;
        } else {
            this.player_cards_list = [];
            for (let i: number = 0; i < 4; i++) {
                this.player_cards_list.push(new PlayerCards());
            }
        }
    }

    public toJSON(): Object {
        let facility_json = {};
        for (let id in this.facilities) {
            facility_json[id] = this.facilities[id].toJSON();
        }
        return {
            class_name: "CardManager",
            facilities: facility_json,
            player_cards_list: this.player_cards_list.map(cards => { return cards.toJSON(); }),
        }
    }

    static fromJSON(json): CardManager {
        let facilities: { [key: number]: Facility; } = {};
        for (let id in json.facilities) {
            facilities[id] = Facility.fromJSON(json.facilities[id]);
        }
        return new CardManager(
            facilities,
            json.player_cards_list.map(cards => { return PlayerCards.fromJSON(cards); }),
        );
    }

    public addFacility(player_id: PlayerId, facility: Facility): boolean {
        let player_cards: PlayerCards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        let size: number = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // FacilityId is separated per player (i.e. player1 = 1000 - 1999).
        let facility_id: FacilityId = player_id * this.max_card_size + size;
        this.facilities[facility_id] = facility;
        player_cards.addTalon(facility_id);
        return true;
    }

    public getFacility(facility_id: FacilityId): Facility {
        if (facility_id < 0) {
            return null;
        }
        return this.facilities[facility_id];
    }

    public getOwner(facility_id: FacilityId): PlayerId {
        if (facility_id < 0) {
            return -1;
        }
        // TODO: Check actual existance of facility_id.
        // TODO: Owner can be changed while the game.
        return Math.floor(facility_id / this.max_card_size);
    }

    public getPlayerCards(player_id: PlayerId): PlayerCards {
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.log("WARNING: player_id is invalid.");
            return null;
        }
        return this.player_cards_list[player_id];
    }

    public getPlayerCardsFromFacilityId(facility_id: FacilityId): PlayerCards {
        return this.player_cards_list[this.getOwner(facility_id)];
    }

    public isInHand(player_id: PlayerId, facility_id: FacilityId): boolean {
        if (facility_id < 0) {
            console.log("WARNING: facility_id < 0.");
            return false;
        }
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.log("WARNING: player_id is invalid.");
            return false;
        }

        // Check is owner is correct.
        if (this.getOwner(facility_id) != player_id) {
            return false;
        }

        return this.player_cards_list[player_id].isInHand(facility_id);
    }

    public isInArea(area: number, facility_id: FacilityId): boolean {
        if (facility_id < 0) {
            console.log("WARNING: facility_id < 0.");
            return false;
        }
        return (this.facilities[facility_id].getArea() == area);
    }

    public moveFieldToDiscard(facility_id: FacilityId): boolean {
        if (facility_id < 0) {
            console.log("WARNING: facility_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromFacilityId(facility_id).moveFieldToDiscard(facility_id);
    }

    public moveHandToField(facility_id: FacilityId): boolean {
        if (facility_id < 0) {
            console.log("WARNING: facility_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromFacilityId(facility_id).moveHandToField(facility_id);
    }

    public sortFacilitiesForHand(facilities: FacilityId[]): FacilityId[] {
        return facilities.sort((id1, id2) => {
            let f1: Facility = this.facilities[id1];
            let f2: Facility = this.facilities[id2];
            if (f1.area !== f2.area) {
                return f1.area - f2.area;
            }
            else if (f1.type !== f2.type) {
                return f1.type - f2.type;
            }
            else if (f1.cost !== f2.cost) {
                return f1.cost - f2.cost;
            }
            else if (f1.name !== f2.name) {
                return f1.name < f2.name ? -1 : 1;
            }
            return 0;
        });
    }
}

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
}

export class State {
    private phase: Phase;
    private step: number;  // Server starts from 1. Client starts from 0.

    constructor(phase: Phase = Phase.StartGame, step: number = 1) {
        this.phase = phase;
        this.step = step;
    }

    public toJSON(): Object {
        return {
            class_name: "State",
            phase: this.phase,
            step: this.step,
        }
    }

    static fromJSON(json): State {
        return new State(json.phase, json.step);
    }

    public done(phase: Phase): void {
        if (this.phase !== phase) {
            return;
        }
        this.step++;
        if (phase == Phase.StartGame) {
            this.phase = Phase.StartTurn;
            return;
        }

        if (phase == Phase.StartTurn) {
            this.phase = Phase.DiceRoll;
            return;
        }

        if (phase == Phase.DiceRoll) {
            this.phase = Phase.FacilityAction;
            return;
        }

        if (phase == Phase.FacilityAction) {
            this.phase = Phase.PaySalary;
            return;
        }

        if (phase == Phase.PaySalary) {
            this.phase = Phase.BuildFacility;
            return;
        }

        if (phase == Phase.BuildFacility) {
            this.phase = Phase.EndTurn;
            return;
        }

        if (phase == Phase.EndTurn) {
            this.phase = Phase.StartTurn;
            return;
        }
    }

    public getPhase(): Phase {
        return this.phase;
    }

    public getStep(): number {
        return this.step;
    }
}

export class Session {
    private board: Board;
    private players: Player[];
    private card_manager: CardManager;
    private state: State;
    private round: number;
    private turn: number;
    private current_player_id: PlayerId;
    private dice_result: DiceResult;  // TODO: change it to Events.

    constructor() {
        this.board = new Board();
        this.players = [];
        this.card_manager = new CardManager();
        this.state = new State();
        this.round = 0;
        this.turn = 0;
        this.current_player_id = 0;
        this.dice_result = null;
    }

    public toJSON(): Object {
        return {
            class_name: "Session",
            board: this.board.toJSON(),
            players: this.players.map(player => { return player.toJSON(); }),
            card_manager: this.card_manager.toJSON(),
            state: this.state.toJSON(),
            round: this.round,
            turn: this.turn,
            current_player_id: this.current_player_id,
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
        }
    }

    static fromJSON(json): Session {
        let board: Board = Board.fromJSON(json.board);
        let players: Player[] = json.players.map(player => { return Player.fromJSON(player); });
        let state: State = State.fromJSON(json.state);
        let session: Session = new Session();
        session.board = board;
        session.players = players;
        session.card_manager = CardManager.fromJSON(json.card_manager);
        session.state = state;
        session.round = json.round;
        session.turn = json.turn;
        session.current_player_id = json.current_player_id;
        session.dice_result = json.dice_result ? DiceResult.fromJSON(json.dice_result) : null;
        return session;
    }

    public doNext(): boolean {
        let phase: Phase = this.state.getPhase();
        if (phase == Phase.StartGame) {
            return this.startGame();
        }

        if (phase == Phase.StartTurn) {
            return this.startTurn();
        }

        if (phase == Phase.DiceRoll) {
            return false;  // Need interactions.
        }

        if (phase == Phase.FacilityAction) {
            return this.facilityAction();
        }

        if (phase == Phase.PaySalary) {
            return this.paySalary();
        }

        if (phase == Phase.BuildFacility) {
            return false;  // Need interactions.
        }

        if (phase == Phase.EndTurn) {
            return this.endTurn();
        }

        return false;
    }

    public addPlayer(name: string, money: number, salary: number): boolean {
        let player_id: PlayerId = this.players.length;
        if (player_id > 4) {
            return false;
        }
        // team == player_id (no 2vs2 so far).
        this.players.push(new Player(player_id, name, money, salary, player_id));
        return true;
    }

    public addFacility(player_id: PlayerId, facility: Facility): boolean {
        return this.card_manager.addFacility(player_id, facility);
    }

    public isValid(player_id: PlayerId, phase: Phase): boolean {
        return (this.current_player_id == player_id && this.state.getPhase() == phase);
    }

    public startGame(): boolean {
        for (let r: number = 0; r < 5; r++) {
            for (let p: PlayerId = 0; p < this.players.length; p++) {
                this.getPlayerCards(p).dealToHand();
            }
        }
        this.state.done(Phase.StartGame);
        return true;
    }

    public startTurn(): boolean {
        this.getPlayerCards(this.current_player_id).dealToHand();
        this.state.done(Phase.StartTurn);
        return true;
    }

    public diceRoll(player_id: number, dice_num: number, aim: number): boolean {
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        this.dice_result = Dice.roll(dice_num, aim);
        this.state.done(Phase.DiceRoll);
        return true;
    }

    public facilityAction(): boolean {
        let number = this.dice_result.dice1 + this.dice_result.dice2;
        if (this.dice_result.is_miracle) {
            number = this.dice_result.miracle_dice1 + this.dice_result.miracle_dice2;
        }
        let facilities: FacilityId[] = [];
        for (let y: number = 0; y < 5; y++) {
            let facility_id: FacilityId = this.getFacilityIdOnBoard(number - 1, 4 - y);
            if (facility_id !== -1) {
                facilities.push(facility_id);
            }
        }

        let type_order: FacilityType[] =
            [FacilityType.Blue, FacilityType.Green, FacilityType.Red, FacilityType.Purple];
        for (let type of type_order) {
            for (let facility_id of facilities) {
                let facility: Facility = this.getFacility(facility_id);
                if (facility.getType() !== type) {
                    continue;
                }
                this.doFacilityAction(facility_id);
            }
        }
        this.state.done(Phase.FacilityAction);
        return true;
    }

    public moveMoney(player_id_from: PlayerId, player_id_to: PlayerId, money: number): number {
        if (player_id_from === player_id_to) {
            return 0;
        }
        if (money < 0) {
            return this.moveMoney(player_id_to, player_id_from, -money);
        }
        let actual: number = this.getPlayer(player_id_from).addMoney(-money);
        this.getPlayer(player_id_to).addMoney(actual);
        return actual;
    }

    public doFacilityAction(facility_id: FacilityId) {
        let facility: Facility = this.getFacility(facility_id);
        let player_id: PlayerId = this.getCurrentPlayerId();
        let owner_id: PlayerId = this.getOwnerId(facility_id);
        let owner: Player = this.getOwner(facility_id);

        // TODO: Add event log.
        if (facility.getType() == FacilityType.Blue) {
            owner.addMoney(facility.getPropertyValue());
        }
        if (facility.getType() == FacilityType.Green) {
            if (player_id === owner_id) {
                owner.addMoney(facility.getPropertyValue());
            }
        }
        if (facility.getType() == FacilityType.Red) {
            if (player_id !== owner_id) {
                let value: number = facility.getPropertyValue();
                this.moveMoney(player_id, owner_id, value);
            }
        }
        if (facility.getType() == FacilityType.Purple) {
            if (player_id === owner_id) {
                let value: number = facility.getPropertyValue();
                for (let pid: number = 0; pid < this.players.length; ++pid) {
                    this.moveMoney(pid, owner_id, value);
                }
            }
        }
    }

    private getOverwriteCost(facility_id_on_board: FacilityId, player_id: PlayerId): number {
        // No facility on board.
        if (facility_id_on_board == -1) {
            return 0;
        }
        // Same owner.
        if (this.getOwnerId(facility_id_on_board) == player_id) {
            return 0;
        }
        // Double of the builing cost.
        return this.card_manager.getFacility(facility_id_on_board).getCost() * 2;
    }

    public buildFacility(player_id: PlayerId, x: number, y: number,
                         facility_id: FacilityId): boolean {
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return false;
        }

        // Player ID is valid?
        if (player_id >= this.players.length) {
            return false;
        }

        // Facility is valid?
        let facility: Facility = this.card_manager.getFacility(facility_id);
        if (!facility) {
            return false;
        }

        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, facility_id)) {
            return false;
        }

        // Facility's owner is valid?
        let facility_owner: PlayerId = this.getOwnerId(facility_id);
        if (facility_owner != player_id) {
            return false;
        }

        // Facility's area is valid?
        let area: number = x + 1;
        if (!this.card_manager.isInArea(area, facility_id)) {
            return false;
        }

        // Money is valid?
        let player: Player = this.players[player_id];
        let facility_id_on_board: FacilityId = this.board.getFacilityId(x, y);
        let overwrite_cost: number = this.getOverwriteCost(facility_id_on_board, player_id);
        let total_cost: number = facility.getCost() + overwrite_cost;
        let money: number = player.getMoney();
        if (total_cost > money) {
            return false;
        }

        // Update the data.
        // Delete the existing facility.
        if (facility_id_on_board >= 0) {
            if (!this.card_manager.moveFieldToDiscard(facility_id_on_board)) {
                // Something is wrong.
                console.log(`WARING: moveFieldToDiscard(${facility_id_on_board}) failed.`);
                return false;
            }
        }

        // Build the new facility.
        if (!this.card_manager.moveHandToField(facility_id)) {
            // Something is wrong.
            console.log(`WARING: moveHandToField(${facility_id}) failed.`);
            return false;
        }

        this.board.setFacilityId(x, y, facility_id);
        player.setMoney(money - total_cost);
        if (facility_id_on_board >= 0 && overwrite_cost > 0) {
            this.getPlayer(this.getOwnerId(facility_id_on_board)).addMoney(overwrite_cost);
        }

        this.state.done(Phase.BuildFacility);
        return true;
    }

    public paySalary(): boolean {
        this.getCurrentPlayer().paySalary();
        this.state.done(Phase.PaySalary);
        return true;
    }

    public endTurn(): boolean {
        if (this.current_player_id == this.players.length - 1) {
            this.current_player_id = 0;
            this.round += 1;
            this.turn = 0;
        }
        else {
            this.current_player_id += 1;
            this.turn += 1;
        }

        this.state.done(Phase.EndTurn);
        return true;
    }

    public getBoard(): Board {
        return this.board;
    }
    public getPlayers(): Player[] {
        return this.players;
    }
    public getState(): State {
        return this.state;
    }
    public getFacility(facility_id: FacilityId): Facility {
        return this.card_manager.getFacility(facility_id);
    }
    public getFacilityIdOnBoard(x: number, y: number): FacilityId {
        return this.board.getFacilityId(x, y);
    }
    public getFacilityOnBoard(x: number, y: number): Facility {
        return this.card_manager.getFacility(this.getFacilityIdOnBoard(x, y));
    }
    public getOwnerIdOnBoard(x: number, y: number): PlayerId {
        return this.getOwnerId(this.getFacilityIdOnBoard(x, y));
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
    public getSortedHand(player_id: PlayerId): FacilityId[] {
        return this.card_manager.sortFacilitiesForHand(this.getPlayerCards(player_id).getHand());
    }
    public getOwnerId(facility_id: FacilityId): PlayerId {
        return this.card_manager.getOwner(facility_id);
    }
    public getOwner(facility_id: FacilityId): Player {
        return this.getPlayer(this.getOwnerId(facility_id));
    }
    public getDiceResult(): DiceResult {
        return this.dice_result;
    }
}
