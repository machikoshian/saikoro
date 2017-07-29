export type Position = [number, number];

export enum DiceEvenOdd {
    Any,
    Even,
    Odd,
}

export enum DiceNum {
    Any,
    One = 1,
    Two = 2,
}

export interface DiceEffects {
    delta: number,
    even_odd: DiceEvenOdd,
    num: DiceNum,
}
