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
    Boost,
}

export interface CharacterProperty {
    delta?: number,
    value?: number,
    money?: number,
    boost?: number,
    type?: SelectType,
}

export class CharacterData {
    constructor(
        readonly name: string,
        readonly type: CharacterType,
        readonly round: number,
        readonly property: CharacterProperty,
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

export enum SelectType {
    Facility,
    Blue,
    Green,
    Red,
    Purple,
}

const CHARACTER_DATA_BASE: number = 1000;
const CHARACTER_DATA: CharacterData[] = [
    new CharacterData("幼稚園児", CharacterType.DiceDelta, 2, {delta: -2}),
    new CharacterData("小学生",  CharacterType.DiceDelta, 2, {delta: -1}),
    new CharacterData("中学生",  CharacterType.DiceDelta, 2, {delta: 1}),
    new CharacterData("高校生",  CharacterType.DiceDelta, 2, {delta: 2}),
    new CharacterData("大学生",  CharacterType.DiceDelta, 2, {delta: 3}),
    new CharacterData("執事",    CharacterType.DrawCards, 0, {value: 5}),
    new CharacterData("市長秘書", CharacterType.DrawCards, 0, {value: 3}),
    new CharacterData("有能秘書", CharacterType.MoveMoney, 0, {money: 500}),
    new CharacterData("白奴", CharacterType.DiceEven, 0, {}),  // even
    new CharacterData("黒奴", CharacterType.DiceOdd, 0, {}),  // odd
    new CharacterData("鉄道員", CharacterType.DiceOne, 3, {}),
    new CharacterData("CA",    CharacterType.DiceTwo, 3, {}),
    new CharacterData("気象予報士", CharacterType.Close, 0, {type: SelectType.Blue}),
    new CharacterData("消防士", CharacterType.Close, 0, {type: SelectType.Green}),
    new CharacterData("保健所員", CharacterType.Close, 0, {type: SelectType.Red}),
    new CharacterData("警察官", CharacterType.Close, 0, {type: SelectType.Purple}),
    new CharacterData("踊り子", CharacterType.Close, 0, {type: SelectType.Facility}),
    new CharacterData("医者", CharacterType.Open, 0, {}),
    new CharacterData("残念秘書", CharacterType.Boost, 2, {type: SelectType.Facility, boost: -1.5}),
    new CharacterData("社長秘書", CharacterType.Boost, 2, {type: SelectType.Facility, boost: 1.5}),
    new CharacterData("市長", CharacterType.Boost, 2, {type: SelectType.Facility, boost: 0.8}),
    new CharacterData("農家", CharacterType.Boost, 1, {type: SelectType.Blue, boost: 2.0}),
    new CharacterData("看板娘", CharacterType.Boost, 1, {type: SelectType.Green, boost: 2.0}),
    new CharacterData("給仕", CharacterType.Boost, 1, {type: SelectType.Red, boost: 2.0}),
    new CharacterData("レポーター", CharacterType.Boost, 1, {type: SelectType.Purple, boost: 2.0}),
    new CharacterData("土木作業員", CharacterType.Boost, 1, {type: SelectType.Blue, boost: -2.0}),
    new CharacterData("解体屋", CharacterType.Boost, 1, {type: SelectType.Green, boost: -2.0}),
    new CharacterData("大食い王", CharacterType.Boost, 1, {type: SelectType.Red, boost: -2.0}),
    new CharacterData("ロッカー", CharacterType.Boost, 1, {type: SelectType.Purple, boost: -2.0}),
    new CharacterData("エンジニア", CharacterType.SalaryFactor, 1, {boost: 1.0}),
    new CharacterData("税理士", CharacterType.SalaryFactor, 1, {boost: -1.0}),
];

export type CardDataId = number;

export interface FacilityProperty {
    lmboost?: number,
    close?: boolean,
    all?: boolean,
    multi?: number,
    effect?: CharacterType,  // For Landmark effect
    type?: SelectType,       // For Landmark effect
    boost?: number,          // For Landmark effect
    delta?: number,          // For Landmark effect
}

export class FacilityData {
    constructor(
        readonly size: number,
        readonly area: number[],
        readonly name: string,
        readonly cost: number,
        readonly type: FacilityType,
        readonly value: number,
        readonly property: FacilityProperty,
        ) {}
}

const FACILITY_DATA: FacilityData[] = [
    new FacilityData(1, [1],     "🌾", 100, FacilityType.Blue, 370,  {}),
    new FacilityData(1, [2],     "🐮", 100, FacilityType.Blue, 330,  {}),
    new FacilityData(1, [2],     "🌽", 100, FacilityType.Blue, 520,  {lmboost: 0.5}),
    new FacilityData(1, [2],     "🐑", 200, FacilityType.Blue, 680,  {}),  // SS
    new FacilityData(1, [4],     "🐝", 200, FacilityType.Blue, 300,  {multi: 2}),
    new FacilityData(1, [4,5],   "🍄", 100, FacilityType.Blue, 220,  {multi: 2}),
    new FacilityData(1, [5],     "🌴", 300, FacilityType.Blue, 650,  {}),
    new FacilityData(1, [8],     "🍅", 100, FacilityType.Blue, 450,  {lmboost: 2}),
    new FacilityData(1, [8,9],   "🌻", 200, FacilityType.Blue, 350,  {multi: 2}),
    new FacilityData(1, [9],     "🌰", 100, FacilityType.Blue, 650,  {multi: 0.5}),
    new FacilityData(1, [9],     "🗻", 300, FacilityType.Blue, 750,  {}),
    new FacilityData(1, [10],    "🍎", 100, FacilityType.Blue, 420,  {}),
    new FacilityData(1, [10],    "🍓", 100, FacilityType.Blue, 720,  {multi: 0.5}),
    new FacilityData(2, [10],    "🗻", 300, FacilityType.Blue, 1150, {close: true}),
    new FacilityData(1, [11],    "🍉", 100, FacilityType.Blue, 720,  {multi: 0.5}),  // A
    new FacilityData(1, [11],    "🍑", 200, FacilityType.Blue, 750,  {multi: 0.5}),  // S
    new FacilityData(2, [11],    "🐐", 200, FacilityType.Blue, 710,  {}),  // SSS
    new FacilityData(1, [11,12], "🎋", 300, FacilityType.Blue, 580,  {multi: 2}), // SS
    new FacilityData(1, [12],    "🍍", 150, FacilityType.Blue, 800,  {}),

    new FacilityData(1, [2],  "🍞", 100, FacilityType.Green, 470,  {}),
    new FacilityData(1, [2],  "🐟", 100, FacilityType.Green, 670,  {multi: 0.5}),
    new FacilityData(1, [2],  "🍆", 100, FacilityType.Green, 670,  {multi: 0.5}),
    new FacilityData(1, [2],  "🍖", 100, FacilityType.Green, 670,  {multi: 0.5}),
    new FacilityData(1, [2],  "🍬", 100, FacilityType.Green, 420,  {lmboost: 3}),
    new FacilityData(1, [3],  "💈", 100, FacilityType.Green, 570,  {}),  // A
    new FacilityData(1, [3],  "👞", 100, FacilityType.Green, 570,  {multi: 0.5}),  // B
    new FacilityData(1, [3],  "💅", 100, FacilityType.Green, 600,  {lmboost: 2}),  // S
    new FacilityData(1, [4],  "📖", 200, FacilityType.Green, 520,  {}),
    new FacilityData(1, [4],  "🏪", 100, FacilityType.Green, 320,  {multi: 2}),
    new FacilityData(1, [6],  "💆", 150, FacilityType.Green, 600,  {lmboost: 2}),
    new FacilityData(1, [7],  "💻", 200, FacilityType.Green, 1050, {multi: 0.5}),  // S
    new FacilityData(1, [7],  "👕", 200, FacilityType.Green, 550,  {multi: 2}),
    new FacilityData(2, [7],  "🏬", 250, FacilityType.Green, 880,  {}),
    new FacilityData(1, [7],  "🚲", 200, FacilityType.Green, 950,  {lmboost: 2}),
    new FacilityData(1, [8],  "🐻", 250, FacilityType.Green, 1180, {multi: 0.5}),  // SS
    new FacilityData(1, [8],  "📱", 200, FacilityType.Green, 1050, {}),
    new FacilityData(1, [9],  "🔧", 200, FacilityType.Green, 850,  {lmboost: 2}),
    new FacilityData(1, [9],  "🚗", 400, FacilityType.Green, 950,  {lmboost: 2}),
    new FacilityData(1, [10], "⚽", 200, FacilityType.Green, 950,  {lmboost: 2}),
    new FacilityData(1, [10], "🏄", 200, FacilityType.Green, 1120, {close: true, multi: 0.5}),
    new FacilityData(1, [10], "🐞", 100, FacilityType.Green, 1150, {multi: 0.5}),
    new FacilityData(1, [10], "🐠", 100, FacilityType.Green, 1120, {multi: 0.5}),
    new FacilityData(1, [11], "👓", 100, FacilityType.Green, 1120, {}),

    new FacilityData(1, [1],  "🍣", 200, FacilityType.Red, 750,  {}),
    new FacilityData(1, [3],  "🐙", 100, FacilityType.Red, 520,  {multi: 0.5}),
    new FacilityData(1, [5],  "🍴", 200, FacilityType.Red, 580,  {lmboost: 2}),
    new FacilityData(1, [6],  "🍱", 100, FacilityType.Red, 420,  {lmboost: 2}),
    new FacilityData(1, [7],  "🍕", 100, FacilityType.Red, 370,  {multi: 0.5}),
    new FacilityData(1, [7],  "🍜", 200, FacilityType.Red, 320,  {multi: 2}),
    new FacilityData(1, [8],  "🐔", 250, FacilityType.Red, 400,  {all: true}),
    new FacilityData(2, [8],  "🍻", 300, FacilityType.Red, 400,  {all: true}),
    new FacilityData(1, [9],  "🍛", 100, FacilityType.Red, 470,  {multi: 0.5}),
    new FacilityData(1, [10], "🐡", 200, FacilityType.Red, 650,  {lmboost: 2}),
    new FacilityData(1, [10], "🍣", 100, FacilityType.Red, 1000, {}),
    new FacilityData(1, [12], "🍵", 200, FacilityType.Red, 720,  {multi: 0.5}),
    new FacilityData(1, [12], "🍸", 150, FacilityType.Red, 350,  {all: true}),  // SS

    new FacilityData(1, [3],  "🎳", 200, FacilityType.Purple, 220,  {}),
    new FacilityData(2, [3],  "👾", 200, FacilityType.Purple, 520,  {}),
    new FacilityData(1, [5],  "📰", 100, FacilityType.Purple, 420,  {}),
    new FacilityData(2, [5],  "🎨", 400, FacilityType.Purple, 650,  {}),
    new FacilityData(2, [6],  "🎸", 400, FacilityType.Purple, 750,  {}),
    new FacilityData(2, [6],  "⚽", 500, FacilityType.Purple, 480,  {all: true}),
    new FacilityData(1, [7],  "🎤", 200, FacilityType.Purple, 370,  {all: true}),
    new FacilityData(2, [7],  "⚾", 500, FacilityType.Purple, 480,  {all: true}),
    new FacilityData(2, [8],  "🗿", 400, FacilityType.Purple, 720,  {}),
    new FacilityData(2, [8],  "🎥", 400, FacilityType.Purple, 400,  {all: true}),
    new FacilityData(2, [9],  "🐬", 500, FacilityType.Purple, 400,  {all: true}),
    new FacilityData(1, [9],  "🎾", 100, FacilityType.Purple, 420,  {all: true}),
    new FacilityData(1, [10], "⛳", 100, FacilityType.Purple, 770,  {}),
    new FacilityData(1, [12], "🔨", 300, FacilityType.Purple, 2000, {}),
];

function LandmarkData(size: number, name: string, property: FacilityProperty): FacilityData {
    return new FacilityData(size, [], name, 2500, FacilityType.Gray, 0, property);
}

const LANDMARK_DATA_BASE: number = 10000;
const LANDMARK_DATA: FacilityData[] = [
    LandmarkData(2, "🏯", {effect: CharacterType.Close, type: SelectType.Blue}),
    LandmarkData(2, "🏰", {effect: CharacterType.Close, type: SelectType.Green}),
    LandmarkData(1, "🗼", {effect: CharacterType.Close, type: SelectType.Red}),
    LandmarkData(1, "🗽", {effect: CharacterType.Close, type: SelectType.Purple}),
    LandmarkData(1, "🌾", {effect: CharacterType.Boost, type: SelectType.Blue,   boost: -0.5}),
    LandmarkData(1, "🏬", {effect: CharacterType.Boost, type: SelectType.Green,  boost: -0.5}),
    LandmarkData(1, "🍳", {effect: CharacterType.Boost, type: SelectType.Red,    boost: -0.5}),
    LandmarkData(1, "💼", {effect: CharacterType.Boost, type: SelectType.Purple, boost: -0.5}),
    LandmarkData(2, "🌾", {effect: CharacterType.Boost, type: SelectType.Blue,   boost: 0.5}),
    LandmarkData(2, "🏬", {effect: CharacterType.Boost, type: SelectType.Green,  boost: 0.5}),
    LandmarkData(2, "🍳", {effect: CharacterType.Boost, type: SelectType.Red,    boost: 0.5}),
    LandmarkData(2, "💼", {effect: CharacterType.Boost, type: SelectType.Purple, boost: 0.5}),
    LandmarkData(1, "🏦", {effect: CharacterType.SalaryFactor, boost: -0.5}),
    LandmarkData(2, "🏦", {effect: CharacterType.SalaryFactor, boost: 0.5}),
    LandmarkData(1, "📛", {effect: CharacterType.DiceDelta, delta: -2}),
    LandmarkData(1, "🎒", {effect: CharacterType.DiceDelta, delta: -1}),
    LandmarkData(1, "💯", {effect: CharacterType.DiceDelta, delta: 1}),
    LandmarkData(1, "📈", {effect: CharacterType.DiceDelta, delta: 2}),
    LandmarkData(1, "🎓", {effect: CharacterType.DiceDelta, delta: 3}),
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
            if (pip <= 0) {
                facilities.push(i);
                continue;
            }
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
    static getAvailableLandmarks(): CardDataId[] {
        let data_ids: CardDataId[] = [];
        for (let i: number = 0; i < LANDMARK_DATA.length; ++i) {
            data_ids.push(LANDMARK_DATA_BASE + i);
        }
        return data_ids;
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
    readonly value: number;
    readonly property: FacilityProperty;
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
        this.value = data.value;
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
    public getValue(): number {
        return this.value;
    }

    public getSelectTypeDscription(type: SelectType) {
        switch (this.property.type) {
            case SelectType.Blue:
                return "青施設";
            case SelectType.Green:
                return "緑施設";
            case SelectType.Red:
                return "赤施設";
            case SelectType.Purple:
                return "紫施設";
        }
    }

    public getLandmarkDescription(): string {
        switch (this.property.effect) {
            case CharacterType.Close: {
                return this.getSelectTypeDscription(this.property.type) + "は発動後、休業する";
            }

            case CharacterType.Boost: {
                const boost: number = this.property.boost * 100;
                const boost_str: string = ((boost > 0) ? "+" : "") + boost;
                return this.getSelectTypeDscription(this.property.type) + `の収入を${boost_str}%する`;
            }

            case CharacterType.SalaryFactor: {
                const boost: number = this.property.boost * 100;
                const boost_str: string = ((boost > 0) ? "+" : "") + boost;
                return `給料を${boost_str}%する`;
            }

            case CharacterType.DiceDelta: {
                const delta: number = this.property.delta;
                const delta_str: string = ((delta > 0) ? "+" : "") + delta;
                return `サイコロの目を${delta_str}する`;
            }

            default:
                return "";
        }
    }

    public getDescription(): string {
        let descriptions: string[] = [];
        switch (this.type) {
            case FacilityType.Gray:
                descriptions.push("ランドマーク");
                descriptions.push(this.getLandmarkDescription());
                break;
            case FacilityType.Blue:
                descriptions.push(`${this.value}コイン稼ぐ`);
                descriptions.push("誰のターンでも");
                break;
            case FacilityType.Green:
                descriptions.push(`${this.value}コイン稼ぐ`);
                descriptions.push("自分ターンのみ");
                break;
            case FacilityType.Red:
                if (this.property.all) {
                    descriptions.push(`${this.value}コインを全員から奪う`);
                }
                else {
                    descriptions.push(`${this.value}コイン奪う`);
                }
                descriptions.push("相手ターンのみ");
                break;
            case FacilityType.Purple:
                if (this.property.all) {
                    descriptions.push(`${this.value}コインを全員から奪う`);
                }
                else {
                    descriptions.push(`${this.value}コイン奪う`);
                }
                descriptions.push("自分ターンのみ");
                break;
        }
        const multi: number = this.property.multi;
        if (multi != undefined) {
            if (multi === 0.5) {
                descriptions.push("同じ施設があると収入半減");
            }
            else {
                descriptions.push(`同じ施設があると収入${multi}倍`);
            }
        }
        const lmboost: number = this.property.lmboost;
        if (lmboost != undefined) {
            if (lmboost === 0.5) {
                descriptions.push("ランドマーク2軒以上で収入半減");
            }
            else {
                descriptions.push(`ランドマーク2軒以上で収入${lmboost}倍`);
            }
        }
        if (this.property.close === true) {
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
    readonly property: CharacterProperty;

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
        return this.property.value ? this.property.value : 0;
    }
    public getDescription(): string {
        switch (this.type) {
            case CharacterType.None: {
                return "";
            }
            case CharacterType.DiceDelta: {
                const delta: number = this.property.delta;
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
                const value: number = this.property.value;
                return `山札からカードを${value}枚引く`;
            }
            case CharacterType.MoveMoney: {
                const money: number = this.property.money;
                return `選んだプレイヤーから${money}コインを奪う`;
            }
            case CharacterType.Close: {
                switch (this.property.type) {
                    case SelectType.Facility:
                        return "選んだ施設を休業にする";
                    case SelectType.Blue:
                        return "青施設をすべて休業にする";
                    case SelectType.Green:
                        return "緑施設をすべて休業にする";
                    case SelectType.Red:
                        return "赤施設をすべて休業にする";
                    case SelectType.Purple:
                        return "紫施設をすべて休業にする";
                }
            }
            case CharacterType.Open: {
                return "全施設の休業を解除する";
            }
            case CharacterType.Boost: {
                const boost: number = this.property.boost * 100;
                const boost_str: string = ((boost > 0) ? "+" : "") + boost;
                const target: string = (boost > 0) ? "自分" : "選んだプレイヤー";

                switch (this.property.type) {
                    case SelectType.Facility:
                        return `選んだ施設の収入を${boost_str}%する\n${this.round}ラウンド`;
                    case SelectType.Blue:
                        return `${target}の青施設の収入を${boost_str}%する\n${this.round}ラウンド`;
                    case SelectType.Green:
                        return `${target}の緑施設の収入を${boost_str}%する\n${this.round}ラウンド`;
                    case SelectType.Red:
                        return `${target}の赤施設の収入を${boost_str}%する\n${this.round}ラウンド`;
                    case SelectType.Purple:
                        return `${target}の紫施設の収入を${boost_str}%する\n${this.round}ラウンド`;
                }
            }
            case CharacterType.SalaryFactor: {
                const boost: number = this.property.boost * 100;
                const boost_str: string = ((boost > 0) ? "+" : "") + boost;
                return `全プレイヤーの給料を${boost_str}%する\n${this.round}ラウンド`;
            }
        }
        return "";
    }
}
