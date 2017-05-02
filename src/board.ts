import { Dice, DiceResult } from "./dice";

export type PlayerId = number;

export class Facility {
    private name: string;
    private cost: number;
    private player_id: PlayerId;
    constructor(name: string, cost: number, player_id: PlayerId) {
        this.name = name;
        this.cost = cost;
        this.player_id = player_id;
    }

    public toJSON(): Object {
        return {
            class_name: "Facility",
            name: this.name,
            cost: this.cost,
            player_id: this.player_id,
        }
    }

    static fromJSON(json) {
        return new Facility(json.name, json.cost, json.player_id);
    }

    public getName(): string {
        return this.name;
    }
    public getCost(): number {
        return this.cost;
    }
    public getPlayerId(): PlayerId {
        return this.player_id;
    }
}

export class Player {
    readonly id: PlayerId;
    readonly name: string;
    private money: number;
    readonly salary: number;
    readonly team: number;

    constructor(id: PlayerId, name: string, money: number, salary: number,
        team: number) {
        this.id = id;
        this.name = name;
        this.money = money;
        this.salary = salary;
        this.team = team;
    }

    public toJSON(): Object {
        return {
            class_name: "Player",
            id: this.id,
            name: this.name,
            money: this.money,
            salary: this.salary,
            team: this.team,
        }
    }

    static fromJSON(json): Player {
        return new Player(json.id, json.name, json.money, json.salary, json.color);
    }

    public getMoney(): number {
        return this.money;
    }

    public setMoney(money: number): void {
        this.money = money;
    }

    public addMoney(money: number): number {
        let return_value = this.money + money;
        this.money = Math.max(return_value, 0);
        return return_value;
    }

    public paySalary(): void {
        this.money += this.salary;
    }
}

export enum Steps {
    // CardDraw,
    StartTurn,
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
    private step: Steps;

    constructor() {
        this.step = Steps.DiceRoll;
    }

    public toJSON(): Object {
        return {
            class_name: "State",
            step: this.step,
        }
    }

    static fromJSON(json): State {
        let state: State = new State();
        state.step = json.step;
        return state;
    }

    public done(step: Steps): void {
        if (this.step == step && step == Steps.DiceRoll) {
            this.step = Steps.PaySalary;
            return;
        }

        if (this.step == step && step == Steps.PaySalary) {
            this.step = Steps.BuildFacility;
            return;
        }

        if (this.step == step && step == Steps.BuildFacility) {
            this.step = Steps.EndTurn;
            return;
        }

        if (this.step == step && step == Steps.EndTurn) {
            this.step = Steps.DiceRoll;
            return;
        }
    }

    public getStep(): Steps {
        return this.step;
    }
}

export class Session {
    private board: Board;
    private players: Player[];
    private state: State;
    private round: number;
    private turn: number;
    private current_player_id: PlayerId;
    private dice_result: DiceResult;  // TODO: change it to Events.

