export enum CharacterType {
    None,
    DiceDelta,  // Add N to dice results.
    DrawCards,  // Draw cards from talon.
    SalaryFactor,  // Multiply the salary.
}

export class CharacterData {
    constructor(
        readonly id: number,  // Unique number.
        readonly name: string,
        readonly type: CharacterType,
        readonly round: number,
        readonly property: {},
    ) {}
}

const CHARACTER_DATA_BASE: number = 1000;
const CHARACTER_DATA: CharacterData[] = [
    new CharacterData(1000, "大学生",  CharacterType.DiceDelta, 1, {"delta": 3}),
    new CharacterData(1001, "幼稚園児", CharacterType.DiceDelta, 2, {"delta": -2}),
    new CharacterData(1002, "執事",   CharacterType.DrawCards, 0, {"value": 2}),
];

export type CharacterDataId = number;

export enum FacilityType {
    Gray,
    Blue,
    Green,
    Red,
    Purple,
}

export class FacilityData {
    constructor(
        readonly id: number,  // Unique number.
        readonly size: number,
        readonly area: number[],  // TODO should be range.
        readonly name: string,
        readonly cost: number,
        readonly type: FacilityType,
        readonly property: {},
        ) {}
}

const FACILITY_DATA: FacilityData[] = [
    new FacilityData(0,  1, [1],    "🌾", 100, FacilityType.Blue,   {"value": 300}),
    new FacilityData(1,  1, [2],    "🐮", 100, FacilityType.Blue,   {"value": 250}),
    new FacilityData(2,  2, [3],    "👾", 200, FacilityType.Purple, {"value": 300}),
    new FacilityData(3,  1, [4],    "🐝", 200, FacilityType.Blue,   {"value": 300}),
    new FacilityData(4,  1, [5],    "🍴", 200, FacilityType.Red,    {"value": 400}),
    new FacilityData(5,  1, [6],    "💆", 150, FacilityType.Green,  {"value": 450}),
    new FacilityData(6,  1, [7],    "👕", 200, FacilityType.Green,  {"value": 400}),
    new FacilityData(7,  1, [8],    "🐔", 250, FacilityType.Red,    {"value": 250}),
    new FacilityData(8,  1, [8,9],  "🌻", 200, FacilityType.Blue,   {"value": 400}),
    new FacilityData(9,  1, [10],   "🍣", 100, FacilityType.Red,    {"value": 400}),
    new FacilityData(10, 2, [10],   "🗻", 300, FacilityType.Blue,   {"value": 500}),
    new FacilityData(11, 1, [12],   "🍍", 150, FacilityType.Blue,   {"value": 650}),

    new FacilityData(12, 1, [1],  "🍣", 200, FacilityType.Red,    {"value": 600}),
    new FacilityData(13, 1, [2],  "🐟", 100, FacilityType.Green,  {"value": 550}),
    new FacilityData(14, 1, [3],  "💈", 100, FacilityType.Green,  {"value": 450}),
    new FacilityData(15, 1, [4],  "📖", 200, FacilityType.Green,  {"value": 400}),
    new FacilityData(16, 1, [5],  "📰", 100, FacilityType.Purple, {"value": 300}),
    new FacilityData(17, 1, [6],  "🍱", 100, FacilityType.Red,    {"value": 300}),
    new FacilityData(18, 1, [7],  "🍕", 100, FacilityType.Red,    {"value": 300}),
    new FacilityData(19, 1, [8],  "🍅", 100, FacilityType.Blue,   {"value": 250}),
    new FacilityData(20, 1, [9],  "🚗", 400, FacilityType.Green,  {"value": 800}),
    new FacilityData(21, 1, [10], "🍎", 100, FacilityType.Blue,   {"value": 350}),
    new FacilityData(22, 1, [11], "👓", 100, FacilityType.Green,  {"value": 1000}),
    new FacilityData(23, 1, [12], "🔨", 300, FacilityType.Purple, {"value": 2000}),
];

const LANDMARK_DATA_BASE: number = 10000;
const LANDMARK_DATA: FacilityData[] = [
    new FacilityData(10000, 2, [], "🏯", 2500, FacilityType.Gray, {}),
    new FacilityData(10001, 1, [], "🏰", 2500, FacilityType.Gray, {}),
];

export class CardData {
    static isFacility(data_id: number): boolean {
        return (0 <= data_id) && (data_id < FACILITY_DATA.length);
    }
    static getRandomFacilityDataId(): FacilityDataId {
        return Math.floor(Math.random() * FACILITY_DATA.length);
    }

