import { Dice } from "./dice";
import { Session } from "./session";
import { Board, PlayerId } from "./board";
import { FacilityId, FacilityType, Facility } from "./facility";


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

const memjs = require("memjs");

class MemcacheMock {
    public cache: { [key: string]: any; } = {};

    public get(key: string, callback: (err: any, value: any) => void): void {
        callback(null, this.cache[key]);
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.cache[key] = value;
    }
}

let MEMCACHE_URL: string = process.env.MEMCACHE_URL;

if (process.env.USE_GAE_MEMCACHE) {
     MEMCACHE_URL = `${process.env.GAE_MEMCACHE_HOST}:${process.env.GAE_MEMCACHE_PORT}`;
}

const mc = MEMCACHE_URL ? memjs.Client.create(MEMCACHE_URL) : new MemcacheMock();


class Main {
    // All variable used for sessions should be stored in memcache.
    constructor() {
        let server = http.createServer();
        server.on("request", (request, response) => this.requestHandler(request, response));
        server.listen(process.env.PORT || 3156);
    }

    private initSession(): Session {
        let session = new Session();
        session.addPlayer(0, "こしあん", 1200, 250);  // 0
        session.addPlayer(1, "つぶあん", 1000, 220);  // 1

        const player_id0: PlayerId = 0;  // TODO: Player ID should be predefined before.
        const player_id1: PlayerId = 1;
        for (let i: number = 0; i < 10; ++i) {
            session.addFacility(player_id0, Facility.fromId(Math.floor(Math.random() * 12)));
            session.addFacility(player_id1, Facility.fromId(Math.floor(Math.random() * 12)));
        }
        session.startGame();
        while (session.doNext()) { }
        return session;
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

    private doNext(session: Session): boolean {
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

    private processCommand(session: Session, query): boolean {
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
                this.doNext(session);
            }
        }

        else if (query.command == "build") {
            let player_id: PlayerId = Number(query.player_id);
            let x: number = Number(query.x);
            let y: number = Number(query.y);
            let facility_id: FacilityId = Number(query.facility_id);
            if (x != null && y != null && player_id != null && facility_id != null) {
                if (session.buildFacility(player_id, x, y, facility_id)) {
                    // TODO: integrate buildFacility and doNext.
                    this.doNext(session);
                }
            }
        }

        return true;
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
            let session_key: string = "session";
            if (query.session_id) {
                session_key = `session_${query.session_id}`;
            }

            let session: Session;
            mc.get(session_key, (err, value) => {
                if (value) {
                    session = Session.fromJSON(JSON.parse(value));
                } else {
                    session = this.initSession();
                }

                let output: string = "{}";
                let updated: boolean = this.processCommand(session, query);
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                let session_json: string = JSON.stringify(session.toJSON());
                if (updated) {
                    output = session_json;
                }
                response.end(output);

                mc.set(session_key, session_json, (err) => {}, 600);
            });
            return;
        }

        // TODO: This is a quite hacky way for testing w/o considering any race conditions.
        if (pathname == "/matching") {
            mc.get("matching", (err, value) => {
                let matching_id: number;
                if (value) {
                    matching_id = Number(value);
                } else {
                    matching_id = 10;
                }
                mc.set("matching", matching_id + 1, (err) => {}, 600);

                // TODO: This is obviously hacky way for two players. Fix it.
                const num_players: number = 1;
                let session_id: number = Math.floor(matching_id / num_players);
                let session_name: string = `session_${session_id}`;
                mc.get(session_name, (session_err, session_value) => {
                    let session: Session;
                    if (session_value) {
                        session = Session.fromJSON(JSON.parse(session_value));
                    } else {
                        session = new Session();
                    }

                    const player_id: PlayerId = session.addPlayer(matching_id, query.name, 12000, 250);
                    for (let i: number = 0; i < 10; ++i) {
                        const max_id: number = 12;
                        const card_id: number = Math.floor(Math.random() * max_id);
                        session.addFacility(player_id, Facility.fromId(card_id));
                    }

                    if (player_id == num_players - 1) {
                        session.startGame();
                        while (session.doNext()) { }
                    }

                    let session_json: string = JSON.stringify(session.toJSON());

                    console.log(session_json);

                    mc.set(session_name, session_json, (err) => {}, 600);
                });

                response.end(`{"matching_id":${matching_id},"session_id":${session_id}}`);
            });
            return;
        }

        this.serveStaticFiles(pathname, response);
    }
}
let main: Main = new Main();

console.log(`Port: ${process.env.PORT || 3156}`);
