import { Dice } from "./dice";
import { Session } from "./session";
import { Board, Facility, PlayerId, FacilityId, FacilityType } from "./board";

// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

class Main {
    private session: Session;

    constructor() {
        this.session = new Session();
        this.session.addPlayer("こしあん", 1200, 250);  // 0
        this.session.addPlayer("つぶあん", 1000, 220);  // 1

        const names: string[] =
            ["🌾", "🐮", "🎳", "🐝", "🍴", "💆"]; // , "👕", "🐔", "🌻", "🍣", "🗻", "🍍"];
        const player_id0: PlayerId = 0;  // TODO: Player ID should be predefined before.
        const player_id1: PlayerId = 1;
        for (let i: number = 0; i < names.length; ++i) {
            this.session.addFacility(player_id0, new Facility(names[i], 200, Math.floor(Math.random() * 5)));
            this.session.addFacility(player_id1, new Facility(names[i], 200, Math.floor(Math.random() * 5)));
        }

        let server = http.createServer();
        server.on("request", (request, response) => this.requestHandler(request, response));
        server.listen("3156");
    }

    private requestHandler(request, response): void {
        console.log(request.url);
        console.log(request.method);

        let url_parts = url.parse(request.url, true);
        let query = url_parts.query;
        let pathname: string = url_parts.pathname;
        console.log(url_parts.query);

        if (pathname == "/dice") {
            let player_id: PlayerId = Number(query.player_id);
            let dice_num = Number(query.dice_num);
            let aim = Number(query.aim);
            if (this.session.diceRoll(player_id, dice_num, aim)) {
                // TODO: integrate diceRoll and doNext.
                while (this.session.doNext()) { }
            }
            let output: string = JSON.stringify(this.session.toJSON());
            console.log(output);
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(output);
            return;
        }
        else if (pathname == "/board") {
            let step: number = Number(query.step);
            if (step >= this.session.getState().getStep()) {
                console.log("OK");
                response.end("OK");
                return;
            }

            let output: string = JSON.stringify(this.session.toJSON());
            console.log(output);
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(output);
            return;
        }
        else if (pathname == "/build") {
            const names: string[] =
                ["🌾", "🐮", "🎳", "🐝", "🍴", "💆", "👕", "🐔", "🌻", "🍣", "🗻", "🍍"];
            let player_id: PlayerId = Number(query.player_id);
            let x: number = Number(query.x);
            let y: number = Number(query.y);
            let facility_id: FacilityId = Number(query.facility_id);
            if (x != null && y != null && player_id != null && facility_id != null) {
                if (this.session.buildFacility(player_id, x, y, facility_id)) {
                    // TODO: integrate buildFacility and doNext.
                    while (this.session.doNext()) { }
                }
            }

            let output: string = JSON.stringify(this.session.toJSON());
            console.log(output);
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(output);
            return;
        }

        if (pathname == "/") {
            pathname = "/saikoro.html";
        }

        let filepath: string = "./out/client" + pathname;
        fs.stat(filepath, function (error, stat) {
            if (error == null) {
                console.log("File exists: " + pathname);
                fs.readFile(filepath, "utf8", function (error, output) {
                    response.end(output);
                });
            }
            else {
                console.log("Error: " + filepath);
            }
        });
    }
}
let main: Main = new Main();

console.log('Server running at http://localhost:3156/');
