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
        readonly type: FacilityType) {}
}

let facility_data: FacilityData[] = [
    new FacilityData(0,  1,  "🌾", 100, FacilityType.Blue),
    new FacilityData(1,  2,  "🐮", 100, FacilityType.Blue),
    new FacilityData(2,  3,  "🎳", 200, FacilityType.Purple),
    new FacilityData(3,  4,  "🐝", 200, FacilityType.Blue),
    new FacilityData(4,  5,  "🍴", 200, FacilityType.Red),
    new FacilityData(5,  6,  "💆", 250, FacilityType.Green),
    new FacilityData(6,  7,  "👕", 200, FacilityType.Green),
    new FacilityData(7,  8,  "🐔", 250, FacilityType.Red),
    new FacilityData(8,  9,  "🌻", 200, FacilityType.Blue),
    new FacilityData(9,  10, "🍣", 100, FacilityType.Red),
    new FacilityData(10, 11, "🗻", 300, FacilityType.Blue),
    new FacilityData(11, 12, "🍍", 150, FacilityType.Blue),
];

export type FacilityId = number;

export class Facility {
    readonly name: string;
    readonly area: number;
    readonly cost: number;
    readonly type: FacilityType;
    constructor(name: string, area: number, cost: number, type: FacilityType) {
        this.name = name;
        this.area = area;
        this.cost = cost;
        this.type = type;
    }

    public toJSON(): Object {
        return {
            class_name: "Facility",
            name: this.name,
            area: this.area,
            cost: this.cost,
            type: this.type,
        }
    }

    static fromJSON(json) {
        return new Facility(json.name, json.area, json.cost, json.type);
    }

    static fromId(id:number) {
        let data: FacilityData = facility_data[id];
        return new Facility(data.name, data.area, data.cost, data.type);
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
}

