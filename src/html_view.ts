import { Phase, Session, Event, EventType } from "./session";
import { PlayerCards } from "./card_manager";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility, CharacterType, Character,
         CardData, CardDataId } from "./facility";
import { Dice, DiceResult } from "./dice";
import { Client, Request } from "./client";
import { DeckMaker } from "./deck_maker";
import { GameMode, Protocol } from "./protocol";
import { HtmlViewObject, HtmlCardsView, HtmlCardView, HtmlPlayerView,
         HtmlMessageView, HtmlButtonsView,
         HtmlDeckCharView, HtmlBoardView } from "./html_view_parts";

const COLOR_FIELD: string = "#FFF8E1";
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

enum Scene {
    None,
    Matching,
    Deck,
    Game,
}

export class HtmlView {
    private event_drawer_timer = null;
    private client: Client;
    private session: Session = null;
    private prev_session: Session = null;
    private prev_step: number = -1;
    private clicked_card_view: HtmlCardView = null;
    private deck_maker: DeckMaker = new DeckMaker();
    private deck_char_view: HtmlDeckCharView = null;
    private clicked_field: [number, number] = [-1, -1];
    private cards_views: HtmlCardsView[] = [];
    private player_views: HtmlPlayerView[] = [];
    private back_button_view: HtmlViewObject = null;
    private reset_button_view: HtmlViewObject = null;
    private board_view: HtmlBoardView = null;
    private landmarks_view: HtmlCardsView = null;
    private field_card_view: HtmlCardView = null;
    private card_widget_view: HtmlCardView = null;
    private money_motion_view: HtmlViewObject = null;
    private message_view: HtmlMessageView = null;
    private buttons_view: HtmlButtonsView = null;
    private scene: Scene = Scene.None;

    constructor(client: Client) {
        this.client = client;
        this.reset();
    }

    private reset(): void {
        this.client.reset();
        this.prev_session = new Session();
        this.prev_step = -1;
        this.clicked_field = [-1, -1];

        if (this.event_drawer_timer) {
            clearInterval(this.event_drawer_timer);
            this.event_drawer_timer = null;
        }
    }