    static getAvailableFacilities(pip: number): FacilityDataId[] {
        let facilities: FacilityDataId[] = [];
        for (let i: number = 0; i < FACILITY_DATA.length; ++i) {
            let facility: FacilityData = FACILITY_DATA[i];
            for (let s: number = 0; s < facility.size; ++s) {
                if (facility.area.indexOf(pip - s) !== -1) {
                    facilities.push(i);
                    break;
                }
            }
        }
        return facilities;
    }

    static isCharacter(data_id: number): boolean {
        return ((CHARACTER_DATA_BASE <= data_id) &&
                (data_id < CHARACTER_DATA_BASE + CHARACTER_DATA.length));
    }
    static getRandomCharacterDataId(): CharacterDataId {
        return Math.floor(Math.random() * CHARACTER_DATA.length) + CHARACTER_DATA_BASE;
    }

    static getAvailableCharacters(): CharacterDataId[] {
        let data_ids: CharacterDataId[] = [];
        for (let i: number = 0; i < CHARACTER_DATA.length; ++i) {
            data_ids.push(CHARACTER_DATA_BASE + i);
        }
        return data_ids;
    }
}

export type FacilityDataId = number;
export type CardId = number;

export class Facility {
    readonly data_id: FacilityDataId;
    readonly name: string;
    readonly size: number;
    readonly area: number[];
    readonly cost: number;
    readonly type: FacilityType;
    readonly property: {};

    constructor(data_id: FacilityDataId) {
        let data: FacilityData;
        if (data_id >= LANDMARK_DATA_BASE) {
            data = LANDMARK_DATA[data_id - LANDMARK_DATA_BASE];
        }
        else {
            data = FACILITY_DATA[data_id];
        }
        this.data_id = data_id;
        this.name = data.name;
        this.size = data.size;
        this.area = data.area;
        this.cost = data.cost;
        this.type = data.type;
        this.property = data.property;
    }

    public toJSON(): Object {
        return {
            class_name: "Facility",
            data_id: this.data_id,
        }
    }

    static fromJSON(json) {
        return new Facility(json.data_id);
    }

    public getName(): string {
        return this.name;
    }
    public getSize(): number {
        return this.size;
    }
    public getArea(): number[] {
        return this.area;
    }
    public getCost(): number {
        return this.cost;
    }
    public getType(): FacilityType {
        return this.type;
    }
    public getPropertyValue(): number {
        return this.property["value"] ? this.property["value"] : 0;
    }
    public getDescription(): string {
        switch (this.type) {
            case FacilityType.Gray:
                return "ランドマーク";
            case FacilityType.Blue:
                return `${this.property["value"]}コイン稼ぐ。\n誰のターンでも。`;
            case FacilityType.Green:
                return `${this.property["value"]}コイン稼ぐ。\n自分のターンのみ。`;
            case FacilityType.Red:
                return `${this.property["value"]}コイン奪う。\n自分以外のターンのみ。`;
            case FacilityType.Purple:
                return `${this.property["value"]}コイン奪う。\n自分のターンのみ。`;
        }
        return "";
    }

}

export class Character {
    readonly data_id: CharacterDataId;
    readonly name: string;
    readonly type: CharacterType;
    readonly round: number;
    readonly property: {};

    constructor(data_id: CharacterDataId) {
        let data: CharacterData = CHARACTER_DATA[data_id - CHARACTER_DATA_BASE];
        this.data_id = data_id;
        this.name = data.name;
        this.type = data.type;
        this.round = data.round;
        this.property = data.property;
    }

    public toJSON(): Object {
        return {
            class_name: "Character",
            data_id: this.data_id,
        }
    }

    static fromJSON(json) {
        return new Character(json.data_id);
    }

    public getName(): string {
        return this.name;
    }
    public getType(): CharacterType {
        return this.type;
    }
    public getPropertyValue(): number {
        return this.property["value"] ? this.property["value"] : 0;
    }
    public getDescription(): string {
        switch (this.type) {
            case CharacterType.None:
                return "";
            case CharacterType.DiceDelta:
                let delta: number = this.property["delta"];
                let delta_str: string = ((delta > 0) ? "+" : "") + delta;
                return `サイコロの目を${delta_str}する。\n${this.round}ラウンド`;
            case CharacterType.DrawCards:
                let value: number = this.property["value"];
                return `山札からカードを${value}枚引く`;
        }
        return "";
    }
}
