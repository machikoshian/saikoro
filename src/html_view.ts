import { Phase, Session, Event, EventType } from "./session";
import { PlayerCards } from "./card_manager";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility, CharacterType, Character,
         CardData, CardDataId } from "./facility";
import { Dice, DiceResult } from "./dice";
import { Client } from "./client";
import { DeckMaker } from "./deck_maker";
import { GameMode, Protocol, MatchingInfo } from "./protocol";
import { HtmlViewObject, HtmlCardsView, HtmlCardView, HtmlPlayersView,
         HtmlMessageView, HtmlButtonsView,
         HtmlDeckCharView, HtmlBoardView, HtmlDiceView,
         HtmlChatButtonView } from "./html_view_parts";
import * as Query from "./query";

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
    Home,
    Matching,
    Deck,
    Game,
}

class EventQueue {
    private is_running: boolean = false;
    private event_queue: [() => boolean, number][] = [];
    private timer: number;

    public reset(): void {
        this.is_running = false;
        this.event_queue = [];
        window.clearTimeout(this.timer);
        this.timer = null;
    }

    public run(): void {
        if (this.event_queue.length === 0) {
            return;
        }
        if (this.is_running) {
            return;
        }
        this.is_running = true;
        this.processQueue();
    }

    public addEvent(event_function: () => boolean, duration: number): void {
        this.event_queue.push([event_function, duration]);
        if (!this.is_running) {
            this.run();
        }
    }

    private processQueue(): void {
        let item: [() => boolean, number] = this.event_queue.shift();
        if (item == undefined) {
            this.is_running = false;
            return;
        }
        let event_function: () => boolean = item[0];
        let is_success: boolean = event_function();
        let duration: number = is_success ? item[1] : 0;

        this.timer = window.setTimeout(() => {
            this.processQueue();
        }, duration);
    }
}

export class HtmlView {
    private event_queue = new EventQueue();
    private client: Client;
    private session: Session = null;
    private prev_session: Session = null;
    private prev_step: number = -1;
    private clicked_card_view: HtmlCardView = null;
    private deck_maker: DeckMaker = new DeckMaker();
    private deck_char_view: HtmlDeckCharView = null;
    private clicked_field: [number, number] = [-1, -1];
    private cards_views: HtmlCardsView[] = [];
    private players_view: HtmlPlayersView;
    private back_button_view: HtmlViewObject = null;
    private reset_button_view: HtmlViewObject = null;
    private board_view: HtmlBoardView = null;
    private landmarks_view: HtmlCardsView = null;
    private field_card_view: HtmlCardView = null;
    private card_widget_view: HtmlCardView = null;
    private dice_widget_view: HtmlDiceView = null;
    private money_motion_view: HtmlViewObject = null;
    private message_view: HtmlMessageView = null;
    private chat_button_view: HtmlChatButtonView = null;
    private buttons_view: HtmlButtonsView = null;
    private watchers_view: HtmlViewObject = null;
    private scene: Scene = Scene.None;
    private live_session_ids: number[] = [];

    private dice_roll_view: HtmlViewObject = null;  // TODO: try not to use it.

    constructor(client: Client) {
        this.client = client;
        this.reset();
    }

    private reset(): void {
        this.client.reset();
        this.session = null;
        this.prev_session = null;
        this.prev_step = -1;
        this.clicked_field = [-1, -1];

        if (this.dice_roll_view) {
            this.dice_roll_view.remove();
            this.dice_roll_view = null;
        }
        this.event_queue.reset();

        this.client.startCheckLive((response: string) => {
            this.onLiveSessionsUpdated(response);
        });
    }

