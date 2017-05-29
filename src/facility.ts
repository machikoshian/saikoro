export enum CharacterType {
    None,
    DiceDelta,  // Add N to dice results.
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

let character_data: CharacterData[] = [
    new CharacterData(1000, "大学生", CharacterType.DiceDelta, 1, {"delta": 3}),
    new CharacterData(1001, "幼稚園児", CharacterType.DiceDelta, 2, {"delta": -2}),
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

let facility_data: FacilityData[] = [
    new FacilityData(0,  1, [1],    "🌾", 100, FacilityType.Blue,   {"value": 300}),
    new FacilityData(1,  1, [2],    "🐮", 100, FacilityType.Blue,   {"value": 250}),
    new FacilityData(2,  2, [3],    "🎳", 200, FacilityType.Purple, {"value": 300}),
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

    new FacilityData(24, 2, [], "🏯", 1500, FacilityType.Gray, {}),
    new FacilityData(25, 1, [], "🏰", 2000, FacilityType.Gray, {}),
];

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
        let data: FacilityData = facility_data[data_id];
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
        let data: CharacterData = character_data[data_id];
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
        }
        return "";
    }
}
