import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility } from "./facility";
import { Dice, DiceResult } from "./dice";

export class HtmlView {
    public getPlayerColor(player_id: PlayerId): string {
        // TODO: Support landmark colors (set / built).
        let colors = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];

        if (player_id === -1 || player_id > colors.length) {
            return "#EFF0D1";
        }
        return colors[player_id];
    }

    public getFacilityColor(facility: Facility): string {
        if (!facility) {
            return "#EFF0D1";
        }
        let type: FacilityType = facility.type;
        switch(type) {
            case FacilityType.Gray:
                return "#B0BEC5";
            case FacilityType.Blue:
                return "#90CAF9";
            case FacilityType.Green:
                return "#A5D6A7";
            case FacilityType.Red:
                return "#EF9A9A";
            case FacilityType.Purple:
                return "#B39DDB";
        }
    }

    public drawField(x: number, y: number, facility: Facility, owner_id: PlayerId): void {
        let name: string = facility ? facility.getName() : "";
        let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
        field.innerText = name;
        if (facility && facility.getType() === FacilityType.Gray && owner_id === -1) {
            field.style.backgroundColor = this.getFacilityColor(facility);
        }
        else {
            field.style.backgroundColor = this.getPlayerColor(owner_id);
        }
        field.style.borderColor = this.getFacilityColor(facility);
    }

    public drawMoneyMotion(money: number, player_id: PlayerId, x: number, y: number): void {
        if (money > 0) {
            this.effectMoneyMotion(`field_${x}_${y}`, `player_${player_id}_money`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}_money`, `field_${x}_${y}`, money);
        }
    }

    public effectMoneyMotion(elementFrom: string, elementTo: string, money: number): void {
        // Animation.
        let new_node: Node = document.getElementById("money_motion").cloneNode(true);
        let money_motion: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
        let element_from: HTMLElement = document.getElementById(elementFrom);
        let rect_from = element_from.getBoundingClientRect();
        let element_to: HTMLElement = document.getElementById(elementTo);
        let rect_to = element_to.getBoundingClientRect();
        let diff_x: number = rect_to.left - rect_from.left;
        let diff_y: number = rect_to.top - rect_from.top;

        money_motion.innerHTML += String(money);
        money_motion.style.visibility = "visible";
        money_motion.style.zIndex = "2";
        money_motion.style.position = "absolute";
        money_motion.style.width = "40px";
        money_motion.style.height = "40px";
        money_motion.style.top = rect_from.top + "px";
        money_motion.style.left = rect_from.left + "px";

        money_motion.style.transitionDuration = "1s";
        money_motion.style.transform = `translate(${diff_x}px, ${diff_y}px)`;

        window.setTimeout(() => {
            document.body.removeChild(money_motion);
        }, 1500);
    }
}
