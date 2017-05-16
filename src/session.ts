import { Dice, DiceResult } from "./dice";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityDataId, FacilityType, Facility } from "./facility";

function shuffle(array: any[]): any[] {
    let shuffled_array: any[] = array.slice(0);
    for (let l: number = shuffled_array.length; l > 0; --l) {
        let i: number = Math.floor(Math.random() * l);
        [shuffled_array[i], shuffled_array[l-1]] = [shuffled_array[l-1], shuffled_array[i]];
    }
    return shuffled_array;
}

export class PlayerCards {
    private talon: CardId[];    // 山札
    private hand: CardId[];     // 手札
    private field: CardId[];    // 使用中 (建設中)
    private discard: CardId[];  // 捨て札

    constructor(
        talon: CardId[] = [],
        hand: CardId[] = [],
        field: CardId[] = [],
        discard: CardId[] = []) {
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

    private getIndex(card_id: CardId, facility_array: CardId[]): number {
        // indexOf is type sensitive (e.g. "1" is different value from 1).
        // card_id could be a string.
        if (typeof card_id !== "number") {
            console.warn(`card_id(${card_id}) is not a number`);
            card_id = Number(card_id);
        }
        return facility_array.indexOf(card_id);
    }

    private deleteCardId(card_id: CardId, facility_array: CardId[]): boolean {
        let index: number = this.getIndex(card_id, facility_array);
        if (index < 0) {
            console.warn("deleteCardId - index < 0.");
            return false;
        }
        facility_array.splice(index, 1);
        return true;
    }

    private moveCardId(
        card_id: CardId, array_from: CardId[], array_to: CardId[]): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        if (!this.deleteCardId(card_id, array_from)) {
            console.warn("deleteCardId failed.");
            return false;
        }
        array_to.push(card_id);
        return true;
    }

    public addTalon(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        this.talon.push(card_id);
        return true;
    }

    public getTalon(): CardId[] {
        return this.talon;
    }

    public getHand(): CardId[] {
        return this.hand;
    }

    // Move a random facility from Talon to Hand.
    public dealToHand(): CardId {
        if (this.talon.length === 0) {
            return -1;
        }
        let random_index: number = Math.floor(Math.random() * this.talon.length);
        let card_id: CardId = this.talon[random_index];
        this.moveTalonToHand(card_id);
        return card_id;
    }

    public getTalonSize(): number {
        return this.talon.length;
    }

    public getHandSize(): number {
        return this.hand.length;
    }

    public moveTalonToHand(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.talon, this.hand);
    }

    public isInHand(card_id: CardId): boolean {
        let index: number = this.getIndex(card_id, this.hand);
        return (index >= 0);
    }

    // Used for initial build.
    public moveTalonToField(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.talon, this.field);
    }

    public moveHandToField(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.hand, this.field);
    }

    public moveFieldToDiscard(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.field, this.discard);
    }
}

type LandmarkInfo = [CardId, PlayerId];

export class CardManager {
    private facilities: { [key: number]: Facility; };
    private player_cards_list: PlayerCards[];
    private landmarks: LandmarkInfo[];

    readonly max_card_size: number = 1000;
    readonly landmark_id_base: number = 10000;

