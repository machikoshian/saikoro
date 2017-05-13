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


// Memcache
abstract class Memcache {
    abstract get(key: string, callback: (err: any, value: any) => void): void;
    abstract set(key: string, value: any, callback: (err: any) => void, expire: number): void;
}

class MemcacheMock extends Memcache {
    public cache: { [key: string]: any; } = {};

    public get(key: string, callback: (err: any, value: any) => void): void {
        callback(null, this.cache[key]);
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.cache[key] = value;
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

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.memcache.set(key, value, callback, expire);
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

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        ref_memcache.set(value);
    }
}

// const mc = new MemcacheMock();
// const mc = new MemcacheServer("localhost:11211");
const mc = new FirebaseMemcache();

class FirebaseServer {
    constructor() {
        let db = firebase_admin.database();
        let ref = db.ref("/session");  // TODO: stop using global var.
        let ref_matched = db.ref("/matched");
        let ref_matching = db.ref("/matching");
        let ref_command = db.ref("/command");

        // matching
        ref_matching.on("child_added", (data) => {
            let user_id: string = data.val().user_id;
            SessionHandler.handleMatching(data.val().name, user_id,
            (json: any) => {
                ref_matched.child(user_id).set(json);
            },
            (session_name: string, session_json: string) => {
                // Copy session from /memcache to /session.
                let obj = {};
                obj[session_name] = session_json;
                ref.set(obj);
            });
        });

        // command
        ref_command.on("child_added", (data) => {
            SessionHandler.handleCommand(data.val(), (session_key, json_string) => {
                if (json_string === "{}") {
                    return;
                }
                let obj = {};
                obj[session_key] = json_string;
                ref.set(obj);
            });
        });
    }
}

class HttpServer {
    // All variable used for sessions should be stored in memcache.
    constructor() {
        let server = http.createServer();
        server.on("request", (request, response) => this.requestHandler(request, response));
        server.listen(process.env.PORT || 3156);
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
            SessionHandler.handleCommand(query, (session_key, output) => {
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(output);
            });
            return;
        }

        if (pathname == "/matching") {
            SessionHandler.handleMatching(query.name, query.user_id,
                (json) => { response.end(JSON.stringify(json)); },
                (session_name, session_json) => { console.log(session_json); });
            return;
        }

        this.serveStaticFiles(pathname, response);
    }
}

class SessionHandler {
    static initSession(): Session {
        let session = new Session();
        session.addPlayer(0, "こしあん", 1200, 250);  // 0
        session.addPlayer(1, "つぶあん", 1000, 220);  // 1

        const player_id0: PlayerId = 0;  // TODO: Player ID should be predefined before.
        const player_id1: PlayerId = 1;
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

    static handleCommand(query: any,
                         callback: (session_key: string, json_string:string) => void): void {
        let session_key: string = "session";
        if (query.session_id) {
            session_key = `session_${query.session_id}`;
        }

        let session: Session;
        mc.get(session_key, (err, value) => {
            if (value) {
                session = Session.fromJSON(JSON.parse(value));
            } else {
                session = SessionHandler.initSession();
            }

            let output: string = "{}";
            let updated: boolean = SessionHandler.processCommand(session, query);
            let session_json_obj: any = session.toJSON();
            let session_json: string = JSON.stringify(session_json_obj);
            if (updated) {
                output = session_json;
            }

            mc.set(session_key, session_json, (err) => {}, 600);

            callback(session_key, output);
        });
    }

    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    static handleMatching(name: string, user_id: string,
                          callback_matched: (json: any) => void,
                          callback_session: (session_key: string, json_string:string) => void): void {
        mc.get("matching", (err, value) => {
            let matching_id: number;
            if (value) {
                matching_id = Number(value);
            } else {
                matching_id = 10;
            }
            mc.set("matching", matching_id + 1, (err) => {}, 600);

            // TODO: This is obviously hacky way for two players. Fix it.
            const num_players: number = 2;
            let session_id: number = Math.floor(matching_id / num_players);
            let session_name: string = `session_${session_id}`;
            mc.get(session_name, (session_err, session_value) => {
                let session: Session;
                if (session_value) {
                    session = Session.fromJSON(JSON.parse(session_value));
                } else {
                    session = new Session();
                }

                SessionHandler.addNewPlayer(session, matching_id, name, num_players);

                let session_json: string = JSON.stringify(session.toJSON());

                console.log(session_json);

                mc.set(session_name, session_json, (err) => {}, 600);
                callback_session(session_name, session_json);
            });

            let matching_obj = { matching_id: matching_id, session_id: session_id };
            callback_matched(matching_obj);
        });
    }

    static addNewPlayer(session: Session, matching_id: number, name: string, num_players: number): void {
        const player_id: PlayerId = session.addPlayer(matching_id, name, 1200, 250);
        const num_cards = 10;
        const max_id: number = 12;
        for (let i: number = 0; i < num_cards; ++i) {
            const card_id: FacilityDataId = Math.floor(Math.random() * max_id);
            session.addFacility(player_id, card_id);
        }

        if (player_id == num_players - 1) {
            session.startGame();
            SessionHandler.doNext(session);
        }
    }
}

let main_http: HttpServer = new HttpServer();
let main_firebase: FirebaseServer = new FirebaseServer();
