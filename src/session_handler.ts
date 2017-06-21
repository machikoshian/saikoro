import { Dice } from "./dice";
import { Session } from "./session";
import { Board, PlayerId } from "./board";
import { CardId, CardDataId, FacilityType, Facility, CardData } from "./facility";
import { AutoPlay } from "./auto_play";
import { GameMode, Protocol } from "./protocol";
import { KeyValue, Storage } from "./storage";

export class MatchedData {
    constructor(
        public matching_id: string = "",
        public session_id: string = "",
        public player_id: number = -1) {}
}

export class SessionHandler {
    constructor(readonly storage: Storage) {}

    public doNext(session: Session): boolean {
        let prev_step: number = session.getStep();

        for (let i: number = 0; i < 100; ++i) {
            let cont: boolean = session.doNext();
            let new_step: number = session.getStep();
            if (cont) {
                prev_step = new_step;
                continue;
            }

            if (session.getCurrentPlayer().isAuto()) {
                cont = AutoPlay.play(session);
                new_step = session.getStep();
            }
            if (cont) {
                prev_step = new_step;
                continue;
            }

            if (prev_step === new_step) {
                break;
            }
            return true;
        }
        return false;
    }

    public processCommand(session: Session, query): boolean {
        if (query.command === "board") {
            let step: number = Number(query.step);
            if (step >= session.getStep()) {
                // No update.
                return false;
            }
        }

        else if (query.command === "character") {
            let player_id: PlayerId = Number(query.player_id);
            let card_id: CardId = Number(query.card_id);
            if (session.useCharacter(player_id, card_id)) {
                // TODO: integrate buildFacility and doNext.
                this.doNext(session);
            }
        }

        else if (query.command === "dice") {
            let player_id: PlayerId = Number(query.player_id);
            let dice_num = Number(query.dice_num);
            let aim = Number(query.aim);
            if (session.diceRoll(player_id, dice_num, aim)) {
                // TODO: integrate diceRoll and doNext.
                this.doNext(session);
            }
        }

        else if (query.command === "build") {
            let player_id: PlayerId = Number(query.player_id);
            let x: number = Number(query.x);
            let y: number = Number(query.y);
            let card_id: CardId = Number(query.card_id);
            if (x != null && y != null && player_id != null && card_id != null) {
                if (session.buildFacility(player_id, x, y, card_id)) {
                    // TODO: integrate buildFacility and doNext.
                    this.doNext(session);
                }
            }
        }

        else if (query.command === "interact") {
            let player_id: PlayerId = Number(query.player_id);
            let card_id: CardId = Number(query.card_id);
            let target_player_id: PlayerId = Number(query.target_player_id);
            if (session.interactFacilityAction(player_id, card_id, target_player_id)) {
                // TODO: integrate interactFacilityAction and doNext.
                this.doNext(session);
            }
        }

        else if (query.command === "quit") {
            const player_id: PlayerId = Number(query.player_id);
            if (player_id !== -1) {
                if (session.quit(player_id)) {
                    this.doNext(session);
                }
            }
            else {
                const user_id: string = String(query.user_id);
                session.removeWatcher(user_id);
            }
        }

        else if (query.command === "watch") {
            const user_id: string = String(query.user_id);
            session.addWatcher(user_id);
        }

        return true;
    }

    private getSessionKey(session_id: number): string {
        return `session/session_${session_id}`;
    }

    public handleCommand(query: any): Promise<KeyValue> {
        if (query.session_id == undefined) {
            return;
        }

        let session_key: string = this.getSessionKey(query.session_id);
        let session: Session;
        let updated: boolean = false;
        return this.storage.getWithPromise(session_key).then((data) => {
            if (!data.value) {
                return new KeyValue(data.key, "{}");
            }
            session = Session.fromJSON(JSON.parse(data.value));

            let updated: boolean = this.processCommand(session, query);

            if (session.isEnd()) {
                this.closeSession(session);
            }
            if (!updated) {
                return new KeyValue(data.key, "{}");
            }
            let session_json: string = JSON.stringify(session.toJSON());
            return this.storage.setWithPromise(session_key, session_json);
        });
    }