    constructor() {
        this.board = new Board();
        this.players = [];
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
            state: this.state.toJSON(),
            round: this.round,
            turn: this.turn,
            current_player_id: this.current_player_id,
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
        }
    }

    static fromJSON(json): Session {
        let board: Board = Board.fromJSON(json.board);
        let players: Player[] =
            json.players.map(player => { return Player.fromJSON(player); });
        let state: State = State.fromJSON(json.state);
        let session: Session = new Session();
        session.board = board;
        session.players = players;
        session.state = state;
        session.round = json.round;
        session.turn = json.turn;
        session.current_player_id = json.current_player_id;
        session.dice_result = json.dice_result ? DiceResult.fromJSON(json.dice_result) : null;
        return session;
    }

    public doNext(): boolean {
        if (this.state.getStep() == Steps.PaySalary) {
            return this.paySalary();
        }
        if (this.state.getStep() == Steps.EndTurn) {
            return this.endTurn();
        }
        return false;
    }

    //public addHandler(step: Steps, handler: () => void): void {
    //}

    public addPlayer(name: string, money: number, salary: number): boolean {
        let player_id: PlayerId = this.players.length;
        if (player_id > 4) {
            return false;
        }
        // team == player_id (no 2vs2 so far).
        this.players.push(new Player(player_id, name, money, salary, player_id));
        return true;
    }

    public isValid(player_id: PlayerId, step: Steps): boolean {
        return (this.current_player_id == player_id && this.state.getStep() == step);
    }

    public diceRoll(player_id: number, dice_num: number, aim: number): boolean {
        if (!this.isValid(player_id, Steps.DiceRoll)) {
            return false;
        }
        this.dice_result = Dice.roll(dice_num, aim);
        this.state.done(Steps.DiceRoll);
        return true;
    }

    private getOverwriteCost(facility_on_board: Facility,
        player_id: PlayerId): number {
        if (!facility_on_board) {
            return 0;
        }
        if (facility_on_board.getPlayerId() == player_id) {
            return 0;
        }
        return facility_on_board.getCost() * 2;
    }

    public buildFacility(player_id: PlayerId, x: number, y: number,
        facility: Facility): boolean {
        // State is valid?
        if (!this.isValid(player_id, Steps.BuildFacility)) {
            return false;
        }

        // Player ID is valid?
        if (player_id >= this.players.length) {
            return false;
        }

        // Facility's owner is valid?
        if (facility.getPlayerId() != player_id) {
            return false;
        }

        // Money is valid?
        let player: Player = this.players[player_id];
        let facility_on_board: Facility = this.board.getFacility(x, y);
        let overwrite_cost: number = this.getOverwriteCost(facility_on_board, player_id);
        let total_cost: number = facility.getCost() + overwrite_cost;
        let money: number = player.getMoney();
        if (total_cost > money) {
            return false;
        }

        // Update the data.
        this.board.buildFacility(x, y, facility);
        player.setMoney(money - total_cost);
        if (overwrite_cost > 0) {
            this.players[facility_on_board.getPlayerId()].addMoney(overwrite_cost);
        }
        // TODO: move facility_on_board to recycle box.

        this.state.done(Steps.BuildFacility);
        return true;
    }

    public paySalary(): boolean {
        this.getCurrentPlayer().paySalary();
        this.state.done(Steps.PaySalary);
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

        this.state.done(Steps.EndTurn);
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
    public getCurrentPlayerId(): PlayerId {
        return this.current_player_id;
    }
    public getCurrentPlayer(): Player {
        return this.getPlayer(this.current_player_id);
    }
    public getPlayer(player_id: PlayerId): Player {
        if (player_id == null) {
            return null;
        }
        return this.players[player_id];
    }
    public getDiceResult(): DiceResult {
        return this.dice_result;
    }
}

export class Field {
    private facility: Facility;
    readonly x: number;  // dice pips - 1
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toJSON(): Object {
        return {
            class_name: "Field",
            facility: this.facility ? this.facility.toJSON() : null,
            x: this.x,
            y: this.y,
        }
    }

    static fromJSON(json): Field {
        let field: Field = new Field(json.x, json.y);
        if (json.facility) {
            field.facility = Facility.fromJSON(json.facility);
        }
        return field;
    }

    public getFacility(): Facility {
        return this.facility;
    }

    public buildFacility(facility: Facility): void {
        this.facility = facility;
    }

    debugString(): string {
        if (this.facility == undefined) {
            return `(${this.x},${this.y})`;
        }
        else {
            return this.facility.getName();
        }
    }
}

export class Board {
    readonly fields: Field[][];
    readonly row: number = 5;
    readonly column: number = 12;

    constructor(fields = null) {
        if (fields) {
            this.fields = fields;
        }
        else {
            this.fields = [];
            for (let x: number = 0; x < this.column; ++x) {
                this.fields[x] = [];
                for (let y: number = 0; y < this.row; ++y) {
                    this.fields[x][y] = new Field(x, y);
                }
            }
        }
    }

    public toJSON(): Object {
        let fields = [];
        for (let x: number = 0; x < this.column; ++x) {
            fields[x] = [];
            for (let y: number = 0; y < this.row; ++y) {
                fields[x][y] = this.fields[x][y].toJSON();
            }
        }

        return {
            class_name: "Board",
            fields: fields,
            row: this.row,
            column: this.column,
        }
    }

    static fromJSON(json): Board {
        let fields = [];
        for (let x: number = 0; x < json.column; ++x) {
            fields[x] = [];
            for (let y: number = 0; y < json.row; ++y) {
                fields[x][y] = Field.fromJSON(json.fields[x][y]);
            }
        }
        return new Board(fields);
    }

    buildFacility(x: number, y: number, facility: Facility): void {
        this.fields[x][y].buildFacility(facility);
    }

    getFacility(x: number, y: number): Facility {
        return this.fields[x][y].getFacility();
    }

    debugString(): string {
        let output: string = "";
        for (let y: number = 0; y < this.row; ++y) {
            for (let x: number = 0; x < this.column; ++x) {
                output += this.fields[x][y].debugString();
            }
            output += "\n";
        }
        return output;
    }
}
