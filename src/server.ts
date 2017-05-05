import { Dice } from "./dice";
import { Session } from "./session";
import { Board, PlayerId } from "./board";
import { FacilityId, FacilityType, Facility } from "./facility";


// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

const memjs = require('memjs');

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
        session.addPlayer("こしあん", 1200, 250);  // 0
        session.addPlayer("つぶあん", 1000, 220);  // 1

        const player_id0: PlayerId = 0;  // TODO: Player ID should be predefined before.
        const player_id1: PlayerId = 1;
        for (let i: number = 0; i < 10; ++i) {
            session.addFacility(player_id0, Facility.fromId(Math.floor(Math.random() * 12)));
            session.addFacility(player_id1, Facility.fromId(Math.floor(Math.random() * 12)));
        }
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

    private processCommand(session: Session, query): boolean {
        if (query.command == "board") {
            let step: number = Number(query.step);
            if (step >= session.getState().getStep()) {
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
                while (session.doNext()) { }
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
                    while (session.doNext()) { }
                }
            }
        }

        return true;
    }

    private requestHandler(request, response): void {
        let url_parts = url.parse(request.url, true);
        let pathname: string = url_parts.pathname;
        if (pathname != "/command") {
            this.serveStaticFiles(pathname, response);
            return;
        }

        let query = url_parts.query;
        let session: Session;
        mc.get('session', (err, value) => {
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

            mc.set('session', session_json, (err) => {}, 600);
        });
    }
}
let main: Main = new Main();

console.log(`Port: ${process.env.PORT || 3156}`);
