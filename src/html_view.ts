import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility } from "./facility";
import { Dice, DiceResult } from "./dice";

export class HtmlView {
    private money_animation_timers = [null, null, null, null];

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

    public diceResultMessage(dice: DiceResult): string {
        let faces: string[] = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

        let d1: number = dice.dice1;
        let d2: number = dice.dice2;
        return `${faces[d1]} ${faces[d2]} : ${d1 + d2} でした。`;
    }

    public updateView(session: Session, user_id: string): void {
        // Update board.
        this.updateBoard(session);

        // Update players.
        this.drawPlayers(session);

        let player_id: PlayerId = session.getCurrentPlayerId();
        let players: Player[] = session.getPlayers();

        // Update message.
        let current_player: Player = players[player_id];
        let name: string = current_player.name;
        let message: string = "";
        let phase: Phase = session.getPhase();
        if (phase == Phase.StartGame) {
            message = `🎲 マッチング中です 🎲`;
        }
        else if (phase == Phase.DiceRoll) {
            message = `🎲 ${name} のサイコロです 🎲`;
        }
        else if (phase == Phase.BuildFacility) {
            message = this.diceResultMessage(session.getDiceResult());
            message += `  🎲 ${name} の建設です 🎲`;
        }
        else if (phase == Phase.EndGame) {
            let winner: string = session.getPlayer(session.getWinner()).name;
            message = `🎲 ${name} の勝ちです 🎲`;
        }
        document.getElementById("message").innerText = message;
        document.getElementById("message").style.backgroundColor = this.getPlayerColor(player_id);

        // Update buttons.
        if (current_player.user_id === user_id) {
            document.getElementById("dice").style.display = "";
        }
        else {
            document.getElementById("dice").style.display = "none";
        }

        if (phase == Phase.DiceRoll) {
            document.getElementById("dice_1").style.visibility = "visible";
            document.getElementById("dice_2").style.visibility = "visible";
        }
        else {
            document.getElementById("dice_1").style.visibility = "hidden";
            document.getElementById("dice_2").style.visibility = "hidden";
        }

        if (phase == Phase.BuildFacility) {
            document.getElementById("end_turn").style.visibility = "visible";
        }
        else {
            document.getElementById("end_turn").style.visibility = "hidden";
        }

        // Update cards.
        for (let i: number = 0; i < players.length; ++i) {
            let player: Player = players[i];
            if (player.user_id === user_id) {
                document.getElementById(`cards_${i}`).style.display = "table-row";
            }
            else {
                document.getElementById(`cards_${i}`).style.display = "none";
            }
        }
        for (let i: number = players.length; i < 4; ++i) {
            document.getElementById(`cards_${i}`).style.display = "none";
        }

        const area_name: string[] =
            ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫"];
        for (let i: number = 0; i < players.length; ++i) {
            let card_ids: CardId[] = session.getSortedHand(i);
            for (let j: number = 0; j < Math.min(10, card_ids.length); ++j) {
                let facility: Facility = session.getFacility(card_ids[j]);
                document.getElementById(`card_${i}_${j}`).style.display = "table-cell";
                document.getElementById(`card_${i}_${j}_name`).innerText =
                    `${area_name[facility.getArea()]} ${facility.getName()}`;
                document.getElementById(`card_${i}_${j}_cost`).innerText = String(facility.getCost());
                document.getElementById(`card_${i}_${j}_description`).innerText = facility.getDescription();
                document.getElementById(`card_${i}_${j}`).style.backgroundColor =
                    this.getFacilityColor(facility);
            }
            for (let j: number = Math.min(10, card_ids.length); j < 10; ++j) {
                document.getElementById(`card_${i}_${j}`).style.display = "none";
            }
        }

        // Update landmarks.
        let card_ids: CardId[] = session.getLandmarks();
        for (let j: number = 0; j < Math.min(5, card_ids.length); ++j) {
            let facility: Facility = session.getFacility(card_ids[j]);
            document.getElementById(`landmark_${j}`).style.display = "table-cell";
            document.getElementById(`landmark_${j}_name`).innerText = facility.getName();
            document.getElementById(`landmark_${j}_cost`).innerText = String(facility.getCost());
            document.getElementById(`landmark_${j}_description`).innerText = facility.getDescription();
            let owner_id: PlayerId = session.getOwnerId(card_ids[j]);
            if (owner_id === -1) {
                document.getElementById(`landmark_${j}`).style.backgroundColor =
                    this.getFacilityColor(facility);
            } else {
                document.getElementById(`landmark_${j}`).style.backgroundColor =
                    this.getPlayerColor(owner_id);
            }
        }
        for (let j: number = Math.min(5, card_ids.length); j < 5; ++j) {
            document.getElementById(`landmark_${j}`).style.display = "none";
        }
    }

    public updateBoard(session: Session): void {
        let board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                let facility: Facility = session.getFacilityOnBoard(x, y);
                let owner_id: PlayerId = session.getOwnerIdOnBoard(x, y);
                this.drawField(x, y, facility, owner_id);
            }
        }
    }

    public drawPlayers(session: Session): void {
        let players: Player[] = session.getPlayers();
        for (let i: number = 0; i < players.length; ++i) {
            let player: Player = players[i];
            document.getElementById(`player_${i}`).style.visibility = "visible";
            document.getElementById(`player_${i}_name`).innerText = player.name;

            let money_element = document.getElementById(`player_${i}_money`);
            let money: number = player.getMoney();

            if (this.money_animation_timers[i]) {
                clearInterval(this.money_animation_timers[i]);
            }
            this.money_animation_timers[i] = setInterval(() => {
                let current_money = Number(money_element.innerText);
                if (current_money == money) {
                    clearInterval(this.money_animation_timers[i]);
                    this.money_animation_timers[i] = null;
                    return;
                }
                else if (current_money > money) {
                    current_money -= Math.min(10, current_money - money);
                }
                else if (current_money < money) {
                    current_money += Math.min(10, money - current_money);
                }
                money_element.innerHTML = String(current_money);
            }, 5);

            document.getElementById(`player_${i}_salary`).innerHTML = `${player.salary}`;
            let cards: PlayerCards = session.getPlayerCards(i);
            document.getElementById(`player_${i}_talon`).innerHTML =
                `${cards.getHandSize()}　／　📇 ${cards.getTalonSize()}`;
        }
        for (let i: number = players.length; i < 4; ++i) {
            document.getElementById(`player_${i}`).style.visibility = "hidden";
        }
    }

    public showEvents(session: Session): void {
        let events: Event[] = session.getEvents();
        if (events.length === 0) {
            return;
        }

        for (let event of events) {
            let [x, y]: [number, number] = session.getPosition(event.card_id);

            for (let pid = 0; pid < event.moneys.length; pid++) {
                let money: number = event.moneys[pid];
                if (money === 0) {
                    continue;
                }
                this.drawMoneyMotion(money, pid, x, y);
            }
        }
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

    private drawField(x: number, y: number, facility: Facility, owner_id: PlayerId): void {
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
}