    constructor(
        facilities: { [key: number]: Facility; } = {},
        player_cards_list: PlayerCards[] = null,
        landmarks: LandmarkInfo[] = []) {
        this.facilities = facilities;
        if (player_cards_list) {
            this.player_cards_list = player_cards_list;
        } else {
            this.player_cards_list = [];
            for (let i: number = 0; i < 4; i++) {
                this.player_cards_list.push(new PlayerCards());
            }
        }
        this.landmarks = landmarks;
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
            landmarks: this.landmarks,
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
            json.landmarks,
        );
    }

    public addFacility(player_id: PlayerId, facility_data_id: FacilityDataId): boolean {
        let player_cards: PlayerCards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        let size: number = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        let card_id: CardId = player_id * this.max_card_size + size;
        this.facilities[card_id] = new Facility(facility_data_id);
        player_cards.addTalon(card_id);
        return true;
    }

    public addLandmark(landmark: Facility): CardId {
        let card_id: CardId = this.landmark_id_base + this.landmarks.length;
        this.facilities[card_id] = landmark;
        this.landmarks.push([card_id, -1]);  // NO_PLAYER.
        return card_id;
    }

    public buildLandmark(player_id: PlayerId, landmark_id: CardId): boolean {
        for (let landmark_info of this.landmarks) {
            if (landmark_info[0] === landmark_id) {
                landmark_info[1] = player_id;
                return true;
            }
        }
        return false;
    }

    public isLandmark(card_id: CardId): boolean {
        for (let landmark_info of this.landmarks) {
            if (landmark_info[0] === card_id) {
                return true;
            }
        }
        return false;
    }

    public getLandmarks(): CardId[] {
        let landmarks: CardId[] = [];
        for (let landmark_info of this.landmarks) {
            landmarks.push(landmark_info[0]);
        }
        return landmarks;
    }

    public getFacility(card_id: CardId): Facility {
        if (card_id < 0) {
            return null;
        }
        return this.facilities[card_id];
    }

    public getOwner(card_id: CardId): PlayerId {
        if (card_id < 0) {
            return -1;
        }
        if (this.isLandmark(card_id)) {
            for (let landmark_info of this.landmarks) {
                if (landmark_info[0] === card_id) {
                    return landmark_info[1];
                }
            }
            return -1;
        }
        // TODO: Check actual existance of card_id.
        // TODO: Owner can be changed while the game.
        return Math.floor(card_id / this.max_card_size);
    }

    public getPlayerCards(player_id: PlayerId): PlayerCards {
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return null;
        }
        return this.player_cards_list[player_id];
    }

    public getPlayerCardsFromCardId(card_id: CardId): PlayerCards {
        if (card_id < 0 || card_id >= this.landmark_id_base) {
            return null;
        }
        return this.player_cards_list[this.getOwner(card_id)];
    }

    public isInHand(player_id: PlayerId, card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return false;
        }

        // Check is owner is correct.
        if (this.getOwner(card_id) != player_id) {
            return false;
        }

        return this.player_cards_list[player_id].isInHand(card_id);
    }

    public isInArea(area: number, card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return (this.facilities[card_id].getArea() == area);
    }

    public moveFieldToDiscard(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveFieldToDiscard(card_id);
    }

    public moveHandToField(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToField(card_id);
    }

    // Used for initial build.
    public moveTalonToField(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveTalonToField(card_id);
    }

    public sortFacilitiesForHand(facilities: CardId[]): CardId[] {
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

    // Check if the facility is overwritable regardless the cost.
    public canOverwrite(card_id: CardId): boolean {
        if (this.isLandmark(card_id)) {
            return false;
        }
        return true;
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
    EndGame,
}

export enum EventType {
    None,
    Blue,
    Green,
    Red,
    Purple,
    Build,
}

export class Event {
    public type: EventType = EventType.None;
    public moneys: number[] = [0, 0, 0, 0];
    public card_id: CardId = null;

    public toJSON(): Object {
        return {
            class_name: "Event",
            type: this.type,
            moneys: this.moneys,
            card_id: this.card_id,
        }
    }

    static fromJSON(json): Event {
        let event = new Event();
        event.type = json.type;
        event.moneys = json.moneys;
        event.card_id = json.card_id;
        return event;
    }
}

export class Session {
    private board: Board;
    private players: Player[];
    private card_manager: CardManager;
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
            events: this.events.map(event => { return event.toJSON(); }),
            step: this.step,
            phase: this.phase,
            round: this.round,
            turn: this.turn,
            current_player_id: this.current_player_id,
            winner: this.winner,
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
        }
    }

    static fromJSON(json): Session {
        let board: Board = Board.fromJSON(json.board);
        let players: Player[] = json.players.map(player => { return Player.fromJSON(player); });
        let session: Session = new Session();
        session.board = board;
        session.players = players;
        session.card_manager = CardManager.fromJSON(json.card_manager);
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

    public done(phase: Phase): void {
        if (this.phase !== phase || this.phase === Phase.EndGame) {
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

        if (phase == Phase.EndTurn) {
            this.phase = Phase.StartTurn;
            return;
        }

        if (phase == Phase.EndGame) {
            // Do nothing.
            return;
        }
    }

    public doNext(): boolean {
        if (this.phase == Phase.StartGame) {
            return this.startGame();
        }

        if (this.phase == Phase.StartTurn) {
            return this.startTurn();
        }

        if (this.phase == Phase.DiceRoll) {
            return false;  // Need interactions.
        }

        if (this.phase == Phase.FacilityAction) {
            return this.facilityAction();
        }

        if (this.phase == Phase.PaySalary) {
            return this.paySalary();
        }

        if (this.phase == Phase.BuildFacility) {
            return false;  // Need interactions.
        }

        if (this.phase == Phase.EndTurn) {
            return this.endTurn();
        }

        if (this.phase == Phase.EndGame) {
            return this.endGame();
        }

        return false;
    }

    public addPlayer(user_id: string, name: string, money: number, salary: number): number {
        let player_id: PlayerId = this.players.length;
        if (player_id > 4) {
            return -1;
        }
        // team == player_id (no 2vs2 so far).
        this.players.push(new Player(user_id, player_id, name, money, salary, player_id));
        return player_id;
    }

    public addFacility(player_id: PlayerId, facility_data_id: FacilityDataId): boolean {
        return this.card_manager.addFacility(player_id, facility_data_id);
    }

    public isValid(player_id: PlayerId, phase: Phase): boolean {
        return (this.current_player_id == player_id && this.phase == phase);
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
        this.getPlayerCards(this.current_player_id).dealToHand();
        this.done(Phase.StartTurn);
        return true;
    }

    public diceRoll(player_id: number, dice_num: number, aim: number): boolean {
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        this.dice_result = Dice.roll(dice_num, aim);
        this.done(Phase.DiceRoll);
        return true;
    }

    public facilityAction(): boolean {
        this.events = [];  // TODO: Consider the location to invalidate events.
        let number = this.dice_result.dice1 + this.dice_result.dice2;
        if (this.dice_result.is_miracle) {
            number = this.dice_result.miracle_dice1 + this.dice_result.miracle_dice2;
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

    private getOverwriteCost(card_id_on_board: CardId, player_id: PlayerId): number {
        // No facility on board.
        if (card_id_on_board == -1) {
            return 0;
        }
        // Same owner.
        if (this.getOwnerId(card_id_on_board) == player_id) {
            return 0;
        }
        // Double of the builing cost.
        return this.card_manager.getFacility(card_id_on_board).getCost() * 2;
    }

    public availablePosition(card_id: CardId): [number, number][] {
        let positions: [number, number][] = [];
        let facility: Facility = this.card_manager.getFacility(card_id);
        // TODO: support multiple x. (e.g. 7-9)
        let area: number = facility.getArea();
        let columns: number[];
        if (area === 0) {
            // area === 0 means anywhere.
            columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        }
        else {
            columns = [area - 1];  // area is 1-origin.
        }
        for (let x of columns) {
            for (let y: number = 0; y < this.board.row; y++) {
                if (this.getCardIdOnBoard(x, y) === -1) {
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
            this.board.setCardId(x, y, card_id);
            player.setMoney(balance);
            return true;
        }

        return true;  // True is returned even if no facility was built.
    }

    public setLandmark(): boolean {  // Reserve the area for landmark.
        const facility_data_id: number = 24;
        let landmark: Facility = new Facility(facility_data_id);
        let landmark_id: CardId = this.card_manager.addLandmark(landmark);

        let positions: [number, number][] = shuffle(this.availablePosition(landmark_id));
        if (positions.length === 0) {
            console.error("Landmark cannot be built.");
            return false;
        }

        let [x, y] = positions[0];
        this.board.setCardId(x, y, landmark_id);
        return true;
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

        // Player ID is valid?
        if (player_id >= this.players.length) {
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
        if (facility_owner != player_id) {
            return false;
        }

        // Facility's area is valid?
        let area: number = x + 1;
        if (!this.card_manager.isInArea(area, card_id)) {
            return false;
        }

        // Facility on the board is overwritable?
        let card_id_on_board: CardId = this.board.getCardId(x, y);
        if (!this.card_manager.canOverwrite(card_id_on_board)) {
            return false;
        }

        // Money is valid?
        let player: Player = this.players[player_id];
        let overwrite_cost: number = this.getOverwriteCost(card_id_on_board, player_id);
        let total_cost: number = facility.getCost() + overwrite_cost;
        let money: number = player.getMoney();
        if (total_cost > money) {
            return false;
        }

        // Update the data.
        // Delete the existing facility.
        if (card_id_on_board >= 0) {
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

        this.events = [];  // TODO: Consider the location to invalidate events.
        let event: Event = new Event();
        this.events.push(event);
        event.type = EventType.Build;
        event.moneys[player_id] -= total_cost;
        event.card_id = card_id;

        this.board.setCardId(x, y, card_id);
        player.setMoney(money - total_cost);
        if (card_id_on_board >= 0 && overwrite_cost > 0) {
            let facility_owner: PlayerId = this.getOwnerId(card_id_on_board);
            event.moneys[facility_owner] += overwrite_cost;
            this.getPlayer(facility_owner).addMoney(overwrite_cost);
        }

        this.done(Phase.BuildFacility);
        return true;
    }

    public buildLandmark(player_id: PlayerId, card_id: CardId): boolean {
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return false;
        }

        // Player ID is valid?
        if (player_id >= this.players.length) {
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

        this.events = [];  // TODO: Consider the location to invalidate events.
        let event: Event = new Event();
        this.events.push(event);
        event.type = EventType.Build;
        event.moneys[player_id] -= cost;
        event.card_id = card_id;

        this.done(Phase.BuildFacility);
        return true;
    }

    public paySalary(): boolean {
        this.getCurrentPlayer().paySalary();
        this.done(Phase.PaySalary);
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

        this.done(Phase.EndTurn);
        return true;
    }

    public endGame(): boolean {
        // Do nothing so far.
        this.done(Phase.EndGame);
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
}
