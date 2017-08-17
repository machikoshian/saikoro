import { Phase, Session, Event, EventType } from "./session";
import { PlayerCards } from "./card_manager";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility, CharacterType, Character,
         CardData, CardDataId, SelectType } from "./facility";
import { Dice, DiceResult } from "./dice";
import { Client } from "./client";
import { DeckMaker } from "./deck_maker";
import { GameMode, Protocol, MatchingInfo } from "./protocol";
import { PlayerIdCallback, HtmlViewObject, HtmlHomeNameView,
         HtmlCardsView, HtmlCardView, HtmlPlayersView,
         HtmlMessageView, HtmlButtonsView, HtmlCardWidgetView,
         HtmlDeckCharView, HtmlBoardView, HtmlDiceView,
         HtmlChatButtonView, HtmlDeckCardsView } from "./html_view_parts";
import { DiceEffects, DiceNum, DiceEvenOdd } from "./types";
import { AutoPlay } from "./auto_play";
import * as Query from "./query";

const COLOR_FIELD: string = "#FFF8E1";
const COLOR_LANDMARK: string = "#B0BEC5";
const COLOR_CLICKABLE: string = "#FFCA28";
const COLOR_HIGHTLIGHT_CARD: string = "#FFE082";
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
    List,
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
    private clicked_card_id: CardId = -1;
    private deck_maker: DeckMaker = null;
    private deck_char_view: HtmlDeckCharView = null;
    private deck_cards_view: HtmlDeckCardsView = null;
    private list_cards_view: HtmlDeckCardsView = null;
    private clicked_field: [number, number] = [-1, -1];
    private home_name_view: HtmlHomeNameView = null;
    private cards_view: HtmlCardsView = null;
    private players_view: HtmlPlayersView;
    private back_button_view: HtmlViewObject = null;
    private reset_button_view: HtmlViewObject = null;
    private board_view: HtmlBoardView = null;
    private landmarks_view: HtmlCardsView = null;
    private field_card_view: HtmlCardWidgetView = null;
    private card_widget_view: HtmlCardWidgetView = null;
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
        this.resetGame();
        this.client.startCheckLive((response: string) => {
            this.onLiveSessionsUpdated(response);
        });
    }

    private resetGame(): void {
        this.session = null;
        this.prev_session = null;
        this.prev_step = -1;
        this.clicked_field = [-1, -1];

        if (this.dice_roll_view) {
            this.dice_roll_view.remove();
            this.dice_roll_view = null;
        }
        this.event_queue.reset();
    }

    private resetViews(): void {
        this.players_view.reset();
        this.buttons_view.reset();
        this.cards_view.reset();
        this.landmarks_view.reset();
        this.chat_button_view.reset();
    }

    public readyGame(): void {
        this.resetGame();
        this.switchScene(Scene.Matching);
    }

    public initView(row: number = 5, column: number = 12): void {
        document.getElementById("widgets").style.display = "none";

        // Add click listeners.
        // Matching.
        document.getElementById("matching_button_deck").addEventListener(
            "click", () => { this.switchScene(Scene.Deck); });
        document.getElementById("home_list").addEventListener(
            "click", () => { this.switchScene(Scene.List); });

        document.getElementById("matching_button_offline_2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_2); });
        document.getElementById("matching_button_offline_2vs2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_2vs2); });
        document.getElementById("matching_button_offline_4").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_4); });

        document.getElementById("matching_button_online_2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle_2); });
        document.getElementById("matching_button_online_2vs2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle_2vs2); });
        document.getElementById("matching_button_online_4").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLineSingle_4); });

        document.getElementById("matching_button_multi_2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLine2Players); });
        document.getElementById("matching_button_multi_2vs2").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OnLine2Players_2vs2); });
        // 4 players are not supported yet.
        // document.getElementById("matching_button_multi_4").addEventListener(
        //     "click", () => { this.onClickMatching(GameMode.OnLine2Players); });

        document.getElementById("matching_button_watch_1").addEventListener(
            "click", () => { this.onClickWatch(0); });

        document.getElementById("matching_button_watch_2").addEventListener(
            "click", () => { this.onClickWatch(1); });
        document.getElementById("matching_button_watch_3").addEventListener(
            "click", () => { this.onClickWatch(2); });

        document.getElementById("matching_button_offline_2_matching").addEventListener(
            "click", () => { this.onClickMatching(GameMode.OffLine_2_Matching); });

        this.client.startCheckLive((response: string) => {
            this.onLiveSessionsUpdated(response);
        });

        // Home
        this.home_name_view = new HtmlHomeNameView("home_name");

        // Widgets
        this.card_widget_view = new HtmlCardWidgetView("card_widget");
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
        this.buttons_view.char_card.callback = (is_open: boolean) => {
            this.onClickCharCardButton(is_open);
        };
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
        this.deck_cards_view = new HtmlDeckCardsView("deck_cards");
        this.deck_cards_view.callback = (data_id) => { this.onClickDeckCard(data_id); };

        // List
        this.list_cards_view = new HtmlDeckCardsView("list_cards");

        // HtmlCardsView
        this.cards_view = new HtmlCardsView("card_0");

        // Landmark cards
        this.landmarks_view = new HtmlCardsView("landmark");

        // Field card
        this.field_card_view = new HtmlCardWidgetView("field_card");

        // Money motion
        this.money_motion_view = new HtmlViewObject(document.getElementById("money_motion"));

        // Deck maker
        this.deck_maker = new DeckMaker();
        this.deck_maker.load();

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
        document.getElementById("matching").style.display = "none";
        this.resetMatchingButtons();
        this.resetBoard();
        this.back_button_view.none();
        this.players_view.none();
        this.message_view.none();
        this.board_view.none();
        this.deck_char_view.none();
        this.deck_cards_view.none();
        this.list_cards_view.none();
        this.chat_button_view.none();
        this.watchers_view.none();
        this.buttons_view.none();
        this.landmarks_view.none();
        this.reset_button_view.none();

        document.body.classList.remove("evening");

        this.cards_view.none();
        this.field_card_view.none();
        this.resetViews();

        if (scene === Scene.Home) {
            document.getElementById("home").style.display = "";

            this.client.startCheckLive((response: string) => {
                this.onLiveSessionsUpdated(response);
            });
            return;
        }

        if (scene === Scene.Deck) {
            this.back_button_view.show();
            this.board_view.show();
            this.deck_char_view.show();

            this.drawDeckBoard();
            this.deck_cards_view.show();
            return;
        }

        if (scene === Scene.List) {
            this.back_button_view.show();
            this.list_cards_view.show();
            let data_ids: CardDataId[] = [];
            Array.prototype.push.apply(data_ids, CardData.getAvailableCharacters());
            Array.prototype.push.apply(data_ids, CardData.getAvailableFacilities(0));
            Array.prototype.push.apply(data_ids, CardData.getAvailableLandmarks());
            this.list_cards_view.draw(data_ids);
            return;
        }

        if (scene === Scene.Matching) {
            document.getElementById("matching").style.display = "";
            this.drawMatchingMessage(this.client.mode);
            this.message_view.show();
            this.reset_button_view.show();
        }

        if (scene === Scene.Game) {
            if (this.client.mode === GameMode.OffLine_2_Matching) {
                document.body.classList.add("evening");
            }
            // Show components for game.
            this.message_view.show();
            this.board_view.show();
            this.board_view.clearEffects();
            if (this.session != null) {
                this.drawSession(this.session);
            }
            this.landmarks_view.show();
            if (Protocol.getPlayerCount(this.client.mode) < 2) {
                this.reset_button_view.show();
            }
            this.chat_button_view.show();
            return;
        }
    }

    private onResetGame(): void {
        const mode: GameMode = this.client.mode;
        this.client.quit();
        this.reset();
        if (mode === GameMode.OffLine_2_Matching) {
            this.switchScene(Scene.Matching);
            return;
        }
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

        if (y === -1) {
            this.deck_char_view.setHighlight(x, true);
            let data_ids: CardDataId[] = CardData.getAvailableCharacters();
            this.deck_cards_view.draw(data_ids);
        }
        else {
            this.board_view.setClickable(this.clicked_field, true);
            let data_ids: CardDataId[] = this.deck_maker.getAvailableFacilities(x);
            this.deck_cards_view.draw(data_ids);
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
        if (this.clicked_card_id === -1) {
            this.drawFieldInfo(x, y);
            return;
        }
        const query: Query.BuildQuery = this.client.createBuildQuery(x, y, this.clicked_card_id);
        const event: Event = this.session.getEventBuildCommand(query);
        if (event == null || !event.valid) {
            return;
        }

        this.client.sendRequest(query);

        this.event_queue.addEvent(() => {
            this.buttons_view.hide();  // for the turn end button.
            const field: string = `click_${x}_${y}`;
            if (this.session.isLandmark(this.clicked_card_id)) {
                this.landmarks_view.useCard(this.clicked_card_id, field);
            }
            else {
                this.cards_view.useCard(this.clicked_card_id, field);
            }
            this.resetCardsClickable();
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

        // Reset character cards.
        this.cards_view.resetClickable();

        this.client.sendRequest(this.client.createDiceQuery(dice_num, aim));

        this.event_queue.addEvent(() => {
            let dice_view: HtmlViewObject =
                (dice_num === 1) ? this.buttons_view.dice1 : this.buttons_view.dice2;
            dice_view.hide();
            this.buttons_view.hide();

            // TODO: Make prependDuration to check the response from the server.
            this.effectDiceMove(dice_view, "board");
            return true;
        }, 1000);
    }

    private onClickCharCardButton(is_open: boolean): void {
        if (is_open) {
            this.buttons_view.hideDices();
        }
        else {
            this.buttons_view.showDices();
        }

        this.dialogSelectCharCard(is_open, (card_id: CardId) => {
            this.processCharCard(card_id);
        });
    }

    private processFacilityCard(card_id: CardId): void {
        this.clicked_card_id = card_id;
        const facility: Facility = this.session.getFacility(card_id);
        if (facility.type === FacilityType.Gray) {
            this.processLandmark(card_id);
            return;
        }

        this.drawBoard(this.session);

        if (this.session.getPhase() === Phase.BuildFacility) {
            for (let area of facility.getArea()) {
                let x: number = area - 1;
                for (let y: number = 0; y < 5; ++y) {  // TODO: y can be other than 5.
                    const query: Query.BuildQuery = this.client.createBuildQuery(x, y, card_id);
                    const event: Event = this.session.getEventBuildCommand(query);
                    if (event && event.valid) {
                        this.board_view.setClickable([x, y], true);
                        this.board_view.showCost([x, y], event.moneys[this.client.player_id]);
                    }
                }
            }
        }
    }

    private processLandmark(card_id: CardId): void {
        if (this.session.getPhase() !== Phase.BuildFacility) {
            return;
        }
        if (this.session.getOwnerId(card_id) !== -1) {
            return;
        }

        this.drawBoard(this.session);
        this.board_view.setClickable(this.session.getPosition(card_id), true);
    }

    private processCharCard(card_id: CardId): void {
        const character: Character = this.session.getCharacter(card_id);
        if (character.type === CharacterType.MoveMoney) {
            this.event_queue.addEvent(() => {
                // TODO: Hide the card after its event.
                this.effectCharacter(this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectPlayer((selected_pid: PlayerId) => {
                this.client.sendRequest(this.client.createCharacterQuery(card_id, selected_pid));
            });
        }
        else if (character.type === CharacterType.Close &&
                 character.property["type"] === SelectType.Facility) {
            this.event_queue.addEvent(() => {
                this.effectCharacter(this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectFacilityPosition(([x, y]) => {
                const target_card_id: CardId = this.session.getCardIdOnBoard(x, y);
                this.client.sendRequest(
                    this.client.createCharacterWithCardIdQuery(card_id, target_card_id));
            });
        }
        else if (character.type === CharacterType.Boost &&
                 character.property["type"] === SelectType.Facility) {
            this.event_queue.addEvent(() => {
                this.effectCharacter(this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectFacilityPosition(([x, y]) => {
                const target_card_id: CardId = this.session.getCardIdOnBoard(x, y);
                this.client.sendRequest(
                    this.client.createCharacterWithCardIdQuery(card_id, target_card_id));
            });
        }
        else if (character.type === CharacterType.Boost &&
                 character.property["boost"] < 0) {
            this.event_queue.addEvent(() => {
                this.effectCharacter(this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectPlayer((player_id: PlayerId) => {
                this.client.sendRequest(this.client.createCharacterQuery(card_id, player_id));
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
            this.drawBoard(this.session);
            this.resetCardsClickable();
            this.buttons_view.hide();
            return true;
        }, 500);
    }

    private onClickMatching(mode: GameMode): void {
        const name: string = this.home_name_view.checkName();
        if (name.length === 0) {
            return;
        }
        const deck: string = (<HTMLInputElement>document.getElementById("deck")).value;

        this.client.matching(this.client.createMatchingQuery(name, mode, deck));
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
        document.getElementById("matching_button_multi_2vs2").classList.remove("promote");

        if (response == null) {
            return;
        }

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
            else if (matching_info.mode === GameMode.OnLine2Players_2vs2) {
                document.getElementById("matching_button_multi_2vs2").classList.add("promote");
            }
        }
    }

    private onClickWatch(index: number): void {
        if (index >= this.live_session_ids.length) {
            return;
        }
        this.switchScene(Scene.Matching);
        this.message_view.drawMessage("通信中です", this.client.player_id);
        this.client.watchGame(this.live_session_ids[index]);
    }

    private onClickDeckCard(data_id: CardDataId): void {
        // Event on matching.
        if (this.scene !== Scene.Deck) {
            return;
        }

        let [x, y]: [number, number] = this.clicked_field;
        if (x === -1) {
            // this.clicked_field was not used. Do nothing.
        }
        else if (y === -1) {
            // Char
            this.deck_maker.setCharacter(x, data_id);
        }
        else {
            this.deck_maker.setFacility(x, y, data_id);
        }
        this.drawDeckBoard();
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

    private getDiceEffectsMessage(effects: DiceEffects): string {
        let messages: string[] = [];
        if (effects.num !== DiceNum.Any) {
            messages.push(`${effects.num}個限定`);
        }

        if (effects.delta !== 0) {
            const unit: string = (effects.delta > 0) ? "+" : "";
            messages.push(`${unit}${effects.delta}`);
        }

        if (effects.even_odd !== DiceEvenOdd.Any) {
            messages.push((effects.even_odd === DiceEvenOdd.Even) ? "偶数のみ" : "奇数のみ");
        }

        if (messages.length === 0) {
            return "";
        }
        return `(${messages.join(" ")})`;
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

    private resetCardsClickable(): void {
        this.clicked_card_id = -1;
        this.cards_view.resetClickable();
        this.landmarks_view.resetClickable();
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

    public announce(announce: string): void {
        this.message_view.drawMessage(announce);
    }

    private drawMatchingMessage(mode: GameMode): void {
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
        this.message_view.drawMessage(message, this.client.player_id);
    }

    public drawCards(session: Session): void {
        const players: Player[] = session.getPlayers();
        const landmark_ids: CardId[] = session.getLandmarks();

        // Promote landmark cards if landmark is affordable.
        const money: number = session.getCurrentPlayer().getMoney();
        const landmark_cost: number = session.getFacility(landmark_ids[0]).getCost();
        if (session.getPhase() === Phase.BuildFacility &&
            session.getCurrentPlayerId() === this.client.player_id &&
            money >= landmark_cost) {
            this.cards_view.y_offset = 150;
            this.landmarks_view.y_offset = -150;
        }
        else {
            this.cards_view.y_offset = 0;
            this.landmarks_view.y_offset = 0;
        }

        // Update cards.
        if (this.client.player_id !== -1) {
            const card_ids: CardId[] = session.getSortedHand(this.client.player_id);
            this.cards_view.draw(session, card_ids);
        }

        // Update landmarks.
        this.landmarks_view.show();
        this.landmarks_view.draw(session, landmark_ids);

        this.resetCardsClickable();  // Nice to check if built or not?
    }

    public drawFieldInfo(x, y): void {
        const card_id: CardId = this.session.getCardIdOnBoard(x, y);
        if (card_id === -1) {
            this.field_card_view.setDataId(-1);
            this.field_card_view.none();
            return;
        }

        const data_id: CardDataId = this.session.getCardDataId(card_id);
        if (data_id === -1 || data_id === this.field_card_view.getDataId()) {
            this.field_card_view.setDataId(-1);
            this.field_card_view.none();
            return;
        }

        this.field_card_view.setDataId(data_id);
        this.field_card_view.showAt(this.getPosition((x < 6) ? "click_10_1" : "click_0_1"));
    }

    private resetBoard(): void {
        // TODO: Do more efficient way.
        this.drawBoard(new Session(-1, -1));  // SessionId = -1, GameMode = -1
    }

    public drawBoard(session: Session): void {  // session may take a different value.
        this.board_view.clearEffects();
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

        this.drawFacilityValues(session, this.client.player_id);

        if (session.getCurrentPlayerId() === this.client.player_id &&
            session.getPhase() === Phase.FacilityActionWithInteraction &&
            session.getTargetFacilities().length > 0) {
            const facility_id: CardId = session.getTargetFacilities()[0];
            const [x, y]: [number, number] = session.getPosition(facility_id);
            this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
        }

    }

    public drawFacilityValues(session: Session, player_id: PlayerId): void {
        if (player_id === -1) {
            player_id = session.getCurrentPlayerId();
        }

        this.board_view.clearEffects();
        const board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                const card_id: CardId = board.getRawCardId(x, y);
                if (card_id < 0) {
                    continue;
                }
                let event: Event = session.getEventFacilityAction(player_id, card_id);
                if (event.type === EventType.Interaction) {
                    // TODO: Should be able to select other players.
                    const target_id: PlayerId = AutoPlay.getTargetPlayer(session, player_id);
                    event = session.getEventInteractCommand(
                        this.client.createInteractQuery(event.card_id, target_id));
                }
                const money: number = event.moneys[player_id];
                if (money !== 0) {
                    this.board_view.showCost([x, y], money);
                }
            }
        }
    }

    public drawDeckBoard(): void {
        this.board_view.clearEffects();
        const board: Board = this.deck_maker.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                const facility_id: CardId = board.getRawCardId(x, y);
                const owner_id: PlayerId = 0;
                const facility: Facility =
                    (facility_id < 0) ? null : this.deck_maker.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
        for (let x: number = 0; x < 5; ++x) {
            this.deck_char_view.drawCharacter(x, this.deck_maker.getCharacter(x));
        }

        const [x, y]: [number, number] = this.clicked_field;
        if (y !== -1) {
            this.board_view.setClickable(this.clicked_field, true);
        }
        document.getElementById("deck").innerText = JSON.stringify(this.deck_maker.getDeck());
        this.deck_maker.save();
    }

    private drawField(x: number, y: number,
                      facility_id: CardId, facility: Facility, owner_id: PlayerId): void {
        let field: HTMLElement = document.getElementById(`field_${x}_${y}`);

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

        field.innerText = facility.getName();
        if (!facility.is_open) {
            field.innerText += "💤";
        }
        field.style.display = "";
        field.style.borderColor = this.getFacilityColor(facility);

        field.style.backgroundColor = null;
        // (ownder_id === -1) means a prebuild landmark.
        field.classList.toggle("landmark", (owner_id === -1));
        for (let i: number = 0; i < 4; ++i) {
            field.classList.toggle(`player_${i}`, (owner_id === i));
        }

        (<HTMLTableCellElement>field).colSpan = facility.size;
    }

    public drawStatusMessage(session: Session): boolean {  // TODO: rename it.
        let players: Player[] = session.getPlayers();
        let player_id: PlayerId = session.getCurrentPlayerId();

        // Update message.
        let current_player: Player = players[player_id];
        let name: string =  current_player.name;
        let phase: Phase = session.getPhase();
        let message: string = "";
        if (phase === Phase.StartGame) {
            message = "マッチング中です";
            this.message_view.drawMessage(message, player_id);
            return true;
        }
        if (phase === Phase.CharacterCard) {
            const effects: string = this.getDiceEffectsMessage(session.getDiceEffects());
            message = `${name} のキャラカードまたはサイコロ${effects}です`;
            this.message_view.drawMessage(message, player_id);
            return true;
        }
        if (phase === Phase.DiceRoll) {
            const effects: string = this.getDiceEffectsMessage(session.getDiceEffects());
            message = `${name} のサイコロ${effects}です`;
            this.message_view.drawMessage(message, player_id);
            return true;
        }
        if (phase === Phase.BuildFacility) {
            message = `${name} の建設です`;
            this.message_view.drawMessage(message, player_id);
            return true;
        }
        if (phase === Phase.EndGame) {
            let events: Event[] = session.getEvents();
            for (let event of events) {
                if (event.type === EventType.Quit) {
                    message = `${players[event.player_id].name} が切断しました`;
                    this.message_view.drawMessage(message, event.player_id);
                    return true;
                }
            }

            let winner: string = session.getPlayer(session.getWinner()).name;
            message = `${name} の勝ちです`;
            this.message_view.drawMessage(message, session.getWinner());
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
        this.drawWatchers(session);
        // Update buttons.
        this.buttons_view.draw(session, this.client.player_id);
        this.drawCards(session);

        if (session.getPhase() === Phase.BuildFacility &&
            session.getCurrentPlayerId() === this.client.player_id) {
            this.dialogSelectFacilityCard((card_id: CardId) => {
                this.processFacilityCard(card_id);
            });
        }

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
            let current_player: Player = this.prev_session.getPlayer(event.player_id);
            let message = `${current_player.name} のターンです`;
            this.message_view.drawMessage(message, event.player_id);
            this.drawFacilityValues(this.prev_session, event.player_id);
            this.effectCardDeals(event.player_id, event.target_card_ids);

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
            window.setTimeout(() => {
                this.board_view.animateDiceResult(event.dice.result(), event.player_id);
                this.message_view.drawMessage(message, event.player_id);
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
                const message: string = `山札から${event.target_card_ids.length}枚カードを引きました。`;
                this.message_view.drawMessage(message, event.player_id);
                this.effectCardDeals(event.player_id, event.target_card_ids);
                handled = true;
            }
            if (type === CharacterType.DiceEven) {
                this.message_view.drawMessage("次のサイコロの合計値が偶数になります", event.player_id);
                handled = true;
            }
            if (type === CharacterType.DiceOdd) {
                this.message_view.drawMessage("次のサイコロの合計値が奇数になります", event.player_id);
                handled = true;
            }
            if (type === CharacterType.SalaryFactor) {
                this.message_view.drawMessage("給料の金額が変わりました");
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
                        this.drawMoneyMotion(money, pid, "message");
                    }, delay);
                }
                handled = true;
            }
            this.prev_session.processEventCharacterCommand(event);
            this.drawBoard(this.prev_session);  // for open and close
            return handled;
        }

        if (event.type === EventType.Salary) {
            this.prev_session.processEventPaySalary(event);
            const player_id: PlayerId = event.player_id;
            const money: number = event.moneys[event.player_id];

            this.players_view.players[player_id].addMoney(money);
            const name: string = this.session.getPlayer(player_id).name;
            const message = `${name} に給料 ${money} が入りました`;
            this.message_view.drawMessage(message, player_id);
            return true;
        }

        if (event.type === EventType.Open) {
            const [x, y]: [number, number] = this.prev_session.getPosition(event.card_id);
            let facility: Facility = this.prev_session.getFacility(event.card_id);
            facility.is_open = true;
            const owner_id: PlayerId = this.prev_session.getOwnerId(event.card_id);
            this.drawField(x, y, event.card_id, facility, owner_id);
        }

        if (event.type === EventType.Build) {
            if (event.card_id === -1) {  // Pass.
                let name: string = this.prev_session.getPlayer(event.player_id).name;
                let message = `${name} は何も建設しませんでした。`;
                this.message_view.drawMessage(message, event.player_id);
                this.drawCards(this.prev_session);
                return true;
            }

            // Money motion
            this.drawEventOfMoneyMotion(this.prev_session, event);
            this.prev_session.processEventBuild(event);

            // Draw the board after money motion.
            window.setTimeout(() => {
                this.players_view.draw(this.prev_session);
                this.drawCards(this.prev_session);
                this.drawBoard(this.prev_session);
            }, 1000);
        }

        const money_motion: EventType[] = [
            EventType.Blue,
            EventType.Green,
            EventType.Red,
            EventType.Purple,
        ];
        if (money_motion.indexOf(event.type) !== -1) {
            // Money motion
            this.drawEventOfMoneyMotion(this.prev_session, event);
            this.prev_session.processEventFacilityAction(event);

            // For open and close.
            if (event.close) {
                const facility: Facility = this.prev_session.getFacility(event.card_id);
                const [x, y]: [number, number] = this.prev_session.getPosition(event.card_id);
                const owner_id: PlayerId = this.prev_session.getOwnerId(event.card_id);
                let delay: number = 1000;
                if ([EventType.Red, EventType.Purple].indexOf(event.type) !== -1) {
                    delay += 1000;
                }
                window.setTimeout(() => {
                    this.drawField(x, y, event.card_id, facility, owner_id);
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
                this.message_view.drawMessage("対象プレイヤーを選択中です", event.player_id);
            }
        }
        return true;
    }

    private drawEventOfMoneyMotion(session: Session, event: Event): void {
        const [x, y]: [number, number] =
            (event.position != null) ? event.position : session.getPosition(event.card_id);
        const element_id: string =
            (event.type === EventType.Build) ? `click_${x}_${y}` : `field_${x}_${y}`;

        // If event.moneys has both positive and negative values,
        // motions for positive values are delayed.
        let delay_value: number = 0;
        for (let pid = 0; pid < event.moneys.length; pid++) {
            if (event.moneys[pid] < 0) {
                delay_value = 1000;
                break;
            }
        }
        for (let pid = 0; pid < event.moneys.length; pid++) {
            const money: number = event.moneys[pid];
            if (money === 0) {
                continue;
            }
            let delay: number = (money > 0) ? 1000 : 0;
            window.setTimeout(() => {
                this.drawMoneyMotion(money, pid, element_id);
                this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
                window.setTimeout(() => {
                    this.board_view.setHighlight([x, y], "transparent");
                }, 1000);
            }, delay);
        }
    }

    private dialogSelectFacilityPosition(callback: ([x, y]: [number, number]) => void): void {
        this.message_view.drawMessage("対象施設を選択してください", this.client.player_id);
        this.board_view.setFacilitiesClickable(this.session, callback);
    }

    private dialogSelectPlayer(callback: PlayerIdCallback): void {
        this.message_view.drawMessage("対象プレイヤーを選択してください", this.client.player_id);
        this.players_view.setClickableForPlayer(this.client.player_id, callback);
    }

    private dialogSelectCharCard(is_open: boolean, callback: (card_id: CardId) => void): void {
        if (is_open) {
            this.message_view.drawMessage("キャラカードを選択してください", this.client.player_id);
            this.cards_view.setCharCardsClickable((card_id: CardId) => {
                this.cards_view.useCard(card_id, "board");
                callback(card_id);
                this.cards_view.resetClickable();
            });
        }
        else {
            this.message_view.revertMessage();
            this.cards_view.resetClickable();
        }
    }

    private dialogSelectFacilityCard(callback: (card_id: CardId) => void): void {
        this.cards_view.setFacilityCardsClickable(callback);
        this.landmarks_view.setFacilityCardsClickable(callback);
    }

    private drawMoneyMotion(money: number, player_id: PlayerId, element_id: string): void {
        if (money > 0) {
            this.effectMoneyMotion(element_id, `player_${player_id}`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}`, element_id, -money);
        }
        this.players_view.players[player_id].addMoney(money);
    }

    private getPosition(element_id: string): [number, number] {
        let rect: ClientRect = document.getElementById(element_id).getBoundingClientRect();
        return [rect.left, rect.top];
    }

    private effectCharacter(pid: PlayerId, card_id: CardId): void {
        let effect_view: HtmlViewObject = null;
        if (this.client.player_id !== pid) {
            this.card_widget_view.setDataId(this.session.getCardDataId(card_id));
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

    private effectCardDeals(player_id: PlayerId, card_ids: CardId[]): void {
        if (this.client.player_id !== player_id) {
            return;
        }
        let timeout: number = 0;
        for (let card_id of card_ids) {
            window.setTimeout(() => {
                const data_id: CardDataId = this.session.getCardDataId(card_id);
                this.cards_view.addCard(data_id, card_id, `player_${player_id}`);
            }, timeout);
            timeout += 500;
        }
    }

    private effectMoneyMotion(element_from: string, element_to: string, money: number): void {
        this.money_motion_view.element.innerHTML = `💸 ${money}`;
        this.effectClonedObjectMove(this.money_motion_view, element_from, element_to);
    }
}
