import { Dice, DiceResult } from "./dice";
import { CardId, FacilityType, Facility } from "./facility";

export type PlayerId = number;

export class Player {
    readonly matching_id: number;
    readonly id: PlayerId;
    readonly name: string;
    private money: number;
    readonly salary: number;
    readonly team: number;

    constructor(matching_id: number, id: PlayerId, name: string, money: number, salary: number,
        team: number) {
        this.matching_id = matching_id;
        this.id = id;
        this.name = name;
        this.money = money;
        this.salary = salary;
        this.team = team;
    }

    public toJSON(): Object {
        return {
            class_name: "Player",
            matching_id: this.matching_id,
            id: this.id,
            name: this.name,
            money: this.money,
            salary: this.salary,
            team: this.team,
        }
    }

    static fromJSON(json): Player {
        return new Player(json.matching_id, json.id, json.name, json.money, json.salary, json.team);
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

export class Board {
    private field: CardId[][];
    readonly row: number;
    readonly column: number;

    constructor(field: CardId[][] = null, row: number = 5, column: number = 12) {
        this.row = row;
        this.column = column;
        if (field) {
            this.field = field;
        }
        else {
            this.field = [];
            for (let x: number = 0; x < this.column; ++x) {
                this.field[x] = [];
                for (let y: number = 0; y < this.row; ++y) {
                    this.field[x][y] = -1;  // NO_FACILITY
                }
            }
        }
    }

    public toJSON(): Object {
        return {
            class_name: "Board",
            field: this.field,
            row: this.row,
            column: this.column,
        }
    }

    static fromJSON(json): Board {
        return new Board(json.field, json.row, json.column);
    }

    setCardId(x: number, y: number, card_id: CardId): void {
        this.field[x][y] = card_id;
    }

    getCardId(x: number, y: number): CardId {
        return this.field[x][y];
    }

    getPosition(card_id: CardId): [number, number] {
        for (let y: number = 0; y < this.row; ++y) {
            for (let x: number = 0; x < this.column; ++x) {
                if (this.field[x][y] === card_id) {
                    return [x, y];
                }
            }
        }
        return [-1, -1];
    }

    debugString(): string {
        let output: string = "";
        for (let y: number = 0; y < this.row; ++y) {
            for (let x: number = 0; x < this.column; ++x) {
                output += this.field[x][y] + ", ";
            }
            output += "\n";
        }
        return output;
    }
}
