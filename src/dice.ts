export class DiceResult {
  constructor(public dice1:number,
              public dice2:number,
              public is_miracle:boolean,
              public miracle_dice1:number = 0,
              public miracle_dice2:number = 0) {}

  toObject() {
    return {
      dice1: this.dice1,
      dice2: this.dice2,
      is_miracle: this.is_miracle,
      miracle_dice1: this.miracle_dice1,
      miracle_dice2: this.miracle_dice2,
    }
  }

  static fromObject(object):DiceResult {
    return new DiceResult(
      object.dice1,
      object.dice2,
      object.is_miracle,
      object.miracle_dice1,
      object.miracle_dice2);
  }

  debugString():string {
    return JSON.stringify(this.toObject());
  }
}

export class Dice {
  static roll(dice_num:number, aim:number = 0):DiceResult {
    let dice2_factor:number = (dice_num == 2) ? 1 : 0;

    let dice1:number = Dice.roll1();
    let dice2:number = Dice.roll1() * dice2_factor;
    if (dice1 + dice2 == aim) {
      // Lucky, but not miracle lucky.
      return new DiceResult(dice1, dice2, false);
    }

    // Try again for miracle.
    let miracle_dice1:number = Dice.roll1();
    let miracle_dice2:number = Dice.roll1() * dice2_factor;
    if (miracle_dice1 + miracle_dice2 == aim) {
      return new DiceResult(dice1, dice2, true, miracle_dice1, miracle_dice2);
    }
    return new DiceResult(dice1, dice2, false);
  }

  static roll1():number {
    return Math.floor(Math.random() * 6) + 1;
  }
}