    public initView(row: number = 5, column: number = 12): void {
        document.getElementById("widgets").style.display = "none";

        const NAMES = ["コロまる", "ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石", "ハルカ"];
        const name_index = Math.floor(Math.random() * NAMES.length);
         (<HTMLInputElement>document.getElementById("matching_name")).value = NAMES[name_index];

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

        document.getElementById("matching_button_watch_1").addEventListener(
            "click", () => { this.onClickWatch(0); });

        document.getElementById("matching_button_watch_2").addEventListener(
            "click", () => { this.onClickWatch(1); });
        document.getElementById("matching_button_watch_3").addEventListener(
            "click", () => { this.onClickWatch(2); });

        this.client.startCheckLive((response: string) => {
            this.onLiveSessionsUpdated(response);
        });

        // Widgets
        this.card_widget_view = new HtmlCardView("card_widget");
        this.dice_widget_view = new HtmlDiceView("dice_widget");

        // Chat
        this.chat_button_view = new HtmlChatButtonView("chat", "stamp_box");
        this.chat_button_view.callback = (index: number) => {
            this.onClickStamp(index);
        };

        // watchers.
        this.watchers_view = new HtmlViewObject(document.getElementById("watchers"));

        // buttons.
        this.back_button_view = new HtmlViewObject(document.getElementById("back"));
        this.back_button_view.addClickListener(() => { this.switchScene(Scene.Home); });

        this.reset_button_view = new HtmlViewObject(document.getElementById("reset"));
        this.reset_button_view.addClickListener(() => { this.onResetGame(); });

        this.buttons_view = new HtmlButtonsView("buttons", this.dice_widget_view);

        this.buttons_view.dice1.addClickListener(() => { this.onClickDice(1, 0); });
        this.buttons_view.dice2.addClickListener(() => { this.onClickDice(2, 0); });
        this.buttons_view.char_card.addClickListener(() => { this.onClickCharacter(); });
        this.buttons_view.end_turn.addClickListener(() => { this.onClickEndTurn(); });

        // Message view.
        this.message_view = new HtmlMessageView("message");

        // HtmlPlayersView
        this.players_view = new HtmlPlayersView("players");

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

        // Money motion
        this.money_motion_view = new HtmlViewObject(document.getElementById("money_motion"));

        this.switchScene(Scene.Home);
    }

    private resetMatchingButtons(): void {
        // Reset states.
        for (let i: number = 1; i <= 3; i++) {
            let element: HTMLElement = document.getElementById(`matching_button_watch_${i}`);
            element.innerText = "準備中";
            element.classList.add("inactive");
        }
        document.getElementById("matching_button_multi_2").classList.remove("promote");
        document.getElementById("matching_button_multi_3").classList.remove("promote");
        document.getElementById("matching_button_multi_3").classList.add("inactive");
        document.getElementById("matching_button_multi_4").classList.remove("promote");
        document.getElementById("matching_button_multi_4").classList.add("inactive");
        document.getElementById("matching_button_watch_1").classList.add("inactive");
    }

