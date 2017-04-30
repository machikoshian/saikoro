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
  for (let y:number = 0; y < board.row; ++y) {
    for (let x:number = 0; x < board.column; ++x) {
      let field:Field = board.fields[x][y];
      let name:string = field.facility ? field.facility.name : "";
      document.getElementById(`field_${x}_${y}`).innerHTML = name;
    }
  }
}

function onClickField(x, y):void {
  console.log(`clicked: field_${x}_${y}`);
  HttpRequest.Send(`/build?x=${x}&y=${y}`, callbackBoard);
}

function drawBoard(column:number=12, row:number=5):void {
  let output:string = "<table>";

  // Draw fields.
  for (let y:number = 0; y < row; ++y) {
    output += "<tr>";
    for (let x:number = 0; x < column; ++x) {
      output += `<td id="field_${x}_${y}"></td>`;
    }
    output += "</tr>";
  }

  // Draw dice numbers.
  output += "<tr>";
  for (let x:number = 1; x <= column; ++x) {
    output += `<th>${x}</th>`;
  }
  output += "</tr>";

  output += "</table>";
  document.getElementById("board").innerHTML = output;

  // Add click listeners.
  for (let y:number = 0; y < row; ++y) {
    for (let x:number = 0; x < column; ++x) {
      document.getElementById(`field_${x}_${y}`).addEventListener(
          "click", ()=>{onClickField(x, y);});
    }
  }
}

// HttpRequest.Send("/dice?dice_num=2&aim=7", callbackDice);
drawBoard();
HttpRequest.Send("/board", callbackBoard);
