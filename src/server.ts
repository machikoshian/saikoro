import { Dice } from "./dice";
import { Board,Facility } from "./board";

declare function require(name:string):any;
var http = require("http");

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
    if (request.url == "/dice") {
      let output:string = Dice.roll(2, 7).debugString();
      console.log(output);
      response.end(output);
    } else if (request.url == "/board") {
      let output:string = this.board.debugString();
      console.log(output);
      response.end(output);
    } else if (request.url == "/build") {
      let x:number = 3;
      let y:number = 2;
      let facility:Facility = new Facility("[Bee]");
      this.board.setFacility(x, y, facility);

      let output:string = this.board.debugString();
      console.log(output);
      response.end(output);
    }
  }
}
let main:Main = new Main();

console.log('Server running at http://localhost:3156/');
