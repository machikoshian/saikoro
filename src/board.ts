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
