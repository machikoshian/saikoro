import { Phase, Session, Event, EventType } from "./session";
import { PlayerCards } from "./card_manager";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility, CharacterType, Character,
         CardData, FacilityDataId } from "./facility";
import { Dice, DiceResult } from "./dice";
import { Client, Request } from "./client";
import { DeckMaker } from "./deck_maker";
import { GameMode } from "./protocol";
import { HtmlViewObject, HtmlCardsView, HtmlCardView, HtmlFloatingCardView,
         HtmlPlayerView, HtmlMessageView, HtmlButtonsView } from "./html_view_parts";

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
    private client: Client;
    private session: Session = null;
    private prev_session: Session = null;
    private clicked_card_view: HtmlCardView = null;
    private player_cards_list: CardId[][] = [];
    private last_step: number = -1;
    private drawn_step: number = -1;
    private deck_maker: DeckMaker = new DeckMaker();
    private clicked_field: [number, number] = [0, 0];
    private cards_views: HtmlCardsView[] = [];
    private player_views: HtmlPlayerView[] = [];
    private landmarks_view: HtmlCardsView = null;
    private field_card_view: HtmlFloatingCardView = null;
    private char_motion_view: HtmlFloatingCardView = null;
    private money_motion_view: HtmlViewObject = null;
    private message_view: HtmlMessageView = null;
    private buttons_view: HtmlButtonsView = null;

    constructor(client: Client) {
        this.client = client;
        this.prev_session = new Session();
    }

    public initView(column: number = 12, row: number = 5):void {
        // Add click listeners.
        // Matching.
        document.getElementById("matching_button_offline").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine); });
        document.getElementById("matching_button_online").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle); });
        document.getElementById("matching_button_2players").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLine2Players); });

        // Hide components for game.
        document.getElementById("players").style.display = "none";

        // buttons.
        this.buttons_view = new HtmlButtonsView("buttons");
        this.buttons_view.none();

        this.buttons_view.dice1.addClickListener(() => { this.onClickDice(1, 0); });
        this.buttons_view.dice2.addClickListener(() => { this.onClickDice(2, 0); });
        this.buttons_view.char_card.addClickListener(() => { this.onClickCharacter(); });
        this.buttons_view.end_turn.addClickListener(() => { this.onClickEndTurn(); });

        // Message view.
        this.message_view = new HtmlMessageView("message");
        this.message_view.none();

        // HtmlPlayerView
        for (let pid = 0; pid < 4; ++pid) {
            let player_view: HtmlPlayerView = new HtmlPlayerView(pid);
            player_view.none();
            this.player_views.push(player_view);
        }

        // HtmlCardsView
        let card_size: number = 10;
        for (let pid = 0; pid < 4; ++pid) {
            let cards_view: HtmlCardsView = new HtmlCardsView(`card_${pid}`, card_size);
            cards_view.none();
            for (let c: number = 0; c < card_size; ++c) {
                cards_view.cards[c].addClickListener(() => { this.onClickCard(pid, c); });
            }
            this.cards_views.push(cards_view);
        }
        this.cards_views[0].show();

        // Landmark cards
        let landmark_size: number = 5;
        this.landmarks_view = new HtmlCardsView("landmark", landmark_size);
        this.landmarks_view.none();
        for (let i: number = 0; i < landmark_size; ++i) {
            this.landmarks_view.cards[i].addClickListener(() => { this.onClickLandmark(i); });
        }

        // Field card
        this.field_card_view = new HtmlFloatingCardView("field_card");
        this.field_card_view.none();

        // Fields
        for (let y: number = 0; y < row; ++y) {
            for (let x: number = 0; x < column; ++x) {
                document.getElementById(`click_${x}_${y}`).addEventListener(
                    "click", () => { this.onClickField(x, y); });
            }
        }

        // Character motion
        this.char_motion_view = new HtmlFloatingCardView("char_motion");
        this.char_motion_view.none();

        // Money motion
        this.money_motion_view = new HtmlViewObject(document.getElementById("money_motion"));
        this.money_motion_view.none();
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
            let card_view: HtmlCardView = new HtmlCardView(`card_0_${i}`);
            card_view.drawFacilityCard(facility);
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
        if (this.clicked_card_view == null) {
            this.drawFieldInfo(x, y);
            return;
        }
        let card_id: CardId = this.clicked_card_view.getCardId();
        this.client.sendRequest(Request.buildFacility(x, y, card_id));
    }

    private onClickDice(dice_num: number, aim: number): void {
        this.client.sendRequest(Request.rollDice(dice_num, aim));
    }

    private onClickCharacter(): void {
        this.client.sendRequest(Request.characterCard(this.clicked_card_view.getCardId()));
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

        let is_valid: boolean = ((phase === Phase.CharacterCard) && is_char ||
                                 (phase === Phase.BuildFacility) && !is_char);
        if (!is_valid) {
            return;
        }

        console.log(`clicked: card_${player}_${card}`);
        if (this.clicked_card_view && clicked_card_id === this.clicked_card_view.getCardId()) {
            this.resetCards();
            this.drawBoard(this.session);  // TODO: draw click fields only.
            return;
        }

        this.resetCards();
        this.clicked_card_view = this.cards_views[player].cards[card];
        this.clicked_card_view.setHighlight(true);

        this.drawBoard(this.session);

        if (phase === Phase.CharacterCard) {
            this.buttons_view.char_card.setClickable(true);
        }

        if (phase === Phase.BuildFacility) {
            for (let area of this.session.getFacility(clicked_card_id).getArea()) {
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
        this.clicked_card_view = this.landmarks_view.cards[card];
        this.clicked_card_view.setHighlight(true);

        this.drawBoard(this.session);

        let [x, y] = this.session.getPosition(clicked_card_id);
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
        if (this.clicked_card_view) {
            this.clicked_card_view.setHighlight(false);
            this.clicked_card_view = null;
        }
    }

    public updateView(session: Session, user_id: string): void {
        this.session = session;

        // Hide the matching view and show the board view.
        document.getElementById("matching").style.display = "none";

        // Show components for game.
        document.getElementById("players").style.display = "";

        // Message view.
        this.message_view.show();

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
        this.buttons_view.draw(session, user_id);

        this.last_step = session.getStep();
    }

    public drawCards(session: Session): void {
        // Update cards.
        for (let i: number = 0; i < 4; ++i) {
            if (this.client.player_id !== i) {
                this.cards_views[i].none();
                continue;
            }
            let card_ids: CardId[] = session.getSortedHand(i);
            this.cards_views[i].draw(session, card_ids);
            this.cards_views[i].show();
        }

        // Update landmarks.
        let landmark_ids: CardId[] = session.getLandmarks();
        this.landmarks_view.draw(session, landmark_ids);
        this.landmarks_view.show();

        this.resetCards();  // Nice to check if built or not?
    }

    public drawFieldInfo(x, y): void {
        let card_id: CardId = this.session.getCardIdOnBoard(x, y);
        if (card_id === -1 || card_id === this.field_card_view.getCardId()) {
            this.field_card_view.none();
            this.field_card_view.setCardId(-1);
            return;
        }

        this.field_card_view.setCardId(card_id);
        this.field_card_view.draw(this.session);
        this.field_card_view.showAt(this.getPosition((x < 6) ? "click_10_1" : "click_0_1"));
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

    private drawPlayers(): void {
        let players: Player[] = this.session.getPlayers();
        for (let i: number = 0; i < players.length; ++i) {
            this.player_views[i].draw(this.session);
        }
        for (let i: number = players.length; i < 4; ++i) {
            this.player_views[i].hide();
        }
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
            message = "マッチング中です";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.CharacterCard) {
            let delta: string = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `${name} のキャラカードまたはサイコロ${delta}です`;
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.DiceRoll) {
            let delta: string = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `${name} のサイコロ${delta}です`;
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === Phase.BuildFacility) {
            message = `${name} の建設です`;
            this.message_view.drawMessage(message, color);
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
                            message = `${players[i].name} が切断しました`;
                            this.message_view.drawMessage(message, this.getPlayerColor(i));
                        }
                    }
                    break;
                }
            }
            if (!quited) {
                let winner: string = session.getPlayer(session.getWinner()).name;
                message = `${name} の勝ちです`;
                this.message_view.drawMessage(message, this.getPlayerColor(session.getWinner()));
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
            this.drawCards(this.session);
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
                this.message_view.drawMessage(message, color);
                continue;
            }

            // Character card
            if (event.type === EventType.Character) {
                this.effectCharacter(this.session.getCurrentPlayerId(), event.card_id);
                if (this.session.getCharacter(event.card_id).type === CharacterType.DrawCards) {
                    let timeout: number = 1000;
                    for (let drawn of event.target_card_ids) {
                        window.setTimeout(() => {
                            this.effectDrawCard(event.player_id, drawn);
                        }, timeout);
                        timeout += 500;
                    }
                }
                continue;
            }

            if (event.type === EventType.Salary) {
                for (let pid = 0; pid < event.moneys.length; pid++) {
                    let money: number = event.moneys[pid];
                    if (money === 0) {
                        continue;
                    }
                    this.player_views[pid].addMoney(money);
                }
            }

            if (event.type === EventType.Build) {
                let [x, y]: [number, number] = this.session.getPosition(event.card_id);
                let facility: Facility = this.session.getFacility(event.card_id);
                this.prev_session.getBoard().removeCards(x, y, facility.size);
                this.prev_session.getBoard().setCardId(x, y, event.card_id, facility.size);
                // Draw the board after money motion.
                window.setTimeout(() => { this.drawBoard(this.prev_session); }, 1000);
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
        this.player_views[player_id].addMoney(money);
    }

    private getPosition(element_id: string): [number, number] {
        let rect: ClientRect = document.getElementById(element_id).getBoundingClientRect();
        return [rect.left, rect.top];
    }

    private effectCharacter(player_id: PlayerId, card_id: CardId): void {
        this.char_motion_view.setCardId(card_id);
        this.char_motion_view.draw(this.session);

        // Animation.
        let new_view: HtmlViewObject = this.char_motion_view.clone();
        new_view.showAt(this.getPosition(`player_${player_id}_money`));
        new_view.animateMoveTo(this.getPosition("field_5_2"));
        window.setTimeout(() => { new_view.remove(); }, 1500);
    }

    private effectDrawCard(player_id: PlayerId, card_id: CardId): void {
        this.char_motion_view.setCardId(card_id);
        this.char_motion_view.draw(this.session);

        // Animation.
        let new_view: HtmlViewObject = this.char_motion_view.clone();
        new_view.showAt(this.getPosition(`player_${player_id}_money`));
        new_view.animateMoveTo(this.getPosition(`card_${player_id}_0`));
        window.setTimeout(() => { new_view.remove(); }, 1500);
    }

    private effectMoneyMotion(element_from: string, element_to: string, money: number): void {
        this.money_motion_view.element.innerHTML = `💸 ${money}`;

        // Animation.
        let money_view: HtmlViewObject = this.money_motion_view.clone();
        money_view.showAt(this.getPosition(element_from));
        money_view.animateMoveTo(this.getPosition(element_to));
        window.setTimeout(() => { money_view.remove(); }, 1500);
    }
}