    private closeSession(session: Session): void {
        for (let player of session.getPlayers()) {
            this.storage.delete(`matched/${player.user_id}`);
        }
        this.storage.delete(`live/session_${session.session_id}`);
        // TODO: Possible to delete "session/session_id" after 10mins?
    }

    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    public handleMatching(query: any): Promise<MatchedData> {
        let name: string = query.name;
        let mode: GameMode = Number(query.mode);
        let user_id: string = query.user_id;
        let deck: number[] = [];
        try {
            let user_deck = JSON.parse(query.deck);
            deck = user_deck;
        } catch(e) {
            // Invalid deck format. Ignore it.
        }

        let num_players: number = Protocol.getPlayerCount(mode);
        let num_npc: number = Protocol.getNpcCount(mode);

        let matched_data: MatchedData = new MatchedData();
        // TODO: rename "memcache" and check the permission.
        let matching_key: string = `memcache/matching_${mode}`;

        let session_id: number = -1;

        // TODO: Some operations can be performed in parallel.
        return this.storage.getWithPromise(matching_key).then((data) => {
            let matching_id: number;
            if (data.value) {
                matching_id = Number(data.value);
            } else {
                matching_id = 10;
            }
            return this.storage.setWithPromise(matching_key, matching_id + 1);
        }).then((data) => {
            let matching_id: number = data.value - 1;

            // FIXIT: This is an obviously hacky way for two players. Fix it.
            session_id = mode * 100000 + Math.floor(matching_id / num_players);
            const session_key: string = this.getSessionKey(session_id);

            matched_data.matching_id = String(matching_id);
            matched_data.session_id = String(session_id);
            return this.storage.getWithPromise(session_key);
        }).then((data) => {
            let session_key: string = data.key;
            let session_value: string = data.value;
            let session: Session;
            if (session_value) {
                session = Session.fromJSON(JSON.parse(session_value));
            } else {
                session = new Session(session_id);
            }

            let player_id: PlayerId = this.addNewPlayer(session, user_id, name, deck, false);
            matched_data.player_id = player_id;
            let is_matched: boolean = false;
            if (player_id === num_players - 1) {
                // Add NPC.
                const NPC_NAMES = ["ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石"];
                for (let i: number = 0; i < num_npc; ++i) {
                    let npc_name: string = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
                    this.addNewPlayer(session, `${i}`, npc_name + " (NPC)", [], true);
                }

                session.startGame();
                this.doNext(session);
                is_matched = true;
            }

            let names: string[] = session.getPlayers().map((player) => { return player.name; });
            let info = {
                session_id: session.session_id,
                is_matched: is_matched,
                mode: Number(query.mode),
                names: names,
            };
            this.storage.setWithPromise(`live/session_${session.session_id}`, info);

            let session_string: string = JSON.stringify(session.toJSON());
            return this.storage.setWithPromise(session_key, session_string);
        }).then((data) => {
            return matched_data;
        });
    }

    public addNewPlayer(session: Session, user_id: string, name: string,
                        deck: number[], is_auto: boolean): PlayerId {
        const player_id: PlayerId = session.addPlayer(user_id, name, 1200, 250, is_auto);

        let num_facilities: number = 0;
        let num_chars: number = 0;
        for (let data_id of deck) {
            if (CardData.isFacility(data_id)) {
                session.addFacility(player_id, data_id);
                num_facilities++;
                continue;
            }
            if (CardData.isCharacter(data_id)) {
                if (num_chars <= 5) {
                    session.addCharacter(player_id, data_id);
                    num_chars++;
                }
                continue;
            }
        }

        for (let i: number = num_facilities; i < 10; ++i) {
            session.addFacility(player_id, CardData.getRandomFacilityDataId());
        }

        for (let i: number = num_chars; i < 2; ++i) {
            session.addCharacter(player_id, CardData.getRandomCharacterDataId());
        }

        return player_id;
    }
}
