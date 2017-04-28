import { Dice } from "./dice";

declare function require(name:string):any;
var http = require("http");

class Main {
  constructor() {
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
    }
  }
}
let main:Main = new Main();

console.log('Server running at http://localhost:3156/');
