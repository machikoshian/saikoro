import { Phase, Session, Event, EventType } from "./session";
import { PlayerCards } from "./card_manager";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility, CharacterType, Character,
         CardData, FacilityDataId } from "./facility";
import { Dice, DiceResult } from "./dice";
import { Client, Request } from "./client";
import { DeckMaker } from "./deck_maker";
import { GameMode } from "./protocol";

const COLOR_FIELD: string = "#EFF0D1";
const COLOR_LANDMARK: string = "#B0BEC5";
const COLOR_CLICKABLE: string = "#FFCA28";
const COLOR_HIGHTLIGHT_CARD: string = "#FFE082";
const COLOR_CHARACTER: string = "#FFF9C4";
const COLOR_PLAYERS: string[] = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
const COLOR_GRAY: string = "#B0BEC5";
const COLOR_BLUE: string = "#90CAF9";
const COLOR_GREEN: string = "#A5D6A7";
const COLOR_RED: string = "#EF9A9A";
const COLOR_PURPLE: string = "#B39DDB";

export class HtmlView {
    private event_drawer_timer = null;
    private money_animation_timers = [null, null, null, null];
    private client: Client;
    private session: Session = null;
    private prev_session: Session = null;
    private clicked_card_id: CardId = -1;
    private clicked_card_element: HTMLElement = null;
    private player_cards_list: CardId[][] = [];
    private last_step: number = -1;
    private drawn_step: number = -1;
    private field_info_card_id: CardId = -1;
    private deck_maker: DeckMaker = new DeckMaker();
    private clicked_field: [number, number] = [0, 0];

    constructor(client: Client) {
        this.client = client;
        this.prev_session = new Session();
    }

