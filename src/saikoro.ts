import { Dice } from "./dice";

document.body.innerHTML = "<pre>" + Dice.roll(2, 7).debugString() + "</pre>";
