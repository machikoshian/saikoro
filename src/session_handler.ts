import { Dice } from "./dice";
import { Session } from "./session";
import { Board, PlayerId } from "./board";
import { CardId, CardDataId, FacilityType, Facility, CardData } from "./facility";
import { AutoPlay } from "./auto_play";
import { GameMode, MatchingInfo, MatchingPlayerInfo, Protocol } from "./protocol";
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
            const step: number = Number(query.step);
            if (step >= session.getStep()) {
                // No update.
                return false;
            }
        }

        else if (query.command === "character") {
            const player_id: PlayerId = Number(query.player_id);
            const card_id: CardId = Number(query.card_id);
            // TODO: Enable to accept other additional values.
            const target_player_id: PlayerId = Number(query.target_player_id);
            if (session.useCharacter(player_id, card_id, target_player_id)) {
                // TODO: integrate buildFacility and doNext.
                this.doNext(session);
            }
        }

        else if (query.command === "dice") {
            const player_id: PlayerId = Number(query.player_id);
            const dice_num = Number(query.dice_num);
            const aim = Number(query.aim);
            if (session.diceRoll(player_id, dice_num, aim)) {
                // TODO: integrate diceRoll and doNext.
                this.doNext(session);
            }
        }

        else if (query.command === "build") {
            const player_id: PlayerId = Number(query.player_id);
            const x: number = Number(query.x);
            const y: number = Number(query.y);
            const card_id: CardId = Number(query.card_id);
            if (x != null && y != null && player_id != null && card_id != null) {
                if (session.buildFacility(player_id, x, y, card_id)) {
                    // TODO: integrate buildFacility and doNext.
                    this.doNext(session);
                }
            }
        }

        else if (query.command === "interact") {
            const player_id: PlayerId = Number(query.player_id);
            const card_id: CardId = Number(query.card_id);
            const target_player_id: PlayerId = Number(query.target_player_id);
            if (session.interactFacilityAction(player_id, card_id, target_player_id)) {
                // TODO: integrate interactFacilityAction and doNext.
                this.doNext(session);
            }
        }

        else if (query.command === "quit") {
            const user_id: string = String(query.user_id);
            if (session.quitGame(user_id)) {
                this.doNext(session);
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
    private getMacthingKey(mode: GameMode): string {
        // TODO: rename "memcache" and check the permission.
        return `memcache/matching_${mode}`;
    }

    public handleCommand(query: any): Promise<KeyValue> {
        const session_id = (query.session_id != undefined) ? Number(query.session_id) : -1;
        const mode = Number(query.mode);
        if (session_id === -1) {
            // Quit from matching.
            if (query.command === "quit") {
                // TODO: rename "memcache" and check the permission.
                let matching_key: string = this.getMacthingKey(mode);
                return this.storage.deleteWithPromise(`${matching_key}/${query.user_id}`).then((data) => {
                    return this.updateMatching(mode);
                }).then((data) => {
                    return new KeyValue(data.key, "{}");
                });
            }
        }

        let session_key: string = this.getSessionKey(session_id);
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

    private createSession(session_id: number, mode: GameMode, player_infos: any[]): Session {
        let session: Session = new Session(session_id);
        for (let info of player_infos) {
            this.addNewPlayer(session, info.user_id, info.name, info.deck, false);
        }

        // Add NPC.
        const NPC_NAMES = ["ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石", "ハルカ"];
        const num_npc: number = Protocol.getNpcCount(mode);
        for (let i: number = 0; i < num_npc; ++i) {
            let npc_name: string = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
            this.addNewPlayer(session, `${i}`, npc_name + " (NPC)", [], true);
        }

        session.startGame();
        this.doNext(session);
        return session;
    }

    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    public handleMatching(query: any): Promise<KeyValue> {
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

        const matching_key: string = this.getMacthingKey(mode);

        let player_info: MatchingPlayerInfo = <MatchingPlayerInfo> {
            user_id: user_id,
            mode: mode,
            name: name,
            deck: deck,
        };

        return this.storage.setWithPromise(`${matching_key}/${user_id}`, player_info).then((data) => {
            return this.updateMatching(mode);
        });
    }

    public updateMatching(mode: GameMode): Promise<KeyValue> {
        const matching_key: string = this.getMacthingKey(mode);
        return this.storage.getWithPromise(matching_key).then((data) => {
            let matching_player_infos: {[user_id: string]: MatchingPlayerInfo};
            matching_player_infos = data.value ? data.value : {};
            return this.processMatching(mode, matching_player_infos);
        });
    }

    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    public processMatching(mode: GameMode,
                           matching_player_infos: {[user_id: string]: MatchingPlayerInfo}): Promise<KeyValue> {
        let user_ids: string[] = Object.keys(matching_player_infos);
        let names: string[] = [];

        // The number of players is not enough.
        const num_players: number = Protocol.getPlayerCount(mode);
        if (user_ids.length === 0) {
            return this.storage.deleteWithPromise(`live/matching_${mode}`);
        }

        if (user_ids.length < num_players) {
            for (let user_id of user_ids) {
                names.push(matching_player_infos[user_id].name);
            }

            const matching_info: MatchingInfo = <MatchingInfo>{
                mode: mode,
                session_id: -1,
                player_names: names,
                is_matched: false,
            };
            return this.storage.setWithPromise(`live/matching_${mode}`, matching_info);
        }

        let promises: Promise<KeyValue>[] = [];

        promises.push(this.storage.deleteWithPromise(`live/matching_${mode}`));

        // Create session.

        // Update player info.
        let matching_key: string = this.getMacthingKey(mode);
        let player_infos: MatchingPlayerInfo[] = [];
        for (let i: number = 0; i < num_players; ++i) {
            const user_id: string = user_ids[i];
            names.push(matching_player_infos[user_id].name);
            player_infos.push(matching_player_infos[user_id]);
            promises.push(this.storage.deleteWithPromise(`${matching_key}/${user_id}`));
        }

        // TODO: session_id should be exactly unique.
        const session_id = new Date().getTime();  // Msec.
        let session = this.createSession(session_id, mode, player_infos);
        const session_key: string = this.getSessionKey(session_id);
        const session_string: string = JSON.stringify(session.toJSON());
        promises.push(this.storage.setWithPromise(session_key, session_string));

        const matching_info: MatchingInfo = <MatchingInfo>{
            mode: mode,
            session_id: session_id,
            player_names: names,
            is_matched: true,
        };

        // Set matched/ data.
        for (let player of session.getPlayers()) {
            if (player.isAuto()) {
                continue;
            }
            promises.push(this.storage.setWithPromise(`matched/${player.user_id}`, matching_info));
        }

        // Set live/ data.
        promises.push(this.storage.setWithPromise(`live/session_${session_id}`, matching_info));
        return Promise.all(promises).then((data) => {
            // Return the last item (key: live/session_${session_id}).
            return data[data.length - 1];
        });
    }

    public addNewPlayer(session: Session, user_id: string, name: string,
                        deck: number[], is_auto: boolean): PlayerId {
        const player_id: PlayerId = session.addPlayer(user_id, name, 1200, 250, is_auto);

        let num_facilities: number = 0;
        let num_chars: number = 0;
        deck = deck ? deck : [];
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
