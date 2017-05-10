export enum FacilityType {
    Gray,
    Blue,
    Green,
    Red,
    Purple,
}

export class FacilityData {
    constructor(
        readonly id: number,
        readonly area: number,  // TODO should be range.
        readonly name: string,
        readonly cost: number,
        readonly type: FacilityType,
        readonly property: {},
        ) {}
}

let facility_data: FacilityData[] = [
    new FacilityData(0,  1,  "🌾", 100, FacilityType.Blue,   {"value": 300}),
    new FacilityData(1,  2,  "🐮", 100, FacilityType.Blue,   {"value": 250}),
    new FacilityData(2,  3,  "🎳", 200, FacilityType.Purple, {"value": 300}),
    new FacilityData(3,  4,  "🐝", 200, FacilityType.Blue,   {"value": 300}),
    new FacilityData(4,  5,  "🍴", 200, FacilityType.Red,    {"value": 400}),
    new FacilityData(5,  6,  "💆", 150, FacilityType.Green,  {"value": 450}),
    new FacilityData(6,  7,  "👕", 200, FacilityType.Green,  {"value": 400}),
    new FacilityData(7,  8,  "🐔", 250, FacilityType.Red,    {"value": 250}),
    new FacilityData(8,  9,  "🌻", 200, FacilityType.Blue,   {"value": 400}),
    new FacilityData(9,  10, "🍣", 100, FacilityType.Red,    {"value": 400}),
    new FacilityData(10, 11, "🗻", 300, FacilityType.Blue,   {"value": 500}),
    new FacilityData(11, 12, "🍍", 150, FacilityType.Blue,   {"value": 650}),
    new FacilityData(12, 0, "🏯", 1500, FacilityType.Gray, {}),
    new FacilityData(13, 0, "🏰", 2000, FacilityType.Gray, {}),
];

export type FacilityDataId = number;
export type CardId = number;

export class Facility {
    readonly data_id: FacilityDataId;
    readonly name: string;
    readonly area: number;
    readonly cost: number;
    readonly type: FacilityType;
    readonly property: {};

    constructor(data_id: FacilityDataId) {
        let data: FacilityData = facility_data[data_id];
        this.data_id = data_id;
        this.name = data.name;
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
    public getArea(): number {
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

