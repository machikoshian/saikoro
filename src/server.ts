import { Dice } from "./dice";
import { Session, Board, Facility, PlayerId } from "./board";

// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

class Main {
    private session: Session;

    constructor() {
        this.session = new Session();
        this.session.addPlayer("こしあん", 1200, 250);
        this.session.addPlayer("つぶあん", 1000, 220);

        let server = http.createServer();
        server.on("request",
            (request, response) => this.requestHandler(request, response));
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
            let player_id: PlayerId = query.player_id;
            let dice_num = query.dice_num;
            let aim = query.aim;
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
            let output: string = JSON.stringify(this.session.toJSON());
            console.log(output);
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(output);
            return;
        }
        else if (pathname == "/build") {
            let player_id: PlayerId = query.player_id;
            let x: number = query.x;
            let y: number = query.y;
            if (x && y && player_id) {
                let facility: Facility = new Facility("🐝", 200, player_id);
                /*
                        this.session.addProcessor(
                            Steps.BuildFacility,
                            () => this.session.buildFacility(player_id, x, y, facility));
                        this.session.runProcessors();
                */
                if (this.session.buildFacility(player_id, x, y, facility)) {
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
