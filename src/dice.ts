import { DiceEvenOdd, DiceNum, DiceEffects } from "./types";

export class DiceResult {
    constructor(
        readonly dice1: number,
        readonly dice2: number,
        readonly delta: number = 0,
        readonly is_miracle: boolean = false,
        readonly miracle_dice1: number = 0,
        readonly miracle_dice2: number = 0) { }

    public toJSON(): Object {
        return {
            class_name: "DiceResult",
            dice1: this.dice1,
            dice2: this.dice2,
            delta: this.delta,
            is_miracle: this.is_miracle,
            miracle_dice1: this.miracle_dice1,
            miracle_dice2: this.miracle_dice2,
        }
    }

    static fromJSON(json): DiceResult {
        return new DiceResult(
            json.dice1,
            json.dice2,
            json.delta,
            json.is_miracle,
            json.miracle_dice1,
            json.miracle_dice2);
    }

    public result(): number {
        if (this.is_miracle) {
            return this.miracle_dice1 + this.miracle_dice2 + this.delta;
        }
        return this.dice1 + this.dice2 + this.delta;
    }

    debugString(): string {
        return JSON.stringify(this);
    }
}

export class Dice {
    static roll(dice_num: number, aim: number = 0, effects: DiceEffects): DiceResult {
        if (effects.num !== DiceNum.Any) {
            dice_num = effects.num;
        }

        let dice2_factor: number = (dice_num === 2) ? 1 : 0;

        let [dice1, dice2]: [number, number] = Dice.rollDices(dice_num, effects);
        if (dice1 + dice2 === aim) {
            // Lucky, but not miracle lucky.
            return new DiceResult(dice1, dice2, effects.delta, false);
        }

        // Try again for miracle.
        let [miracle_dice1, miracle_dice2]: [number, number] = Dice.rollDices(dice_num, effects);
        if (miracle_dice1 + miracle_dice2 === aim) {
            return new DiceResult(dice1, dice2, effects.delta, true, miracle_dice1, miracle_dice2);
        }
        return new DiceResult(dice1, dice2, effects.delta, false);
    }

    static rollDices(dice_num: number, effects: DiceEffects): [number, number] {
        let dice2_factor: number = (dice_num === 2) ? 1 : 0;

        let dice1: number = Dice.roll1();
        let dice2: number = Dice.roll1() * dice2_factor;
        if (effects.even_odd === DiceEvenOdd.Even) {
            while ((dice1 + dice2) % 2 !== 0) {
                dice1 = Dice.roll1();
                dice2 = Dice.roll1() * dice2_factor;
            }
        }
        if (effects.even_odd === DiceEvenOdd.Odd) {
            while ((dice1 + dice2) % 2 !== 1) {
                dice1 = Dice.roll1();
                dice2 = Dice.roll1() * dice2_factor;
            }
        }
        return [dice1, dice2];
    }

    static roll1(): number {
        return Math.floor(Math.random() * 6) + 1;
    }
}
