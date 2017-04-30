import { Dice } from "./dice";
import { Board,Facility } from "./board";

// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

class Main {
  private board:Board;

  constructor() {
    this.board = new Board();

    let server = http.createServer();
    server.on('request', (request, response) => this.requestHandler(request, response));
    server.listen("3156");
  }

  private requestHandler(request, response):void {
    console.log(request.url);
    console.log(request.method);

    let url_parts = url.parse(request.url, true);
    let query = url_parts.query;
    let pathname:string = url_parts.pathname;
    console.log(url_parts.query);

    if (pathname == "/dice") {
      let dice_num = query.dice_num;
      let aim = query.aim;
      let output:string = JSON.stringify(Dice.roll(dice_num, aim).toJSON());
      console.log(output);
      response.end(output);
      return;
    } else if (pathname == "/board") {
      let output:string = JSON.stringify(this.board.toJSON());
      console.log(output);
      response.end(output);
      return;
    } else if (pathname == "/build") {
      let x:number = query.x;
      let y:number = query.y;
      if (x && y) {
        let facility:Facility = new Facility("[Bee]");
        this.board.setFacility(x, y, facility);
      }

      let output:string = JSON.stringify(this.board.toJSON());
      console.log(output);
      response.end(output);
      return;
    }

    if (pathname == "/") {
      pathname = "/saikoro.html";
    }

    let filepath:string = "./out/client" + pathname;
    fs.stat(filepath, function(error, stat) {
      if (error == null) {
        console.log("File exists: " + pathname);
        fs.readFile(filepath, "utf8", function(error, output) {
          response.end(output);
        });
      } else {
        console.log("Error: " + filepath);
      }
    });
  }
}
let main:Main = new Main();

console.log('Server running at http://localhost:3156/');