    public initView(column: number = 12, row: number = 5):void {
        // Message
        this.drawMessage("");

        // Add click listeners.
        // Matching.
        document.getElementById("matching_button").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine); });
        document.getElementById("matching_button_2players").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLine2Players); });

        // Hide components for game.
        document.getElementById("players").style.display = "none";
        document.getElementById("message").style.display = "none";
        document.getElementById("dice").style.display = "none";

        document.getElementById("cards_1").style.display = "none";
        document.getElementById("cards_2").style.display = "none";
        document.getElementById("cards_3").style.display = "none";
        document.getElementById("landmarks").style.display = "none";

        // Fields
        for (let y: number = 0; y < row; ++y) {
            for (let x: number = 0; x < column; ++x) {
                document.getElementById(`click_${x}_${y}`).addEventListener(
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
                let element = document.getElementById(`card_${p}_${c}`);
                element.addEventListener("click", () => { this.onClickCard(p, c); });
                element.style.display = "none";
            }
        }

        // Landmark cards
        let landmark_size: number = 5;
        for (let l: number = 0; l < landmark_size; ++l) {
            document.getElementById(`landmark_${l}`).addEventListener(
                "click", () => { this.onClickLandmark(l); });
        }

        document.getElementById("money_motion").style.display = "none";
        document.getElementById("char_motion_node").style.display = "none";
        document.getElementById("field_card_node").style.display = "none";
    }

    private onClickDeckField(x: number, y: number): void {
        let [px, py]: [number, number] = this.clicked_field;
        document.getElementById(`click_${px}_${py}`).style.borderColor = "transparent";
        this.clicked_field = [x, y];

        if (px === x && py === y) {
            this.deck_maker.removeFacility(x, y);
            this.drawDeckBoard();
            return;
        }

        document.getElementById(`click_${x}_${y}`).style.borderColor = COLOR_CLICKABLE;

        let i: number = 0;
        let data_ids: FacilityDataId[] = this.deck_maker.getAvailableFacilities(x);
        for (; i < data_ids.length; ++i) {
            let facility: Facility = new Facility(data_ids[i]);
            this.drawFacilityCard(`card_0_${i}`, facility);
            document.getElementById(`card_0_${i}`).style.display = "";
        }
        for (; i < 10; ++i) {
            document.getElementById(`card_0_${i}`).style.display = "none";
        }
    }

    private onClickField(x: number, y: number): void {
        console.log(`clicked: field_${x}_${y}`);
        // Event on matching.
        if (this.last_step === -1) {
            this.onClickDeckField(x, y);
            return;
        }
        // Event on game.
        if (this.clicked_card_id < 0) {
            this.drawFieldInfo(x, y);
            return;
        }
        this.client.sendRequest(Request.buildFacility(x, y, this.clicked_card_id));
    }

    private onClickDice(dice_num: number, aim: number): void {
        this.client.sendRequest(Request.rollDice(dice_num, aim));
    }

    private onClickCharacter(): void {
        this.client.sendRequest(Request.characterCard(this.clicked_card_id));
    }

    private onClickEndTurn(): void {
        this.client.sendRequest(Request.endTurn());
    }

    private onClickMatching(mode: GameMode): void {
        let name: string = (<HTMLInputElement>document.getElementById("matching_name")).value;
        if (name.length === 0) {
            return;
        }
        let deck: string = (<HTMLInputElement>document.getElementById("deck")).value;
        this.client.matching(Request.matching(name, mode, deck));
    }

    private onClickCard(player: number, card: number): void {
        // Event on matching.
        if (this.last_step === -1) {
            let [x, y]: [number, number] = this.clicked_field;
            let data_id: FacilityDataId = this.deck_maker.getAvailableFacilities(x)[card];
            this.deck_maker.setFacility(x, y, data_id);
            this.drawDeckBoard();
            return;
        }

        // Event on game.
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
        this.clicked_card_element.style.borderColor = COLOR_HIGHTLIGHT_CARD;
        this.clicked_card_id = clicked_card_id;

        this.drawBoard(this.session);

        if (phase === Phase.CharacterCard) {
            document.getElementById("char_card").style.backgroundColor = COLOR_CLICKABLE;
        }

        if (phase === Phase.BuildFacility) {
            for (let area of this.session.getFacility(this.clicked_card_id).getArea()) {
                let x: number = area - 1;
                for (let y: number = 0; y < 5; y++) {
                    document.getElementById(`click_${x}_${y}`).style.borderColor = COLOR_CLICKABLE;
                }
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
        this.clicked_card_element.style.borderColor = COLOR_HIGHTLIGHT_CARD;
        this.clicked_card_id = clicked_card_id;

        this.drawBoard(this.session);

        let [x, y] = this.session.getPosition(this.clicked_card_id);
        document.getElementById(`click_${x}_${y}`).style.borderColor = COLOR_CLICKABLE;
    }

    private getPlayerColor(player_id: PlayerId): string {
        if (player_id === -1 || player_id > COLOR_PLAYERS.length) {
            return COLOR_FIELD;
        }
        return COLOR_PLAYERS[player_id];
    }

    private getFacilityColor(facility: Facility): string {
        if (!facility) {
            return COLOR_FIELD;
        }
        let type: FacilityType = facility.type;
        switch(type) {
            case FacilityType.Gray:
                return COLOR_GRAY;
            case FacilityType.Blue:
                return COLOR_BLUE;
            case FacilityType.Green:
                return COLOR_GREEN;
            case FacilityType.Red:
                return COLOR_RED;
            case FacilityType.Purple:
                return COLOR_PURPLE;
        }
    }

    private getDiceDeltaMessage(delta: number): string {
        if (delta === 0) {
            return "";
        }
        let unit: string = (delta > 0) ? "+" : "";
        return `(${unit}${delta})`;
    }

    private getDiceResultMessage(dice: DiceResult, pid: PlayerId): string {
        let faces: string[] = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

        let d1: number = dice.dice1;
        let d2: number = dice.dice2;
        let delta: string = this.getDiceDeltaMessage(dice.delta);
        let name: string = this.session.getPlayer(pid).name;
        return `${name} のサイコロは ${faces[d1]} ${faces[d2]} ${delta}: ${dice.result()} でした。`;
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

        // Show components for game.
        document.getElementById("players").style.display = "";
        document.getElementById("message").style.display = "";
        document.getElementById("dice").style.display = "";

        document.getElementById("cards_1").style.display = "";
        document.getElementById("cards_2").style.display = "";
        document.getElementById("cards_3").style.display = "";
        document.getElementById("landmarks").style.display = "";

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

        // Update buttons.
        let current_player: Player = session.getCurrentPlayer();
        if (current_player.user_id === user_id) {
            document.getElementById("dice").style.display = "";
        }
        else {
            document.getElementById("dice").style.display = "none";
        }

        let phase: Phase = session.getPhase();
        if (phase === Phase.CharacterCard) {
            document.getElementById("char_card").style.visibility = "visible";
            document.getElementById("char_card").style.backgroundColor = COLOR_FIELD;
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

        for (let i: number = 0; i < players.length; ++i) {
            let card_ids: CardId[] = session.getSortedHand(i);
            for (let j: number = 0; j < 10; ++j) {
                this.drawCard(`card_${i}_${j}`, (j < card_ids.length) ? card_ids[j] : -1);
            }
        }

        // Update landmarks.
        for (let j: number = 0; j < 5; ++j) {
            this.drawCard(`landmark_${j}`, (j < landmark_ids.length) ? landmark_ids[j] : -1);
        }

        this.resetCards();  // Nice to check if built or not?
        this.last_step = session.getStep();
    }

    public drawFieldInfo(x, y): void {
        let card_id: CardId = this.session.getCardIdOnBoard(x, y);
        let element: HTMLElement = document.getElementById("field_card_node");

        if (card_id === -1 || card_id === this.field_info_card_id) {
            element.style.display = "none";
            this.field_info_card_id = -1;
            return;
        }
        this.field_info_card_id = card_id;

        this.drawCard("field_card", card_id);
        let position: string = (x < 6) ? "field_10_1" : "field_0_1";
        let pos_rect: ClientRect = document.getElementById(position).getBoundingClientRect();

        element.style.display = "";
        element.style.zIndex = "2";
        element.style.position = "absolute";
        element.style.top = pos_rect.top + "px";
        element.style.left = pos_rect.left + "px";
    }

    public drawCard(element_id: string, card_id: CardId): void {
        // No card
        if (card_id === -1) {
            document.getElementById(element_id).style.display = "none";
            return;
        }

        // Character
        if (this.session.isCharacter(card_id)) {
            let character: Character = this.session.getCharacter(card_id);
            document.getElementById(element_id).style.display = "table-cell";
            document.getElementById(element_id + "_name").innerText = character.getName();
            document.getElementById(element_id + "_cost").innerText = "";
            document.getElementById(element_id + "_description").innerText = character.getDescription();
            document.getElementById(element_id).style.backgroundColor = COLOR_CHARACTER;
            return;
        }

        // Landmark
        if (this.session.isLandmark(card_id)) {
            let landmark: Facility = this.session.getFacility(card_id);
            document.getElementById(element_id).style.display = "table-cell";
            document.getElementById(element_id + "_name").innerText = landmark.getName();
            document.getElementById(element_id + "_cost").innerText = String(landmark.getCost());
            document.getElementById(element_id + "_description").innerText = landmark.getDescription();
            let owner_id: PlayerId = this.session.getOwnerId(card_id);
            if (owner_id === -1) {
                document.getElementById(element_id).style.backgroundColor =
                    this.getFacilityColor(landmark);
            } else {
                document.getElementById(element_id).style.backgroundColor =
                    this.getPlayerColor(owner_id);
            }
            return;
        }

        // Facility
        let facility: Facility = this.session.getFacility(card_id);
        this.drawFacilityCard(element_id, facility);
    }

    public drawFacilityCard(element_id: string, facility: Facility): void {
        // Facility
        let area: string = this.getFacilityAreaString(facility);
        document.getElementById(element_id).style.display = "table-cell";
        document.getElementById(element_id + "_name").innerText = `${area} ${facility.getName()}`;
        document.getElementById(element_id + "_cost").innerText = String(facility.getCost());
        document.getElementById(element_id + "_description").innerText = facility.getDescription();
        document.getElementById(element_id).style.backgroundColor = this.getFacilityColor(facility);
    }

    private getFacilityAreaString(facility: Facility): string {
        const area_name: string[] =
            ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", ""];

        let area: string = facility.getArea().map((i) => {
            if (facility.size === 2) {  // TODO: support more than 2, if necessary.
                return `${area_name[i]}+${area_name[i + 1]}`;
            }
            return area_name[i];
        }).join(",");

        return area;
    }

    public drawBoard(session: Session): void {  // session may take a different value.
        const board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                const facility_id: CardId = board.getRawCardId(x, y);
                const owner_id: PlayerId = session.getOwnerId(facility_id);
                let facility: Facility =
                    (facility_id < 0) ? null : session.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
    }

    public drawDeckBoard(): void {
        const board: Board = this.deck_maker.board;
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                const facility_id: CardId = board.getRawCardId(x, y);
                const owner_id: PlayerId = 0;
                let facility: Facility =
                    (facility_id < 0) ? null : this.deck_maker.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
        let [x, y]: [number, number] = this.clicked_field;
        document.getElementById(`click_${x}_${y}`).style.borderColor = COLOR_CLICKABLE;
        document.getElementById("deck").innerText =
            JSON.stringify(this.deck_maker.getFacilityDataIds());
    }

    private drawField(x: number, y: number,
                      facility_id: CardId, facility: Facility, owner_id: PlayerId): void {
        let field: HTMLElement = document.getElementById(`field_${x}_${y}`);

        document.getElementById(`click_${x}_${y}`).style.borderColor = "transparent";
        (<HTMLTableCellElement>field).colSpan = 1;
        field.style.display = "";

        if (facility_id === -1) {
            field.innerText = "";
            field.style.backgroundColor = COLOR_FIELD;
            field.style.borderColor = COLOR_FIELD;
            return;
        }

        if (facility_id === -2) {
            field.style.display = "none";
            return;
        }

        // (ownder_id === -1) means a prebuild landmark.
        let owner_color: string =
            (owner_id === -1) ? COLOR_LANDMARK : this.getPlayerColor(owner_id);

        field.innerText = facility.getName();
        field.style.display = "";
        field.style.backgroundColor = owner_color;
        field.style.borderColor = this.getFacilityColor(facility);

        (<HTMLTableCellElement>field).colSpan = facility.size;
    }

    public getDisplayedMoney(pid: PlayerId): number {
        let money_element = document.getElementById(`player_${pid}_money`);
        return Number(money_element.innerText);        
    }

    public setDisplayedMoney(pid: PlayerId, money: number): void {
        let money_element = document.getElementById(`player_${pid}_money`);
        money_element.innerText = String(money);
    }

    private effectPlayersMoney(pid: PlayerId, money: number): void {
        if (this.money_animation_timers[pid]) {
            clearInterval(this.money_animation_timers[pid]);
        }
        this.money_animation_timers[pid] = setInterval(() => {
            let current_money = this.getDisplayedMoney(pid);
            if (current_money === money) {
                clearInterval(this.money_animation_timers[pid]);
                this.money_animation_timers[pid] = null;
                return;
            }
            else if (current_money > money) {
                current_money -= Math.min(10, current_money - money);
            }
            else if (current_money < money) {
                current_money += Math.min(10, money - current_money);
            }
            this.setDisplayedMoney(pid, current_money);
        }, 5);
    }

    private drawPlayers(): void {
        let players: Player[] = this.session.getPlayers();
        for (let i: number = 0; i < players.length; ++i) {
            let player: Player = players[i];
            document.getElementById(`player_${i}`).style.visibility = "visible";
            document.getElementById(`player_${i}_name`).innerText = player.name;
            document.getElementById(`player_${i}_salary`).innerHTML = `${player.salary}`;
            let cards: PlayerCards = this.session.getPlayerCards(i);
            document.getElementById(`player_${i}_talon`).innerHTML =
                `${cards.getHandSize()}　／　📇 ${cards.getTalonSize()}`;

            this.effectPlayersMoney(i, player.getMoney());
        }
        for (let i: number = players.length; i < 4; ++i) {
            document.getElementById(`player_${i}`).style.visibility = "hidden";
        }
    }

    public drawMessage(message: string, color: string = COLOR_FIELD): void {
        let element = document.getElementById("message");
        element.innerText = message;
        element.style.backgroundColor = color;
    }

    public drawStatusMessage(): boolean {  // TODO: rename it.
        let session = this.session;

        let players: Player[] = session.getPlayers();
        let player_id: PlayerId = session.getCurrentPlayerId();

        // Update message.
        let current_player: Player = players[player_id];
        let name: string =  current_player.name;
        let phase: Phase = session.getPhase();
        let message: string = "";
        let color: string = this.getPlayerColor(player_id);
        if (phase === Phase.StartGame) {
            message = "🎲 マッチング中です 🎲";
            this.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.CharacterCard) {
            let delta: string = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `🎲 ${name} のキャラカードまたはサイコロ${delta}です 🎲`;
            this.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.DiceRoll) {
            let delta: string = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `🎲 ${name} のサイコロ${delta}です 🎲`;
            this.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.BuildFacility) {
            message = `🎲 ${name} の建設です 🎲`;
            this.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.EndGame) {
            let events: Event[] = this.session.getEvents();
            let quited: boolean = false;
            for (let event of events) {
                if (event.type === EventType.Quit) {
                    quited = true;
                    for (let i = 0; i < event.moneys.length; ++i) {
                        if (event.moneys[i] !== 0) {
                            message = `🎲 ${players[i].name} が切断しました 🎲`;
                            this.drawMessage(message, this.getPlayerColor(i));
                        }
                    }
                    break;
                }
            }
            if (!quited) {
                let winner: string = session.getPlayer(session.getWinner()).name;
                message = `🎲 ${name} の勝ちです 🎲`;
                this.drawMessage(message, this.getPlayerColor(session.getWinner()));
            }
            return true;
        }
        return false;
    }

    public drawEvents(): void {
        const interval: number = 2000;  // msec.
        if (this.event_drawer_timer) {
            // If setInterval is ongoing, use that one. No additional action.
        }
        else {
            // Show the first message soon.
            this.drawEvent();
            // After 2 sec, continuously call showMessageFromQueue every 2 sec.
            this.event_drawer_timer = setInterval(() => {
                if (!this.drawEvent()) {
                    // If the queue is empty, clear the timer.
                   clearInterval(this.event_drawer_timer);
                   this.event_drawer_timer = null;
                }
            }, interval);
        }
    }

    private drawEvent(): boolean {
        let events: Event[] = this.session.getEvents();
        let step: number = -1;
        let i: number = 0;
        for (; i < events.length; ++i) {
            // Skip passed events.
            if (events[i].step > this.drawn_step) {
                step = events[i].step;
                break;
            }
        }

        if (step === -1) {
            // All events have been drawn. Then, draw the current status.
            this.drawStatusMessage();
            this.drawPlayers();
            this.drawBoard(this.session);
            this.prev_session = this.session;
            return false;
        }

        for (; i < events.length; ++i) {
            let event: Event = events[i];
            if (event.step !== step) {
                break;
            }

            // Dice
            if (event.type === EventType.Dice) {
                let message: string = "";
                let color: string = this.getPlayerColor(-1);
                for (let pid = 0; pid < event.moneys.length; ++pid) {
                    if (event.moneys[pid] !== 0) {
                        message = this.getDiceResultMessage(event.dice, pid);
                        color = this.getPlayerColor(pid);
                        break;
                    }
                }
                this.drawMessage(message, color);
                continue;
            }

            // Character card
            if (event.type === EventType.Character) {
                this.effectCharacter(this.session.getCurrentPlayerId(), event.card_id);
                continue;
            }

            if (event.type === EventType.Salary) {
                for (let pid = 0; pid < event.moneys.length; pid++) {
                    let money: number = event.moneys[pid];
                    if (money === 0) {
                        continue;
                    }
                    // TODO: Use prev_session?
                    this.effectPlayersMoney(pid, this.getDisplayedMoney(pid) + money);
                }
            }

            if (event.type === EventType.Build) {
                let [x, y]: [number, number] = this.session.getPosition(event.card_id);
                let facility: Facility = this.session.getFacility(event.card_id);
                this.prev_session.getBoard().removeCards(x, y, facility.size);
                this.prev_session.getBoard().setCardId(x, y, event.card_id, facility.size);
                this.drawBoard(this.prev_session);
            }

            const money_motion: EventType[] = [
                EventType.Blue,
                EventType.Green,
                EventType.Red,
                EventType.Purple,
                EventType.Build,
            ];
            if (money_motion.indexOf(event.type) !== -1) {
                // Money motion
                let [x, y]: [number, number] = this.session.getPosition(event.card_id);

                for (let pid = 0; pid < event.moneys.length; pid++) {
                    let money: number = event.moneys[pid];
                    if (money === 0) {
                        continue;
                    }
                    let delay: number = 0;
                    if ([EventType.Red, EventType.Purple, EventType.Build].indexOf(event.type) !== -1 &&
                        money > 0) {
                        delay = 1000;
                    }
                    window.setTimeout(() => {
                        this.drawMoneyMotion(money, pid, x, y);
                    }, delay);
                }
            }
        }
        this.drawn_step = step;
        return true;
    }

    private drawMoneyMotion(money: number, player_id: PlayerId, x: number, y: number): void {
        if (money > 0) {
            this.effectMoneyMotion(`field_${x}_${y}`, `player_${player_id}_money`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}_money`, `field_${x}_${y}`, money);
        }
        this.effectPlayersMoney(player_id, this.getDisplayedMoney(player_id) + money);
    }

    private effectCharacter(player_id: PlayerId, card_id: CardId): void {
        this.drawCard("char_motion", card_id);

        // Animation.
        let new_node: Node = document.getElementById("char_motion_node").cloneNode(true);
        let char_motion: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
        char_motion.style.display = "";
        this.effectElementMotion(char_motion, `player_${player_id}_money`, "field_5_2");
    }

    private effectMoneyMotion(elementFrom: string, elementTo: string, money: number): void {
        // Animation.
        let new_node: Node = document.getElementById("money_motion").cloneNode(true);
        let money_motion: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
        money_motion.style.display = "";
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
}
