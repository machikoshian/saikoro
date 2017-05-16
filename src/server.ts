import { Dice } from "./dice";
import { Session } from "./session";
import { Board, PlayerId } from "./board";
import { CardId, FacilityDataId, FacilityType, Facility } from "./facility";


// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

// Set DEBUG mode if specified.
let DEBUG: string = process.env.DEBUG || "";

// Source map support.
if (DEBUG) {
    require("source-map-support").install();
}

class KeyValue {
    constructor(
        public key: string = "",
        public value: any = null) {}
}

// Memcache
abstract class Memcache {
    abstract get(key: string, callback: (err: any, value: any) => void): void;
    abstract set(key: string, value: any, callback: (err: any) => void, expire: number): void;
    abstract getWithPromise(key: string): Promise<KeyValue>;
    abstract setWithPromise(key: string, value: any): Promise<KeyValue>;
}

class MemcacheMock extends Memcache {
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

class MemcacheServer extends Memcache {
    private memcache;

    constructor(url: string = "") {
        super();
        const memjs = require("memjs");
        if (url) {
            // Do nothing.
        }
        else if (process.env.MEMCACHE_URL) {
            url = process.env.MEMCACHE_URL;
        }
        else if (process.env.USE_GAE_MEMCACHE) {
            url = `${process.env.GAE_MEMCACHE_HOST}:${process.env.GAE_MEMCACHE_PORT}`;
        }
        this.memcache = memjs.Client.create(url);
    }

    public get(key: string, callback: (err: any, value: any) => void): void {
        this.memcache.get(key, callback);
    }

    public getWithPromise(key: string): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            this.memcache.get(key, (err, value) => {
                resolve(new KeyValue(key, value));
            });
        });
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.memcache.set(key, value, callback, expire);
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            this.memcache.set(key, value, (err, value) => {
                resolve(new KeyValue(key, value));
            }, 600);
        });
    }
}

// Firebase
let firebase_admin = require("firebase-admin");
let service_account = require("./serviceAccountKey.json");  // This file is private.

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(service_account),
    databaseURL: "https://saikoro-5a164.firebaseio.com/",
    databaseAuthVariableOverride: {
        uid: "saikoro-server",
    }
});

class FirebaseMemcache extends Memcache {
    public get(key: string, callback: (err: any, value: any) => void): void {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        ref_memcache.once('value').then((snapshot) => {
            callback(null, snapshot.val());
        });
    }

    public getWithPromise(key: string): Promise<KeyValue> {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        return ref_memcache.once('value').then((snapshot) => {
            return new KeyValue(key, snapshot.val());
        });
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        ref_memcache.set(value).then((unused) => { callback(null); });
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        return ref_memcache.set(value).then((snapshot) => {
            return new KeyValue(key, value);
        });
    }
}

// const mc = new MemcacheMock();
// const mc = new MemcacheServer("localhost:11211");
const mc = new FirebaseMemcache();

class MatchedData {
    constructor(
        public matching_id: string = "",
        public session_id: string = "",
        public session_string: string = "") {}
}

class FirebaseServer {
    private db;
    private ref_session;
    private ref_matched;
    private ref_matching;
    private ref_command;

    constructor() {
        this.db = firebase_admin.database();
        this.ref_session = this.db.ref("session");
        this.ref_matched = this.db.ref("matched");
        this.ref_matching = this.db.ref("matching");
        this.ref_command = this.db.ref("command");
    }

    public run() {
        // matching
        this.ref_matching.on("child_added", (data) => {
            let user_id: string = data.val().user_id;

            SessionHandler.handleMatching(data.val().name, user_id).then((matched: MatchedData) => {
                return Promise.all([
                    this.ref_session.child(`session_${matched.session_id}`).set(matched.session_string),
                    this.ref_matched.child(user_id).set({ matching_id: matched.matching_id,
                                                          session_id: matched.session_id }),
                    // Delete handled event.
                    this.ref_matching.child(data.key).set(null)
                ]);
            });
        });

        // command
        this.ref_command.on("child_added", (data) => {
            SessionHandler.handleCommand(data.val()).then((session_data) => {
                let session_string = session_data.value;
                let promises: Promise<{}>[] = [];

                if (session_string !== "{}") {
                    promises.push(this.ref_session.child(session_data.key).set(session_string));
                }
                // Delete handled event.
                promises.push(this.ref_command.child(data.key).set(null));
                return Promise.all(promises);
            });
        });
    }
}


class HttpServer {
    private server;

    constructor() {
        this.server = http.createServer();
    }

    public run() {
        this.server.on("request", (request, response) => this.requestHandler(request, response));
        this.server.listen(process.env.PORT || 3156);
        console.log(`Port: ${process.env.PORT || 3156}`);
    }

    private serveStaticFiles(pathname: string, response): void {
        if (pathname == "/") {
            pathname = "/saikoro.html";
        }

        let filepath: string = "./out/client" + pathname;
        fs.stat(filepath, function (error, stat) {  // can use readFile only?
            if (error == null) {
                fs.readFile(filepath, "utf8", function (error, output) {
                    response.end(output);
                });
            }
            else {
                response.end(pathname);
            }
        });
        return;
    }