    public initView(row: number = 5, column: number = 12): void {
        // Add click listeners.
        // Matching.
        document.getElementById("matching_button_deck").addEventListener(
            "click", () => { this.switchScene(Scene.Deck); });

        document.getElementById("matching_button_offline_2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_2); });
        document.getElementById("matching_button_offline_3").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_3); });
        document.getElementById("matching_button_offline_4").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_4); });

        document.getElementById("matching_button_online_2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle_2); });
        document.getElementById("matching_button_online_3").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle_3); });
        document.getElementById("matching_button_online_4").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle_4); });

        document.getElementById("matching_button_multi_2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLine2Players); });
        // 3 and 4 players are not supported yet.
        // document.getElementById("matching_button_multi_3").addEventListener(
        //     "click", () => { this.onClickMatching(GameMode.OnLine2Players); });
        // document.getElementById("matching_button_multi_4").addEventListener(
        //     "click", () => { this.onClickMatching(GameMode.OnLine2Players); });

        // buttons.
        this.back_button_view = new HtmlViewObject(document.getElementById("back"));
        this.back_button_view.addClickListener(() => { this.switchScene(Scene.Matching); });

        this.reset_button_view = new HtmlViewObject(document.getElementById("reset"));
        this.reset_button_view.addClickListener(() => {
            this.reset();
            this.switchScene(Scene.Matching);
        });

        this.buttons_view = new HtmlButtonsView("buttons");
        this.buttons_view.dice1.addClickListener(() => { this.onClickDice(1, 0); });
        this.buttons_view.dice2.addClickListener(() => { this.onClickDice(2, 0); });
        this.buttons_view.char_card.addClickListener(() => { this.onClickCharacter(); });
        this.buttons_view.end_turn.addClickListener(() => { this.onClickEndTurn(); });

        // Message view.
        this.message_view = new HtmlMessageView("message");

        // HtmlPlayerView
        for (let pid = 0; pid < 4; ++pid) {
            let player_view: HtmlPlayerView = new HtmlPlayerView(pid);
            player_view.callback = (player_id: PlayerId) => {
                this.onClickPlayer(player_id);
            }
            this.player_views.push(player_view);
        }

        // Board
        this.board_view = new HtmlBoardView("board", row, column);
        this.board_view.callback = (x: number, y: number) => {
            this.onClickField(x, y);
        }

        // HtmlDeckCharView
        this.deck_char_view = new HtmlDeckCharView("deck_char");
        this.deck_char_view.callback = (x: number) => {
            this.onClickDeckField(x, -1);
        }

        // HtmlCardsView
        let card_size: number = 10;
        for (let pid = 0; pid < 4; ++pid) {
            let cards_view: HtmlCardsView = new HtmlCardsView(`card_${pid}`, card_size);
            for (let c: number = 0; c < card_size; ++c) {
                cards_view.cards[c].addClickListener(() => { this.onClickCard(pid, c); });
            }
            this.cards_views.push(cards_view);
        }

        // Landmark cards
        let landmark_size: number = 5;
        this.landmarks_view = new HtmlCardsView("landmark", landmark_size);
        for (let i: number = 0; i < landmark_size; ++i) {
            this.landmarks_view.cards[i].addClickListener(() => { this.onClickLandmark(i); });
        }

        // Field card
        this.field_card_view = new HtmlCardView("field_card");

        // Character motion
        this.card_widget_view = new HtmlCardView("card_widget");

        // Money motion
        this.money_motion_view = new HtmlViewObject(document.getElementById("money_motion"));

        this.switchScene(Scene.Matching);
    }

    private switchScene(scene: Scene): void {
        if (this.scene === scene) {
            return;
        }

        this.scene = scene;

        // Hide all
        document.getElementById("matching").style.display = "none";
        this.back_button_view.none();
        document.getElementById("players").style.display = "none";
        for (let player_view of this.player_views) {
            player_view.none();
        }
        this.message_view.none();
        this.board_view.none();
        this.deck_char_view.none();

        this.buttons_view.none();
        this.landmarks_view.none();
        this.reset_button_view.none();

        for (let cards_view of this.cards_views) {
            cards_view.none();
        }
        this.field_card_view.none();

        if (scene === Scene.Matching) {
            document.getElementById("matching").style.display = "";
            return;
        }

        if (scene === Scene.Deck) {
            this.back_button_view.show();
            this.cards_views[0].show();
            this.board_view.show();
            this.deck_char_view.show();

            this.drawDeckBoard();
            for (let card_view of this.cards_views[0].cards) {
                card_view.none();
            }
            return;
        }

        if (scene === Scene.Game) {
            // Show components for game.
            document.getElementById("players").style.display = "";

            // Message view.
            this.message_view.show();
            this.board_view.show();
            this.board_view.redraw();
            if (this.session != null) {
                this.drawSession(this.session);
            }
            this.landmarks_view.show();
            if (Protocol.getPlayerCount(this.client.mode) === 1) {
                this.reset_button_view.show();
            }
            return;
        }
    }

    private onClickPlayer(player_id: PlayerId): void {
        // this.message_view.drawMessage(`${player_id}`);
    }

    private onClickDeckField(x: number, y: number): void {
        let [px, py]: [number, number] = this.clicked_field;
        if (px === -1) {
            // this.clicked_filed was not used. Do nothing.
        }
        else if (py === -1) {
            this.deck_char_view.setHighlight(px, false);
        }
        else {
            this.board_view.setClickable(this.clicked_field, false);
        }
        this.clicked_field = [x, y];

        if (px === x && py === y) {
            if (py === -1) {
                this.deck_maker.removeCharacter(x);
            }
            else {
                this.deck_maker.removeFacility(x, y);
            }
            this.drawDeckBoard();
            return;
        }

        let i: number = 0;
        if (y === -1) {
            this.deck_char_view.setHighlight(x, true);
            let data_ids: CardDataId[] = CardData.getAvailableCharacters();
            for (; i < data_ids.length; ++i) {
                let character: Character = new Character(data_ids[i]);
                this.cards_views[0].cards[i].drawCharacterCard(character);
            }
        }
        else {
            this.board_view.setClickable(this.clicked_field, true);
            let data_ids: CardDataId[] = this.deck_maker.getAvailableFacilities(x);
            for (; i < data_ids.length; ++i) {
                let facility: Facility = new Facility(data_ids[i]);
                this.cards_views[0].cards[i].drawFacilityCard(facility);
            }
        }

        for (; i < 10; ++i) {
            this.cards_views[0].cards[i].none();
        }
    }

    private onClickField(x: number, y: number): void {
        console.log(`clicked: field_${x}_${y}`);
        if (this.scene === Scene.Matching) {
            return;
        }

        if (this.scene === Scene.Deck) {
            this.onClickDeckField(x, y);
            return;
        }

        // Event on game (this.scene === Scene.Game).
        if (this.clicked_card_view == null) {
            this.drawFieldInfo(x, y);
            return;
        }
        let card_id: CardId = this.clicked_card_view.getCardId();
        let event: Event = this.session.getEventBuildFacility(this.client.player_id, x, y, card_id);
        if (event == null || !event.valid) {
            return;
        }
        this.client.sendRequest(Request.buildFacility(x, y, card_id));
        this.effectClonedObjectMove(this.clicked_card_view,
                                    this.clicked_card_view.element_id, `field_${x}_${y}`);
        this.drawEventsLater();
    }

    private isRequestReady(): boolean {
        // TODO: Create a function in Session.
        return (this.session.getStep() === this.prev_session.getStep() &&
                this.client.player_id === this.session.getCurrentPlayerId());
    }

    private onClickDice(dice_num: number, aim: number): void {
        if (!this.isRequestReady()) {
            return;
        }

        this.client.sendRequest(Request.rollDice(dice_num, aim));
        let dice_view: HtmlViewObject =
            (dice_num === 1) ? this.buttons_view.dice1 : this.buttons_view.dice2;
        dice_view.hide();
        this.effectClonedObjectMove(dice_view, dice_view.element.id, "board");
        this.drawEventsLater();
    }

    private onClickCharacter(): void {
        if (this.clicked_card_view == null) {
            return;
        }
        const card_id: CardId = this.clicked_card_view.getCardId();
        this.client.sendRequest(Request.characterCard(card_id));
        this.effectCharacter(this.client.player_id, card_id);
        this.drawEventsLater();
    }

    private onClickEndTurn(): void {
        this.client.sendRequest(Request.endTurn());
        this.drawEventsLater();
    }

    private onClickMatching(mode: GameMode): void {
        let name: string = (<HTMLInputElement>document.getElementById("matching_name")).value;
        if (name.length === 0) {
            return;
        }
        let deck: string = (<HTMLInputElement>document.getElementById("deck")).value;

        this.client.matching(Request.matching(name, mode, deck));
        this.message_view.drawMessage("通信中です", this.getPlayerColor(this.client.player_id));
        this.switchScene(Scene.Game);
    }

    private onClickCard(player: number, card: number): void {
        // Event on matching.
        if (this.scene === Scene.Matching) {
            return;
        }
        if (this.scene === Scene.Deck) {
            let [x, y]: [number, number] = this.clicked_field;
            if (x === -1) {
                // this.clicked_field was not used. Do nothing.
            }
            else if (y === -1) {
                // Char
                let data_id: CardDataId = CardData.getAvailableCharacters()[card];
                this.deck_maker.setCharacter(x, data_id);
            }
            else {
                let data_id: CardDataId = this.deck_maker.getAvailableFacilities(x)[card];
                this.deck_maker.setFacility(x, y, data_id);
            }
            this.drawDeckBoard();
            return;
        }

        // Event on game (this.scene === Scene.Game).
        let clicked_card_id: CardId = this.cards_views[player].cards[card].getCardId();
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
                for (let y: number = 0; y < 5; ++y) {  // TODO: y can be other than 5.
                    let event: Event =
                        this.session.getEventBuildFacility(player, x, y, clicked_card_id);
                    if (event && event.valid) {
                        this.board_view.setClickable([x, y], true);
                    }
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
        if (this.clicked_card_view && clicked_card_id === this.clicked_card_view.getCardId()) {
            this.resetCards();
            this.drawBoard(this.session);  // TODO: draw click fields only.
            return;
        }

        if (this.session.getOwnerId(clicked_card_id) !== -1) {
            return;
        }

        this.resetCards();
        this.clicked_card_view = this.landmarks_view.cards[card];
        this.clicked_card_view.setHighlight(true);

        this.drawBoard(this.session);

        this.board_view.setClickable(this.session.getPosition(clicked_card_id), true);
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

    public updateView(session: Session, player_id: PlayerId): void {
        this.session = session;

        // Show event animations.
        this.drawEvents();
    }

    public drawCards(session: Session): void {
        let players: Player[] = session.getPlayers();

        // Update cards.
        for (let i: number = 0; i < players.length; ++i) {
            if (this.client.player_id !== i) {
                this.cards_views[i].none();
                continue;
            }
            let card_ids: CardId[] = session.getSortedHand(i);
            this.cards_views[i].draw(session, card_ids);
            this.cards_views[i].show();
        }
        for (let i: number = players.length; i < 4; ++i) {
            this.cards_views[i].none();
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

        this.field_card_view.draw(this.session, card_id);
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
        for (let x: number = 0; x < 5; ++x) {
            this.deck_char_view.drawCharacter(x, this.deck_maker.getCharacter(x));
        }

        let [x, y]: [number, number] = this.clicked_field;
        if (y !== -1) {
            this.board_view.setClickable(this.clicked_field, true);
        }
        document.getElementById("deck").innerText =
            JSON.stringify(this.deck_maker.getDeck());
    }

    private drawField(x: number, y: number,
                      facility_id: CardId, facility: Facility, owner_id: PlayerId): void {
        let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
        this.board_view.setClickable([x, y], false);

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

    // TODO: move this function to other place/class.
    private hasCharacterCard(session: Session, player_id: PlayerId): boolean {
        let cards: CardId[] = session.getSortedHand(player_id);
        return session.isCharacter(cards[cards.length - 1]);
    }

    public drawStatusMessage(session: Session): boolean {  // TODO: rename it.
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
            let events: Event[] = session.getEvents();
            for (let event of events) {
                if (event.type === EventType.Quit) {
                    message = `${players[event.player_id].name} が切断しました`;
                    this.message_view.drawMessage(message, this.getPlayerColor(event.player_id));
                    return true;
                }
            }

            let winner: string = session.getPlayer(session.getWinner()).name;
            message = `${name} の勝ちです`;
            this.message_view.drawMessage(message, this.getPlayerColor(session.getWinner()));
            this.reset_button_view.show();
            return true;
        }
        return false;
    }

    private drawSession(session: Session): void {
        this.drawStatusMessage(session);
        this.drawPlayers();
        this.drawBoard(session);
        this.drawCards(session);

        // Update buttons.
        this.buttons_view.draw(session, this.client.player_id);

        this.prev_session = session;
    }

    private drawEventsLater(): void {
        // TODO: This is a hack to abuse this function is always called after sendRequest.
        // Nice to rename this function.
        this.buttons_view.hide();

        this.drawEvents(false);
    }

    public drawEvents(soon: boolean = true): void {
        const interval: number = 2000;  // msec.
        if (this.event_drawer_timer) {
            // If setInterval is ongoing, use that one. No additional action.
        }
        else {
            if (soon) {
                // Show the first message soon.
                this.drawEventsByStep();
            }
            // After 2 sec, continuously call showMessageFromQueue every 2 sec.
            this.event_drawer_timer = setInterval(() => {
                if (!this.drawEventsByStep()) {
                    // If the queue is empty, clear the timer.
                    clearInterval(this.event_drawer_timer);
                    this.event_drawer_timer = null;
                }
            }, interval);
        }
    }

    private drawEventsByStep(): boolean {
        let events: Event[] = this.session.getEvents();
        let step: number = -1;
        let i: number = 0;
        for (; i < events.length; ++i) {
            // Skip passed events.
            if (events[i].step > this.prev_step) {
                step = events[i].step;
                break;
            }
        }

        if (step === -1) {
            this.drawSession(this.session);
            return false;
        }

        let handled: boolean = false;
        for (; i < events.length; ++i) {
            let event: Event = events[i];
            if (event.step !== step) {
                if (handled) {
                    break;
                }
                // The previous step does not have handled events. Go to the next step.
                step = event.step;
            }

            if (this.drawEvent(event)) {
                handled = true;
            }
        }
        this.prev_step = step;

        if (handled) {
            return true;
        }
        // All events have been drawn. Then, draw the current status.
        this.drawSession(this.session);
        return false;
    }

    private drawEvent(event: Event): boolean {
        // Draw cards
        if (event.type === EventType.Draw) {  // TODO: Change the event type to StartTurn?
            let current_player: Player = this.session.getPlayer(event.player_id);
            let message = `${current_player.name} のターンです`;
            let color: string = this.getPlayerColor(event.player_id);
            this.message_view.drawMessage(message, color);

            if (event.player_id === this.client.player_id) {
                this.effectCardDeals(event.player_id, event.target_card_ids);
            }
            return true;
        }

        // Dice
        if (event.type === EventType.Dice) {
            let message: string = this.getDiceResultMessage(event.dice, event.player_id);
            let color: string = this.getPlayerColor(event.player_id);
            this.board_view.animateDiceResult(event.dice.result(), color);
            this.message_view.drawMessage(message, color);
            return true;
        }

        // Character card
        if (event.type === EventType.Character) {
            let handled: boolean = false;
            // Own card's effect was already done.
            if (event.player_id !== this.client.player_id) {
                this.effectCharacter(event.player_id, event.card_id);
                handled = true;
            }
            if (this.session.getCharacter(event.card_id).type === CharacterType.DrawCards) {
                this.effectCardDeals(event.player_id, event.target_card_ids);
                handled = true;
            }
            return handled;
        }

        if (event.type === EventType.Salary) {
            for (let pid = 0; pid < event.moneys.length; pid++) {
                let money: number = event.moneys[pid];
                if (money === 0) {
                    continue;
                }
                this.player_views[pid].addMoney(money);
                let name: string = this.session.getPlayer(pid).name;
                let message = `${name} に給料 ${money} が入りました`;
                let color: string = this.getPlayerColor(pid);
                this.message_view.drawMessage(message, color);
            }
            return true;
        }

        if (event.type === EventType.Build) {
            if (event.card_id === -1) {  // Pass.
                let name: string = this.session.getPlayer(event.player_id).name;
                let message = `${name} は何も建設しませんでした。`;
                let color: string = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage(message, color);
                return true;
            }

            let [x, y]: [number, number] = this.session.getPosition(event.card_id);
            let facility: Facility = this.session.getFacility(event.card_id);
            this.prev_session.getBoard().removeCards(x, y, facility.size);
            this.prev_session.getBoard().setCardId(x, y, event.card_id, facility.size);
            if (this.prev_session.isFacility(event.card_id)) {
                this.prev_session.getPlayerCards(event.player_id).moveHandToField(event.card_id);
            }
            // Draw the board after money motion.
            window.setTimeout(() => {
                this.drawBoard(this.prev_session);
                this.drawCards(this.prev_session);
            }, 1000);
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
        return true;
    }

    private drawMoneyMotion(money: number, player_id: PlayerId, x: number, y: number): void {
        if (money > 0) {
            this.effectMoneyMotion(`field_${x}_${y}`, `player_${player_id}`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}`, `field_${x}_${y}`, money);
        }
        this.player_views[player_id].addMoney(money);
    }

    private getPosition(element_id: string): [number, number] {
        let rect: ClientRect = document.getElementById(element_id).getBoundingClientRect();
        return [rect.left, rect.top];
    }

    private effectCharacter(pid: PlayerId, card_id: CardId): void {
        let effect_view: HtmlViewObject = null;
        if (this.client.player_id === pid) {
            let card_view: HtmlCardView = this.cards_views[pid].getCardView(card_id);
            if (card_view == null) {
                return;  // Something is wrong.
            }
            card_view.hide();
            this.effectClonedObjectMove(card_view, card_view.element_id, "board");
        }
        else {
            this.card_widget_view.draw(this.session, card_id);
            this.effectClonedObjectMove(this.card_widget_view, `player_${pid}`, "board");
        }
    }

    private effectClonedObjectMove(node: HtmlViewObject, id1: string, id2: string): void {
        let new_view: HtmlViewObject = node.clone();
        new_view.showAt(new_view.getPositionAlignedWithElementId(id1));
        new_view.animateMoveToElementId(id2);
        window.setTimeout(() => { new_view.remove(); }, 1500);
    }

    private effectCardDeal(pid: PlayerId, card_id: CardId): void {
        this.card_widget_view.draw(this.session, card_id);
        this.effectClonedObjectMove(this.card_widget_view, `player_${pid}`, `card_${pid}_0`);
    }

    private effectCardDeals(player_id: PlayerId, card_ids: CardId[]): void {
        if (this.client.player_id !== player_id) {
            return;
        }
        let timeout: number = 1000;
        for (let card_id of card_ids) {
            window.setTimeout(() => {
                this.effectCardDeal(player_id, card_id);
            }, timeout);
            timeout += 500;
        }
    }

    private effectMoneyMotion(element_from: string, element_to: string, money: number): void {
        this.money_motion_view.element.innerHTML = `💸 ${money}`;
        this.effectClonedObjectMove(this.money_motion_view, element_from, element_to);
    }
}
