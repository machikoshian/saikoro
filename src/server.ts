import { Dice } from "./dice";
import { Board,Facility } from "./board";

declare function require(name:string):any;
var http = require("http");
var url = require("url");

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
      let output:string = Dice.roll(2, 7).debugString();
      console.log(output);
      response.end(output);
    } else if (pathname == "/board") {
      let output:string = this.board.debugString();
      console.log(output);
      response.end(output);
    } else if (pathname == "/build") {
      let x:number = query.x;
      let y:number = query.y;
      if (x && y) {
        let facility:Facility = new Facility("[Bee]");
        this.board.setFacility(x, y, facility);
      }

      let output:string = this.board.debugString();
      console.log(output);
      response.end(output);
    }
  }
}
let main:Main = new Main();

console.log('Server running at http://localhost:3156/');