    private switchScene(scene: Scene): void {
        if (this.scene === scene) {
            return;
        }

        this.scene = scene;

        // Hide all
        document.getElementById("home").style.display = "none";
        this.resetMatchingButtons();
        this.resetBoard();
        this.back_button_view.none();
        this.players_view.none();
        this.message_view.none();
        this.board_view.none();
        this.deck_char_view.none();
        this.chat_button_view.none();
        this.watchers_view.none();
        this.buttons_view.none();
        this.landmarks_view.none();
        this.reset_button_view.none();

        for (let cards_view of this.cards_views) {
            cards_view.none();
        }
        this.field_card_view.none();

        if (scene === Scene.Home) {
            document.getElementById("home").style.display = "";

            this.client.startCheckLive((response: string) => {
                this.onLiveSessionsUpdated(response);
            });
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

        if (scene === Scene.Matching) {
            this.message_view.show();
            this.reset_button_view.show();
        }

        if (scene === Scene.Game) {
            // Show components for game.
            this.message_view.show();
            this.board_view.show();
            this.board_view.redraw();
            if (this.session != null) {
                this.drawSession(this.session);
            }
            this.landmarks_view.show();
            if (Protocol.getPlayerCount(this.client.mode) < 2) {
                this.reset_button_view.show();
            }
            // this.chat_button_view.hide();
            this.chat_button_view.show();
            return;
        }
    }

    private onResetGame(): void {
        this.client.sendRequest(this.client.createQuitQuery());
        this.reset();
        this.switchScene(Scene.Home);
    }

    private onClickPlayer(target_player_id: PlayerId): void {
        if (this.session.getPhase() !== Phase.FacilityActionWithInteraction) {
            return;
        }
        const target_facilities: CardId[] = this.session.getTargetFacilities();
        if (target_facilities.length === 0) {
            return;
        }
        const card_id: CardId = target_facilities[0];
        this.client.sendRequest(this.client.createInteractQuery(card_id, target_player_id));
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
        if (this.scene === Scene.Home || this.scene === Scene.Matching) {
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

        this.client.sendRequest(this.client.createBuildQuery(x, y, card_id));

        this.event_queue.addEvent(() => {
            this.buttons_view.hide();  // for the turn end button.
            this.effectClonedObjectMove(this.clicked_card_view,
                                        this.clicked_card_view.element_id, `field_${x}_${y}`);
            return true;
        }, 1000);
    }

    private showStamp(stamp_id: number, player_id: number): void {
        let element_id: string = "watchers";
        if (player_id !== -1) {
            element_id = this.players_view.players[player_id].element.id;
        }
        this.chat_button_view.showStampAt(stamp_id, element_id);
    }

    private onClickStamp(index: number): void {
        this.showStamp(index, this.client.player_id);
        this.client.sendRequest(this.client.createChatQuery(index));
    }

    public updateChat(chat: Query.ChatQuery): void {
        if (chat.user_id === this.client.user_id) {
            return;
        }

        const player_id: number = this.session.getPlayerId(chat.user_id);
        this.showStamp(chat.stamp_id, player_id);
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

        this.client.sendRequest(this.client.createDiceQuery(dice_num, aim));

        this.event_queue.addEvent(() => {
            console.log("dice roll.");
            let dice_view: HtmlViewObject =
                (dice_num === 1) ? this.buttons_view.dice1 : this.buttons_view.dice2;
            dice_view.hide();
            this.buttons_view.hide();

            // TODO: Make prependDuration to check the response from the server.
            this.effectDiceMove(dice_view, "board");
            return true;
        }, 1000);
    }

    private onClickCharacter(): void {
        if (this.clicked_card_view == null) {
            return;
        }

        const card_id: CardId = this.clicked_card_view.getCardId();
        const character: Character = this.session.getCharacter(card_id);
        if (character.type === CharacterType.MoveMoney) {
            this.dialogSelectPlayer((selected_pid: PlayerId) => {
                this.client.sendRequest(this.client.createCharacterQuery(card_id, selected_pid));

                this.event_queue.addEvent(() => {
                    this.effectCharacter(this.client.player_id, card_id);
                    return true;
                }, 2000);
            });
        }
        else {
            this.client.sendRequest(this.client.createCharacterQuery(card_id));

            this.event_queue.addEvent(() => {
                this.effectCharacter(this.client.player_id, card_id);
                return true;
            }, 2000);
        }
    }

    private onClickEndTurn(): void {
        this.client.sendRequest(this.client.createEndTurnQuery());
        this.event_queue.addEvent(() => {
            this.buttons_view.hide();
            return true;
        }, 500);
    }

    private onClickMatching(mode: GameMode): void {
        let name: string = (<HTMLInputElement>document.getElementById("matching_name")).value;
        if (name.length === 0) {
            return;
        }
        let deck: string = (<HTMLInputElement>document.getElementById("deck")).value;

        this.client.matching(this.client.createMatchingQuery(name, mode, deck));
        let message: string;
        if (Protocol.isOnlineMode(mode)) {
            if (Protocol.getPlayerCount(mode) > 1) {
                message = "対戦相手を待っています";
            }
            else {
                message = "通信中です";
            }
        }
        else {
            message = "準備中です";
        }
        this.message_view.drawMessage(message, this.getPlayerColor(this.client.player_id));
        this.switchScene(Scene.Matching);
    }

    private onLiveSessionsUpdated(response: string): void {
        this.resetMatchingButtons();
        // Reset states.
        for (let i: number = 1; i <= 3; i++) {
            let element: HTMLElement = document.getElementById(`matching_button_watch_${i}`);
            element.innerText = "準備中";
            element.classList.add("inactive");
        }
        document.getElementById("matching_button_multi_2").classList.remove("promote");

        // TODO: session_info should be a class instance.
        const live_dict: {[key: string]: MatchingInfo} = JSON.parse(response);

        const keys: string[] = Object.keys(live_dict);

        // Update states.
        let index: number = 1;
        this.live_session_ids = [];
        for (let key of keys) {
            const matching_info: MatchingInfo = live_dict[key];
            if (matching_info.is_matched) {
                if (index > 3) {
                    continue;
                }
                this.live_session_ids.push(matching_info.session_id);
                let element: HTMLElement = document.getElementById(`matching_button_watch_${index}`);
                element.innerText = Protocol.getGameModeName(matching_info.mode);
                element.classList.remove("inactive");
                index++;
            }
            else if (matching_info.mode === GameMode.OnLine2Players) {
                document.getElementById("matching_button_multi_2").classList.add("promote");
            }
        }
    }

    private onClickWatch(index: number): void {
        if (index >= this.live_session_ids.length) {
            return;
        }
        this.switchScene(Scene.Matching);
        this.message_view.drawMessage("通信中です", this.getPlayerColor(this.client.player_id));
        this.client.watchGame(this.live_session_ids[index]);
    }

    private onClickCard(player: number, card: number): void {
        // Event on matching.
        if (this.scene === Scene.Home || this.scene === Scene.Matching) {
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
        if (this.scene === Scene.Matching) {
            this.session = session;
            this.prev_step = session.getStep() - 1;
            this.prev_session = session;
            this.switchScene(Scene.Game);
            return;
        }

        if (this.scene !== Scene.Game) {
            return;
        }
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

    private resetBoard(): void {
        // TODO: Do more efficient way.
        this.drawBoard(new Session(-1));
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

        if (session.getCurrentPlayerId() === this.client.player_id &&
            session.getPhase() === Phase.FacilityActionWithInteraction &&
            session.getTargetFacilities().length > 0) {
            const facility_id: CardId = session.getTargetFacilities()[0];
            const [x, y]: [number, number] = session.getPosition(facility_id);
            this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
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

    private drawWatchers(session: Session): void {
        const watchers_length: number = session.getWatchers().length;
        if (watchers_length === 0) {
            this.watchers_view.hide();
            return;
        }
        this.watchers_view.element.innerText = `${watchers_length}人観戦中`;
        this.watchers_view.show();
    }

    private drawSession(session: Session): void {
        this.drawStatusMessage(session);
        this.players_view.draw(session);
        this.drawBoard(session);
        this.drawCards(session);
        this.drawWatchers(session);
        // Update buttons.
        this.buttons_view.draw(session, this.client.player_id);

        this.prev_session = session;
    }

    public drawEvents(): void {
        this.event_queue.addEvent(() => {
            if (!this.drawEventsByStep()) {
                this.drawSession(this.session);
                return false;
            }
            this.drawEvents();
            return true;
        }, 2000);
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
            if (this.dice_roll_view) {
                let dices = this.dice_roll_view.element.getElementsByClassName("dice");
                for (let i: number = 0; i < dices.length; ++i) {
                    let pip: number = (i === 0) ? event.dice.dice1 : event.dice.dice2;
                    let dice: HTMLElement = <HTMLElement>dices[i];
                    dice.addEventListener("animationiteration", () => {
                        dice.style.animation = `roll_end${pip} ${0.8 + i / 10}s ease-out forwards`;
                    });
                }
                window.setTimeout(() => {
                    this.dice_roll_view.remove();
                    this.dice_roll_view = null;
                }, 2000);
            }

            let message: string = this.getDiceResultMessage(event.dice, event.player_id);
            let color: string = this.getPlayerColor(event.player_id);
            window.setTimeout(() => {
                this.board_view.animateDiceResult(event.dice.result(), color);
                this.message_view.drawMessage(message, color);
            }, 1500);
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
            const type: CharacterType = this.session.getCharacter(event.card_id).type;
            if (type === CharacterType.DrawCards) {
                this.effectCardDeals(event.player_id, event.target_card_ids);
                handled = true;
            }
            if (type === CharacterType.MoveMoney) {
                for (let pid = 0; pid < event.moneys.length; pid++) {
                    const money: number = event.moneys[pid];
                    if (money === 0) {
                        continue;
                    }
                    const delay: number = (money > 0) ? 1500 : 500;
                    window.setTimeout(() => {
                        this.drawMoneyMotion(money, pid, 5, 0);
                    }, delay);
                }
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
                this.players_view.players[pid].addMoney(money);
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
                    this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
                    window.setTimeout(() => {
                        this.board_view.setHighlight([x, y], "transparent");
                    }, 1000);
                }, delay);
            }
        }

        if (event.type === EventType.Interaction) {
            const position: [number, number] = this.session.getPosition(event.card_id);
            this.board_view.setHighlight(position, COLOR_CLICKABLE);

            if (event.player_id === this.client.player_id) {
                this.dialogSelectPlayer((selected_pid: PlayerId) => {
                    this.client.sendRequest(this.client.createInteractQuery(event.card_id, selected_pid));
                });
            }
            else {
                const color: string = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage("対象プレイヤーを選択中です", color);
            }
        }
        return true;
    }

    private dialogSelectPlayer(callback): void {
        const color: string = this.getPlayerColor(this.client.player_id);
        this.message_view.drawMessage("対象プレイヤーを選択してください", color);
        this.players_view.setClickableForPlayer(this.client.player_id, callback);
    }

    private drawMoneyMotion(money: number, player_id: PlayerId, x: number, y: number): void {
        if (money > 0) {
            this.effectMoneyMotion(`field_${x}_${y}`, `player_${player_id}`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}`, `field_${x}_${y}`, money);
        }
        this.players_view.players[player_id].addMoney(money);
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

    private effectDiceMove(node: HtmlViewObject, dest_id: string): void {
        let dice_view: HtmlViewObject = node.clone();
        dice_view.element.style.background = "transparent";
        dice_view.showAt(dice_view.getPositionAlignedWithElementId(node.element.id));
        let dices = dice_view.element.getElementsByClassName("dice");
        for (let i: number = 0; i < dices.length; ++i) {
            (<HTMLElement>dices[i]).style.animation = `roll ${0.8 + i / 10 }s linear infinite`;
        }
        dice_view.animateMoveToElementId(dest_id, 1000);
        this.dice_roll_view = dice_view;
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
