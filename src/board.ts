import { Dice, DiceResult } from "./dice";
import { CardId, FacilityType, Facility } from "./facility";

export type PlayerId = number;

export class Player {
    readonly user_id: string;
    readonly id: PlayerId;
    readonly name: string;
    private money: number;
    readonly salary: number;
    readonly team: number;
    private is_auto: boolean;

    constructor(user_id: string, id: PlayerId, name: string, money: number, salary: number,
        team: number, is_auto: boolean = false) {
        this.user_id = user_id;
        this.id = id;
        this.name = name;
        this.money = money;
        this.salary = salary;
        this.team = team;
        this.is_auto = is_auto;
    }

    public toJSON(): Object {
        return {
            class_name: "Player",
            user_id: this.user_id,
            id: this.id,
            name: this.name,
            money: this.money,
            salary: this.salary,
            team: this.team,
            is_auto: this.is_auto,
        }
    }

    static fromJSON(json): Player {
        return new Player(json.user_id, json.id, json.name, json.money, json.salary, json.team,
                          json.is_auto);
    }

    public getMoney(): number {
        return this.money;
    }

    public setMoney(money: number): void {
        this.money = money;
    }

    public addMoney(money: number): number {
        if (this.money + money < 0) {
            money = -this.money;
        }
        this.money += money;
        return money;  // can be less than money.
    }

    public paySalary(): number {
        this.money += this.salary;
        return this.salary;
    }

    public isAuto(): boolean {
        return this.is_auto;
    }

    public setAuto(is_auto: boolean): void {
        this.is_auto = is_auto;
    }
}

export const NO_FACILITY: number = -1;
export const MULTIPLE: number = -2;  // Used for facilities whose size is more than 1.

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

    public removeCards(x: number, y: number, size: number): CardId[] {
        let removed: CardId[] = [];
        let xi: number = x;

        // Find the left most.
        if (this.field[x][y] === MULTIPLE) {
            for (; xi >= 0; --xi) {
                if (this.field[xi][y] !== MULTIPLE) {
                    break;
                }
            }
        }

        for (; xi < x + size; xi++) {
            // Delete the left most, which has the card id.
            let card_id: CardId = this.field[xi][y];
            this.field[xi][y] = NO_FACILITY;
            if (card_id === MULTIPLE || card_id === NO_FACILITY) {
                continue;
            }

            removed.push(card_id);
        }

        // Delete the rest of multiple parts.
        for (; xi < this.column; ++xi) {
            if (this.field[xi][y] !== MULTIPLE) {
                break;
            }
            this.field[xi][y] = NO_FACILITY;
        }
        return removed;
    }

    public setCardId(x: number, y: number, card_id: CardId, size: number): void {
        this.field[x][y] = card_id;
        for (let i: number = 1; i < size; ++i) {
            this.field[x+i][y] = MULTIPLE;
        }
    }

    public getCardId(x: number, y: number): CardId {
        let card_id: CardId = NO_FACILITY;
        for (let i: number = x; i >= 0; --i) {
            card_id = this.field[i][y];
            if (card_id !== MULTIPLE) {
                break;
            }
        }
        return card_id;
    }

    public getRawCardId(x: number, y: number): CardId {
        return this.field[x][y];
    }

    public getPosition(card_id: CardId): [number, number] {
        for (let y: number = 0; y < this.row; ++y) {
            for (let x: number = 0; x < this.column; ++x) {
                if (this.field[x][y] === card_id) {
                    return [x, y];
                }
            }
        }
        return [-1, -1];
    }

    public debugString(): string {
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
