import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility, CharacterType, Character } from "./facility";
import { Dice, DiceResult } from "./dice";
import { WebClient } from "./saikoro";  // TODO: circular dependency.

export class HtmlView {
    private money_animation_timers = [null, null, null, null];
    private client: WebClient;  // TODO: create a super class.
    private session: Session = null;
    private clicked_card_id: CardId = -1;
    private clicked_card_element: HTMLElement = null;
    private player_cards_list: CardId[][] = [];

    constructor(client: WebClient) {
        this.client = client;
    }

    public initView(column: number = 12, row: number = 5):void {
        // Add click listeners.
        // Matching.
        document.getElementById("matching_button").addEventListener(
            "click", () => { this.onClickMatching(); });
        document.getElementById("game").style.visibility = "hidden";

        // Fields
        for (let y: number = 0; y < row; ++y) {
            for (let x: number = 0; x < column; ++x) {
                document.getElementById(`field_${x}_${y}`).addEventListener(
                    "click", () => { this.onClickField(x, y); });
            }
        }

        // Dices
        document.getElementById("dice_1").addEventListener(
            "click", () => { this.onClickDice(1, 0); });
        document.getElementById("dice_2").addEventListener(
            "click", () => { this.onClickDice(2, 0); });

        // Character
        document.getElementById("char_card").addEventListener(
            "click", () => { this.onClickCharacter(); });

        // End turn
        document.getElementById("end_turn").addEventListener(
            "click", () => { this.onClickEndTurn(); });

        // Cards
        let player_size: number = 4;
        let card_size: number = 10;
        for (let p: number = 0; p < player_size; ++p) {
            for (let c: number = 0; c < card_size; ++c) {
                document.getElementById(`card_${p}_${c}`).addEventListener(
                    "click", () => { this.onClickCard(p, c); });
            }
        }

        // Landmark cards
        let landmark_size: number = 5;
        for (let l: number = 0; l < landmark_size; ++l) {
            document.getElementById(`landmark_${l}`).addEventListener(
                "click", () => { this.onClickLandmark(l); });
        }

        document.getElementById("money_motion").style.visibility = "hidden";
        document.getElementById("char_motion").style.visibility = "hidden";
    }

    private onClickField(x, y): void {
        console.log(`clicked: field_${x}_${y}`);
        if (this.clicked_card_id < 0) {
            return;
        }
        this.client.buildFacility(x, y, this.clicked_card_id);
    }

    private onClickDice(dice_num: number, aim: number): void {
        this.client.rollDice(dice_num, aim);
    }

    private onClickCharacter(): void {
        this.client.characterCard(this.clicked_card_id);
    }

    private onClickEndTurn(): void {
        this.client.endTurn();
    }

    private onClickMatching(): void {
        let name: string = (<HTMLInputElement>document.getElementById("matching_name")).value;
        if (name.length === 0) {
            return;
        }
        this.client.startMatching(name);
    }

    private onClickCard(player: number, card: number): void {
        let clicked_card_id: CardId = this.player_cards_list[player][card];
        let phase: Phase = this.session.getPhase();
        let is_char: boolean = this.session.isCharacter(clicked_card_id);

        if (phase === Phase.CharacterCard) {
            if (!is_char) {
                return;
            }
        }

        else if (phase === Phase.BuildFacility) {
            if (is_char) {
                return;
            }
        }

        else {
            return;
        }

        console.log(`clicked: card_${player}_${card}`);
        this.resetCards();
        this.clicked_card_element = document.getElementById(`card_${player}_${card}`);
        this.clicked_card_element.style.borderColor = "#FFE082";
        this.clicked_card_id = clicked_card_id;

        this.drawBoard();

        if (phase === Phase.CharacterCard) {
            document.getElementById("char_card").style.backgroundColor = "#FFCA28";
        }

        if (phase === Phase.BuildFacility) {
            let x: number = this.session.getFacility(this.clicked_card_id).getArea() - 1;
            for (let y: number = 0; y < 5; y++) {
                let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
                // TODO: Keep the owner's color too.
                field.style.backgroundColor = "#FFF176";
            }
        }
    }

    private onClickLandmark(card: number): void {
        if (this.session.getPhase() !== Phase.BuildFacility) {
            return;
        }

        console.log(`clicked: landmark_${card}`);

        let clicked_card_id: CardId = this.session.getLandmarks()[card];
        if (this.session.getOwnerId(clicked_card_id) !== -1) {
            return;
        }

        this.resetCards();
        this.clicked_card_element = document.getElementById(`landmark_${card}`);
        this.clicked_card_element.style.borderColor = "#FFE082";
        this.clicked_card_id = clicked_card_id;

        this.drawBoard();

        let [x, y] = this.session.getPosition(this.clicked_card_id);
        document.getElementById(`field_${x}_${y}`).style.backgroundColor = "#FFF176";
    }

