import { Dice, DiceResult } from "./dice";
import { FacilityId, FacilityType, Facility } from "./facility";

export type PlayerId = number;

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
        return return_value - this.money;  // can be less than money.
    }

    public paySalary(): void {
        this.money += this.salary;
    }
}

export class Field {
    private facility_id: FacilityId;
    readonly x: number;  // dice pips - 1
    readonly y: number;

    constructor(x: number, y: number, facility_id: FacilityId = -1) {
        this.x = x;
        this.y = y;
        this.facility_id = facility_id;
    }

    public toJSON(): Object {
        return {
            class_name: "Field",
            facility_id: this.facility_id,
            x: this.x,
            y: this.y,
        }
    }

    static fromJSON(json): Field {
        return new Field(json.x, json.y, json.facility_id);
    }

    public getFacilityId(): FacilityId {
        return this.facility_id;
    }

    public setFacilityId(facility_id: FacilityId): void {
        this.facility_id = facility_id;
    }

    debugString(): string {
        return `(${this.x},${this.y},${this.facility_id})`;
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

    setFacilityId(x: number, y: number, facility_id: FacilityId): void {
        this.fields[x][y].setFacilityId(facility_id);
    }

    getFacilityId(x: number, y: number): FacilityId {
        return this.fields[x][y].getFacilityId();
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