    private requestHandler(request, response): void {
        let url_parts = url.parse(request.url, true);
        let pathname: string = url_parts.pathname;
        let query = url_parts.query;

        if (pathname == "/env") {
            let output: string = "";
            output += `MEMCACHE_URL: ${process.env.MEMCACHE_URL}\n`;
            output += `USE_GAE_MEMCACHE: ${process.env.USE_GAE_MEMCACHE}\n`;
            output += `GAE_MEMCACHE_HOST: ${process.env.GAE_MEMCACHE_HOST}\n`;
            output += `GAE_MEMCACHE_PORT: ${process.env.GAE_MEMCACHE_PORT}\n`;
            response.end(output);
            return;
        }

        if (pathname == "/command") {
            SessionHandler.handleCommand(query).then((data: KeyValue) => {
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(data.value);
            });
            return;
        }

        if (pathname == "/matching") {
            SessionHandler.handleMatching(query.name, query.user_id).then((matched: MatchedData) => {
                response.end(JSON.stringify({ matching_id: matched.matching_id,
                                              session_id: matched.session_id }));
                console.log(matched.session_string);
            });
            return;
        }

        this.serveStaticFiles(pathname, response);
    }
}


class SessionHandler {
    static initSession(): Session {  // This is a stub, not to be used for production.
        let session = new Session();
        const player_id0: PlayerId = session.addPlayer("0", "こしあん", 1200, 250);
        const player_id1: PlayerId = session.addPlayer("1", "つぶあん", 1000, 220);

        for (let i: number = 0; i < 10; ++i) {
            session.addFacility(player_id0, Math.floor(Math.random() * 12));
            session.addFacility(player_id1, Math.floor(Math.random() * 12));
        }
        session.startGame();
        SessionHandler.doNext(session);
        return session;
    }

    static doNext(session: Session): boolean {
        let prev_step: number = session.getStep();
        for (let i: number = 0; i < 100; ++i) {
            if (!session.doNext()) {
                return true;
            }
            let new_step: number = session.getStep();
            if (prev_step == new_step) {
                break;
            }
            prev_step = new_step;
        }
        return false;
    }

    static processCommand(session: Session, query): boolean {
        if (query.command == "board") {
            let step: number = Number(query.step);
            if (step >= session.getStep()) {
                // No update.
                return false;
            }
        }

        else if (query.command == "dice") {
            let player_id: PlayerId = Number(query.player_id);
            let dice_num = Number(query.dice_num);
            let aim = Number(query.aim);
            if (session.diceRoll(player_id, dice_num, aim)) {
                // TODO: integrate diceRoll and doNext.
                SessionHandler.doNext(session);
            }
        }

        else if (query.command == "build") {
            let player_id: PlayerId = Number(query.player_id);
            let x: number = Number(query.x);
            let y: number = Number(query.y);
            let card_id: CardId = Number(query.card_id);
            if (x != null && y != null && player_id != null && card_id != null) {
                if (session.buildFacility(player_id, x, y, card_id)) {
                    // TODO: integrate buildFacility and doNext.
                    SessionHandler.doNext(session);
                }
            }
        }

        return true;
    }

    static handleCommand(query: any): Promise<KeyValue> {
        let session_key: string = "session";
        if (query.session_id) {
            session_key = `session_${query.session_id}`;
        }

        let session: Session;
        let updated: boolean = false;
        return mc.getWithPromise(session_key).then((data) => {
            if (data.value) {
                session = Session.fromJSON(JSON.parse(data.value));
            } else {
                session = SessionHandler.initSession();
            }

            let updated: boolean = SessionHandler.processCommand(session, query);
            if (!updated) {
                return new KeyValue(data.key, "{}");
            }
            let session_json: string = JSON.stringify(session.toJSON());
            return mc.setWithPromise(session_key, session_json);
        });
    }

    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    static handleMatching(name: string, user_id: string): Promise<MatchedData> {
        const num_players: number = 2;
        let matched_data: MatchedData = new MatchedData();

        // TODO: Some operations can be performed in parallel.
        return mc.getWithPromise("matching").then((data) => {
            let matching_id: number;
            if (data.value) {
                matching_id = Number(data.value);
            } else {
                matching_id = 10;
            }
            return mc.setWithPromise("matching", matching_id + 1);
        }).then((data) => {
            let matching_id: number = data.value - 1;

            // TODO: This is obviously hacky way for two players. Fix it.
            let session_id: number = Math.floor(matching_id / num_players);
            let session_key = `session_${session_id}`;

            matched_data.matching_id = String(matching_id);
            matched_data.session_id = String(session_id);
            return mc.getWithPromise(session_key);
        }).then((data) => {
            let session_key: string = data.key;
            let session_value: string = data.value;
            let session: Session;
            if (session_value) {
                session = Session.fromJSON(JSON.parse(session_value));
            } else {
                session = new Session();
            }

            SessionHandler.addNewPlayer(session, user_id, name, num_players);

            let session_string: string = JSON.stringify(session.toJSON());
            matched_data.session_string = session_string;

            return mc.setWithPromise(session_key, session_string);
        }).then((data) => {
            return matched_data;
        });
    }

    static addNewPlayer(session: Session, user_id: string, name: string, num_players: number): PlayerId {
        const player_id: PlayerId = session.addPlayer(user_id, name, 1200, 250);
        const num_cards = 10;
        const max_id: number = 24;
        for (let i: number = 0; i < num_cards; ++i) {
            const card_id: FacilityDataId = Math.floor(Math.random() * max_id);
            session.addFacility(player_id, card_id);
        }

        if (player_id == num_players - 1) {
            session.startGame();
            SessionHandler.doNext(session);
        }

        return player_id;
    }
}

let main_http: HttpServer = new HttpServer();
main_http.run();
let main_firebase: FirebaseServer = new FirebaseServer();
main_firebase.run();
