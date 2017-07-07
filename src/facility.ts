export enum CharacterType {
    None,
    DiceDelta,  // Add N to dice results.
    DiceOne,    // Force the number of dices to one only.
    DiceTwo,    // Force the number of dices to two only.
    DiceEven,   // Dice result will be even.
    DiceOdd,    // Dice result will be odd.
    DrawCards,  // Draw cards from talon.
    MoveMoney,  // Move money from other players.
    SalaryFactor,  // Multiply the salary.
    Close,
    Open,
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

export enum CardType {
    None,
    Facility,
    Landmark,
    Character,
}

export enum FacilityType {
    Gray,
    Blue,
    Green,
    Red,
    Purple,
}

const CHARACTER_DATA_BASE: number = 1000;
const CHARACTER_DATA: CharacterData[] = [
    new CharacterData(1000, "幼稚園児", CharacterType.DiceDelta, 2, {"delta": -2}),
    new CharacterData(1001, "小学生",  CharacterType.DiceDelta, 2, {"delta": -1}),
    new CharacterData(1002, "中学生",  CharacterType.DiceDelta, 2, {"delta": 1}),
    new CharacterData(1003, "高校生",  CharacterType.DiceDelta, 2, {"delta": 2}),
    new CharacterData(1004, "大学生",  CharacterType.DiceDelta, 1, {"delta": 3}),
    new CharacterData(1005, "執事",    CharacterType.DrawCards, 0, {"value": 3}),
    new CharacterData(1006, "市長秘書", CharacterType.DrawCards, 0, {"value": 3}),
    new CharacterData(1007, "有能秘書", CharacterType.MoveMoney, 0, {"money": 300}),
    new CharacterData(1008, "白奴", CharacterType.DiceEven, 0, {}),  // even
    new CharacterData(1009, "黒奴", CharacterType.DiceOdd, 0, {}),  // odd
    new CharacterData(1010, "鉄道員", CharacterType.DiceOne, 2, {}),
    new CharacterData(1011, "CA",    CharacterType.DiceTwo, 2, {}),
    new CharacterData(1012, "気象予報士", CharacterType.Close, 0, {"type": FacilityType.Blue}),
    new CharacterData(1013, "消防士", CharacterType.Close, 0, {"type": FacilityType.Green}),
    new CharacterData(1014, "保健所員", CharacterType.Close, 0, {"type": FacilityType.Red}),
    new CharacterData(1015, "警察官", CharacterType.Close, 0, {"type": FacilityType.Purple}),
    new CharacterData(1016, "医者", CharacterType.Open, 0, {}),
];

export type CardDataId = number;

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
    new FacilityData(0,  1, [1],    "🌾", 100, FacilityType.Blue,   {"value": 370}),
    new FacilityData(1,  1, [2],    "🐮", 100, FacilityType.Blue,   {"value": 330}),
    new FacilityData(2,  2, [3],    "👾", 200, FacilityType.Purple, {"value": 520}),
    new FacilityData(3,  1, [4],    "🐝", 200, FacilityType.Blue,   {"value": 300}),
    new FacilityData(4,  1, [5],    "🍴", 200, FacilityType.Red,    {"value": 550}),
    new FacilityData(5,  1, [6],    "💆", 150, FacilityType.Green,  {"value": 600}),
    new FacilityData(6,  1, [7],    "👕", 200, FacilityType.Green,  {"value": 550}),
    new FacilityData(7,  1, [8],    "🐔", 250, FacilityType.Red,    {"value": 400, "all": true}),
    new FacilityData(8,  1, [8,9],  "🌻", 200, FacilityType.Blue,   {"value": 400}),
    new FacilityData(9,  1, [10],   "🍣", 100, FacilityType.Red,    {"value": 1000}),
    new FacilityData(10, 2, [10],   "🗻", 300, FacilityType.Blue,   {"value": 1150, "close": true}),
    new FacilityData(11, 1, [12],   "🍍", 150, FacilityType.Blue,   {"value": 800}),

    new FacilityData(12, 1, [1],  "🍣", 200, FacilityType.Red,    {"value": 750}),
    new FacilityData(13, 1, [2],  "🐟", 100, FacilityType.Green,  {"value": 670}),
    new FacilityData(14, 1, [3],  "💈", 100, FacilityType.Green,  {"value": 570}),
    new FacilityData(15, 1, [4],  "📖", 200, FacilityType.Green,  {"value": 520}),
    new FacilityData(16, 1, [5],  "📰", 100, FacilityType.Purple, {"value": 420}),
    new FacilityData(17, 1, [6],  "🍱", 100, FacilityType.Red,    {"value": 420}),
    new FacilityData(18, 1, [7],  "🍕", 100, FacilityType.Red,    {"value": 370}),
    new FacilityData(19, 1, [8],  "🍅", 100, FacilityType.Blue,   {"value": 450}),
    new FacilityData(20, 1, [9],  "🚗", 400, FacilityType.Green,  {"value": 950}),
    new FacilityData(21, 1, [10], "🍎", 100, FacilityType.Blue,   {"value": 420}),
    new FacilityData(22, 1, [11], "👓", 100, FacilityType.Green,  {"value": 1120}),
    new FacilityData(23, 1, [12], "🔨", 300, FacilityType.Purple, {"value": 2000}),

    new FacilityData(24, 2, [8], "🍻", 300, FacilityType.Red,    {"value": 400, "all": true}),
    new FacilityData(25, 2, [8], "🎥", 400, FacilityType.Purple, {"value": 400, "all": true}),
    new FacilityData(26, 2, [9], "🐬", 500, FacilityType.Purple, {"value": 400, "all": true}),
    new FacilityData(27, 2, [7], "🏬", 250, FacilityType.Green,  {"value": 880}),
    new FacilityData(28, 1, [10], "🏄", 200, FacilityType.Green,  {"value": 1120, "close": true}),
    new FacilityData(29, 1, [3], "🐙", 100, FacilityType.Red,  {"value": 520}),
    new FacilityData(30, 1, [9], "🍛", 100, FacilityType.Red,    {"value": 470}),
    new FacilityData(31, 2, [6], "🎸", 750, FacilityType.Purple, {"value": 750}),
    new FacilityData(32, 2, [6], "⚽", 500, FacilityType.Purple, {"value": 480, "all": true}),
    new FacilityData(33, 2, [7], "⚾", 500, FacilityType.Purple, {"value": 480, "all": true}),
    new FacilityData(34, 1, [9], "🌰", 100, FacilityType.Blue,   {"value": 650}),
    new FacilityData(35, 1, [5], "🌴", 300, FacilityType.Blue,   {"value": 650}),
    new FacilityData(36, 1, [9], "🗻", 300, FacilityType.Blue,   {"value": 750}),
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
    static getRandomFacilityDataId(): CardDataId {
        return Math.floor(Math.random() * FACILITY_DATA.length);
    }

    static getAvailableFacilities(pip: number): CardDataId[] {
        let facilities: CardDataId[] = [];
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

    static isLandmark(data_id: number): boolean {
        return ((LANDMARK_DATA_BASE <= data_id) &&
                (data_id < LANDMARK_DATA_BASE + LANDMARK_DATA.length));
    }

    static isCharacter(data_id: number): boolean {
        return ((CHARACTER_DATA_BASE <= data_id) &&
                (data_id < CHARACTER_DATA_BASE + CHARACTER_DATA.length));
    }
    static getRandomCharacterDataId(): CardDataId {
        return Math.floor(Math.random() * CHARACTER_DATA.length) + CHARACTER_DATA_BASE;
    }

    static getAvailableCharacters(): CardDataId[] {
        let data_ids: CardDataId[] = [];
        for (let i: number = 0; i < CHARACTER_DATA.length; ++i) {
            data_ids.push(CHARACTER_DATA_BASE + i);
        }
        return data_ids;
    }
}

export type CardId = number;

export class Facility {
    readonly data_id: CardDataId;
    readonly name: string;
    readonly size: number;
    readonly area: number[];
    readonly cost: number;
    readonly type: FacilityType;
    readonly property: {};
    public is_open: boolean = true;

    constructor(data_id: CardDataId) {
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
        this.is_open = true;
    }

    public toJSON(): Object {
        return {
            class_name: "Facility",
            data_id: this.data_id,
            is_open: this.is_open,
        }
    }

    static fromJSON(json) {
        let facility: Facility = new Facility(json.data_id);
        facility.is_open = json.is_open;
        return facility;
    }

    public reset(): void {
        this.is_open = true;
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
        let descriptions: string[] = [];
        switch (this.type) {
            case FacilityType.Gray:
                descriptions.push("ランドマーク");
                break;
            case FacilityType.Blue:
                descriptions.push(`${this.property["value"]}コイン稼ぐ`);
                descriptions.push("誰のターンでも");
                break;
            case FacilityType.Green:
                descriptions.push(`${this.property["value"]}コイン稼ぐ`);
                descriptions.push("自分のターンのみ");
                break;
            case FacilityType.Red:
                if (this.property["all"]) {
                    descriptions.push(`${this.property["value"]}コインを全員から奪う`);
                }
                else {
                    descriptions.push(`${this.property["value"]}コインを奪う`);
                }
                descriptions.push("自分以外のターンのみ");
                break;
            case FacilityType.Purple:
                if (this.property["all"]) {
                    descriptions.push(`${this.property["value"]}コインを全員から奪う`);
                }
                else {
                    descriptions.push(`${this.property["value"]}コインを奪う`);
                }
                descriptions.push("自分のターンのみ");
                break;
        }
        if (this.property["close"] === true) {
            descriptions.push("発動後休業する");
        }
        return descriptions.join("\n");
    }
}

export class Character {
    readonly data_id: CardDataId;
    readonly name: string;
    readonly type: CharacterType;
    readonly round: number;
    readonly property: {};

    constructor(data_id: CardDataId) {
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
            case CharacterType.None: {
                return "";
            }
            case CharacterType.DiceDelta: {
                const delta: number = this.property["delta"];
                const delta_str: string = ((delta > 0) ? "+" : "") + delta;
                return `サイコロの目を${delta_str}する\n${this.round}ラウンド`;
            }
            case CharacterType.DiceEven: {
                return "次のサイコロの合計値が偶数になる";
            }
            case CharacterType.DiceOdd: {
                return "次のサイコロの合計値が奇数になる";
            }
            case CharacterType.DiceOne: {
                return `サイコロを1個振り限定にする\n${this.round}ラウンド`;
            }
            case CharacterType.DiceTwo: {
                return `サイコロを2個振り限定にする\n${this.round}ラウンド`;
            }
            case CharacterType.DrawCards: {
                const value: number = this.property["value"];
                return `山札からカードを${value}枚引く`;
            }
            case CharacterType.MoveMoney: {
                const money: number = this.property["money"];
                return `選んだプレイヤーから${money}コインを奪う`;
            }
            case CharacterType.Close: {
                switch (this.property["type"]) {
                    case FacilityType.Blue:
                        return "青施設をすべて休業にする";
                    case FacilityType.Green:
                        return "緑施設をすべて休業にする";
                    case FacilityType.Red:
                        return "赤施設をすべて休業にする";
                    case FacilityType.Purple:
                        return "紫施設をすべて休業にする";
                }
            }
            case CharacterType.Open: {
                return "全施設の休業を解除する";
            }
        }
        return "";
    }
}