    private getPlayerColor(player_id: PlayerId): string {
        // TODO: Support landmark colors (set / built).
        let colors = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];

        if (player_id === -1 || player_id > colors.length) {
            return "#EFF0D1";
        }
        return colors[player_id];
    }

    private getFacilityColor(facility: Facility): string {
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

    private getDiceDeltaMessage(delta: number): string {
        if (delta === 0) {
            return "";
        }
        let unit: string = (delta > 0) ? "+" : "";
        return `(${unit}${delta})`;
    }

    private getDiceResultMessage(dice: DiceResult): string {
        let faces: string[] = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

        let d1: number = dice.dice1;
        let d2: number = dice.dice2;
        let delta: string = this.getDiceDeltaMessage(dice.delta);
        return `${faces[d1]} ${faces[d2]} ${delta}: ${dice.result()} でした。`;
    }

    private resetCards(): void {
        if (this.clicked_card_element) {
            this.clicked_card_element.style.borderColor = "#EEEEEE";
            this.clicked_card_element = null;
        }
        this.clicked_card_id = -1;
    }

    public updateView(session: Session, user_id: string): void {
        this.session = session;

        // Hide the matching view and show the board view.
        document.getElementById("matching").style.display = "none";
        document.getElementById("game").style.visibility = "visible";

        // Show event animations.
        this.drawEvents();

        // Update cards list.
        this.player_cards_list = [];
        let players: Player[] = session.getPlayers();
        for (let i: number = 0; i < players.length; ++i) {
            let card_ids: CardId[] = session.getSortedHand(i);
            this.player_cards_list.push(card_ids);
        }
        let landmark_ids: CardId[] = session.getLandmarks();
        this.player_cards_list.push(landmark_ids);

        // Update board.
        this.drawBoard();

        // Update players.
        this.drawPlayers();

        let player_id: PlayerId = session.getCurrentPlayerId();

        // Update message.
        let current_player: Player = players[player_id];
        let name: string = current_player.name;
        let message: string = "";
        let phase: Phase = session.getPhase();
        if (phase === Phase.StartGame) {
            message = `🎲 マッチング中です 🎲`;
        }
        else if (phase === Phase.CharacterCard) {
            let delta: string = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `🎲 ${name} のキャラカードまたはサイコロ${delta}です 🎲`;
        }
        else if (phase === Phase.DiceRoll) {
            let delta: string = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `🎲 ${name} のサイコロ${delta}です 🎲`;
        }
        else if (phase === Phase.BuildFacility) {
            message = this.getDiceResultMessage(session.getDiceResult());
            message += `  🎲 ${name} の建設です 🎲`;
        }
        else if (phase === Phase.EndGame) {
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

        if (phase === Phase.CharacterCard) {
            document.getElementById("char_card").style.visibility = "visible";
            document.getElementById("char_card").style.backgroundColor = "#EFF0D1";
        }
        else {
            document.getElementById("char_card").style.visibility = "hidden";
        }

        if (phase === Phase.CharacterCard || phase === Phase.DiceRoll) {
            document.getElementById("dice_1").style.visibility = "visible";
            document.getElementById("dice_2").style.visibility = "visible";
        }
        else {
            document.getElementById("dice_1").style.visibility = "hidden";
            document.getElementById("dice_2").style.visibility = "hidden";
        }

        if (phase === Phase.BuildFacility) {
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
                let card_id: CardId = card_ids[j];
                if (session.isCharacter(card_id)) {
                    let character: Character = session.getCharacter(card_id);
                    document.getElementById(`card_${i}_${j}`).style.display = "table-cell";
                    document.getElementById(`card_${i}_${j}_name`).innerText = character.getName();
                    document.getElementById(`card_${i}_${j}_cost`).innerText = "";
                    document.getElementById(`card_${i}_${j}_description`).innerText = character.getDescription();
                    document.getElementById(`card_${i}_${j}`).style.backgroundColor = "#FFF9C4";
                }
                else {
                    let facility: Facility = session.getFacility(card_id);
                    document.getElementById(`card_${i}_${j}`).style.display = "table-cell";
                    document.getElementById(`card_${i}_${j}_name`).innerText =
                        `${area_name[facility.getArea()]} ${facility.getName()}`;
                    document.getElementById(`card_${i}_${j}_cost`).innerText = String(facility.getCost());
                    document.getElementById(`card_${i}_${j}_description`).innerText = facility.getDescription();
                    document.getElementById(`card_${i}_${j}`).style.backgroundColor =
                        this.getFacilityColor(facility);
                }
            }
            for (let j: number = Math.min(10, card_ids.length); j < 10; ++j) {
                document.getElementById(`card_${i}_${j}`).style.display = "none";
            }
        }

        // Update landmarks.
        for (let j: number = 0; j < Math.min(5, landmark_ids.length); ++j) {
            let facility: Facility = session.getFacility(landmark_ids[j]);
            document.getElementById(`landmark_${j}`).style.display = "table-cell";
            document.getElementById(`landmark_${j}_name`).innerText = facility.getName();
            document.getElementById(`landmark_${j}_cost`).innerText = String(facility.getCost());
            document.getElementById(`landmark_${j}_description`).innerText = facility.getDescription();
            let owner_id: PlayerId = session.getOwnerId(landmark_ids[j]);
            if (owner_id === -1) {
                document.getElementById(`landmark_${j}`).style.backgroundColor =
                    this.getFacilityColor(facility);
            } else {
                document.getElementById(`landmark_${j}`).style.backgroundColor =
                    this.getPlayerColor(owner_id);
            }
        }
        for (let j: number = Math.min(5, landmark_ids.length); j < 5; ++j) {
            document.getElementById(`landmark_${j}`).style.display = "none";
        }

        this.resetCards();  // Nice to check if built or not?
    }

    public drawBoard(): void {
        let session: Session = this.session;
        let board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                let facility: Facility = session.getFacilityOnBoard(x, y);
                let owner_id: PlayerId = session.getOwnerIdOnBoard(x, y);
                this.drawField(x, y, facility, owner_id);
            }
        }
    }

    private drawPlayers(): void {
        let session: Session = this.session;
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
                if (current_money === money) {
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

    private drawEvents(): void {
        let events: Event[] = this.session.getEvents();
        if (events.length === 0) {
            return;
        }

        for (let event of events) {
            // Character card
            if (event.type === EventType.Character) {
                this.effectCharacter(this.session.getCurrentPlayerId(), event.card_id);
                continue;
            }

            // Money motion
            let [x, y]: [number, number] = this.session.getPosition(event.card_id);

            for (let pid = 0; pid < event.moneys.length; pid++) {
                let money: number = event.moneys[pid];
                if (money === 0) {
                    continue;
                }
                this.drawMoneyMotion(money, pid, x, y);
            }
        }
    }

    private drawMoneyMotion(money: number, player_id: PlayerId, x: number, y: number): void {
        if (money > 0) {
            this.effectMoneyMotion(`field_${x}_${y}`, `player_${player_id}_money`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}_money`, `field_${x}_${y}`, money);
        }
    }

    private effectCharacter(player_id: PlayerId, card_id: CardId): void {
        let character: Character = this.session.getCharacter(card_id);
        document.getElementById("char_motion_name").innerText = character.name;
        document.getElementById("char_motion_description").innerText = character.getDescription();

        // Animation.
        let new_node: Node = document.getElementById("char_motion").cloneNode(true);
        let char_motion: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
        this.effectElementMotion(char_motion, `player_${player_id}_money`, "field_5_2");
    }

    private effectMoneyMotion(elementFrom: string, elementTo: string, money: number): void {
        // Animation.
        let new_node: Node = document.getElementById("money_motion").cloneNode(true);
        let money_motion: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
        money_motion.innerHTML += String(money);
        this.effectElementMotion(money_motion, elementFrom, elementTo);
    }

    private effectElementMotion(element: HTMLElement, elementFrom: string, elementTo: string): void {
        let element_from: HTMLElement = document.getElementById(elementFrom);
        let rect_from = element_from.getBoundingClientRect();
        let element_to: HTMLElement = document.getElementById(elementTo);
        let rect_to = element_to.getBoundingClientRect();
        let diff_x: number = rect_to.left - rect_from.left;
        let diff_y: number = rect_to.top - rect_from.top;

        element.style.visibility = "visible";
        element.style.zIndex = "2";
        element.style.position = "absolute";
        element.style.top = rect_from.top + "px";
        element.style.left = rect_from.left + "px";

        element.style.transitionDuration = "1s";
        element.style.transform = `translate(${diff_x}px, ${diff_y}px)`;

        window.setTimeout(() => {
            document.body.removeChild(element);
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
