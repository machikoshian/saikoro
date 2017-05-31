import { Dice } from "./dice";
import { Session } from "./session";
import { Board, PlayerId } from "./board";
import { CardId, FacilityDataId, FacilityType, Facility, CharacterDataId, CardData } from "./facility";
import { AutoPlay } from "./auto_play";

export class KeyValue {
    constructor(
        public key: string = "",
        public value: any = null) {}
}

// Memcache
export abstract class Memcache {
    abstract get(key: string, callback: (err: any, value: any) => void): void;
    abstract set(key: string, value: any, callback: (err: any) => void, expire: number): void;
    abstract getWithPromise(key: string): Promise<KeyValue>;
    abstract setWithPromise(key: string, value: any): Promise<KeyValue>;
}

export class MemcacheMock extends Memcache {
    public cache: { [key: string]: any; } = {};

    public get(key: string, callback: (err: any, value: any) => void): void {
        callback(null, this.cache[key]);
    }

    public getWithPromise(key: string): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            let data: KeyValue = new KeyValue(key, this.cache[key]);
            resolve(data);
        });
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.cache[key] = value;
        callback(null);
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        this.cache[key] = value;
        return new Promise<KeyValue>((resolve, reject) => {
            let data: KeyValue = new KeyValue(key, value);
            resolve(data);
        });
    }
}

export class MatchedData {
    constructor(
        public matching_id: string = "",
        public session_id: string = "",
        public session_string: string = "") {}
}

export class SessionHandler {
    private mc: Memcache;
    constructor(mc: Memcache) {
        this.mc = mc;
    }

    public initSession(): Session {  // This is a stub, not to be used for production.
        let session = new Session();
        const player_id0: PlayerId = session.addPlayer("0", "こしあん", 1200, 250, false);
        const player_id1: PlayerId = session.addPlayer("1", "つぶあん", 1000, 220, false);

        for (let i: number = 0; i < 10; ++i) {
            session.addFacility(player_id0, Math.floor(Math.random() * 12));
            session.addFacility(player_id1, Math.floor(Math.random() * 12));
        }
        session.startGame();
        this.doNext(session);
        return session;
    }

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

        else if (query.command === "quit") {
            let player_id: PlayerId = Number(query.player_id);
            if (session.quit(player_id)) {
                this.doNext(session);
            }
        }

        return true;
    }

    public handleCommand(query: any): Promise<KeyValue> {
        let session_key: string = "session";
        if (query.session_id) {
            session_key = `session_${query.session_id}`;
        }

        let session: Session;
        let updated: boolean = false;
        return this.mc.getWithPromise(session_key).then((data) => {
            if (data.value) {
                session = Session.fromJSON(JSON.parse(data.value));
            } else {
                session = this.initSession();
            }

            let updated: boolean = this.processCommand(session, query);
            if (!updated) {
                return new KeyValue(data.key, "{}");
            }
            let session_json: string = JSON.stringify(session.toJSON());
            return this.mc.setWithPromise(session_key, session_json);
        });
    }

    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    public handleMatching(query: any): Promise<MatchedData> {
        let name: string = query.name;
        let mode: number = Number(query.mode);
        let user_id: string = query.user_id;
        let deck: number[] = [];
        try {
            let user_deck = JSON.parse(query.deck);
            deck = user_deck;
        } catch(e) {
            // Invalid deck format. Ignore it.
        }

        let num_players: number = 1;
        let num_npc: number = 2;
        if (mode === 2) {
            num_players = 2;
            num_npc = 0;
        }

        let matched_data: MatchedData = new MatchedData();
        let matching_key: string = `matching_${mode}`;

        // TODO: Some operations can be performed in parallel.
        return this.mc.getWithPromise(matching_key).then((data) => {
            let matching_id: number;
            if (data.value) {
                matching_id = Number(data.value);
            } else {
                matching_id = 10;
            }
            return this.mc.setWithPromise(matching_key, matching_id + 1);
        }).then((data) => {
            let matching_id: number = data.value - 1;

            // FIXIT: This is an obviously hacky way for two players. Fix it.
            let session_id: number = mode * 100000 + Math.floor(matching_id / num_players);
            let session_key = `session_${session_id}`;

            matched_data.matching_id = String(matching_id);
            matched_data.session_id = String(session_id);
            return this.mc.getWithPromise(session_key);
        }).then((data) => {
            let session_key: string = data.key;
            let session_value: string = data.value;
            let session: Session;
            if (session_value) {
                session = Session.fromJSON(JSON.parse(session_value));
            } else {
                session = new Session();
            }

            let player_id: PlayerId = this.addNewPlayer(session, user_id, name, deck, false);
            if (player_id === num_players - 1) {
                // Add NPC.
                const NPC_NAMES = ["ごましお", "グラ", "ヂータ", "エル", "茜"];
                for (let i: number = 0; i < num_npc; ++i) {
                    let npc_name: string = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
                    this.addNewPlayer(session, `${i}`, npc_name + " (NPC)", [], true);
                }

                session.startGame();
                this.doNext(session);
            }

            let session_string: string = JSON.stringify(session.toJSON());
            matched_data.session_string = session_string;

            return this.mc.setWithPromise(session_key, session_string);
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
