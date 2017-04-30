import { Board, Field } from "./board";
import { Dice, DiceResult } from "./dice";

class HttpRequest {
  static Send(url:string, callback:(response:string) => void) {
    let xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => HttpRequest.OnReadyStateChange(xhr,
                                                                  callback);
    xhr.open("GET", url, true);
  }

  static OnReadyStateChange(xhr:XMLHttpRequest,
                            callback:(response:string) => void):void {
    switch (xhr.readyState) {
      case XMLHttpRequest.OPENED:
        xhr.send();
        break;
      case XMLHttpRequest.HEADERS_RECEIVED:
        console.log(xhr.getAllResponseHeaders());
        break;
      case XMLHttpRequest.LOADING:
        break;
      case XMLHttpRequest.DONE:
        callback(xhr.responseText);
        break;
    }
  }
}

function callbackDice(response:string):void {
  let dice:DiceResult = DiceResult.fromJSON(JSON.parse(response));
  document.body.innerHTML = "<pre>" + dice.dice1 + "</pre>";
}

function callbackBoard(response:string):void {
  let board:Board = Board.fromJSON(JSON.parse(response));
  let output:string = "<table>";
  for (let y:number = 0; y < board.row; ++y) {
    output += "<tr>";
    for (let x:number = 0; x < board.column; ++x) {
      let field:Field = board.fields[x][y];
      let name:string = field.facility ? field.facility.name : "";
      output += "<td>" + name + "</td>";
    }
    output += "</tr>";
  }

  output += "<tr>";
  for (let x:number = 1; x <= board.column; ++x) {
    output += "<th>" + x + "</th>";
  }
  output += "</tr>";

  output += "</table>";
  document.getElementById("board").innerHTML = output;
}

// HttpRequest.Send("/dice?dice_num=2&aim=7", callbackDice);
HttpRequest.Send("/board", callbackBoard);
