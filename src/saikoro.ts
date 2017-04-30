import { Session, Player, Board, Field } from "./board";
import { Dice, DiceResult } from "./dice";

class HttpRequest {
  static Send(url: string, callback: (response:string) => void) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => HttpRequest.OnReadyStateChange(xhr,
                                                                  callback);
    xhr.open("GET", url, true);
  }

  static OnReadyStateChange(xhr: XMLHttpRequest,
                            callback: (response:string) => void): void {
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

function callbackDice(response: string): void {
  let dice: DiceResult = DiceResult.fromJSON(JSON.parse(response));
  document.body.innerHTML = "<pre>" + dice.dice1 + "</pre>";
}

function callbackBoard(response: string): void {
  let board: Board = Board.fromJSON(JSON.parse(response));
  for (let y: number = 0; y < board.row; ++y) {
    for (let x: number = 0; x < board.column; ++x) {
      let field: Field = board.fields[x][y];
      let name: string = field.getFacility() ? field.getFacility().name : "";
      document.getElementById(`field_${x}_${y}`).innerHTML = name;
    }
  }
}

function getPlayerColor(player: Player): string {
  let colors = [ "#909CC2", "#D9BDC5", "#90C290", "#9D8189" ];

  if (!player || player.id > colors.length) {
    return "#EFF0D1";
  }
  return colors[player.id];
}

function callbackSession(response: string): void {
  let session: Session = Session.fromJSON(JSON.parse(response));

  // Update board.
  let board: Board = session.getBoard();
  for (let y: number = 0; y < board.row; ++y) {
    for (let x: number = 0; x < board.column; ++x) {
      let field: Field = board.fields[x][y];
      let name: string = field.getFacility() ? field.getFacility().name : "";
      document.getElementById(`field_${x}_${y}`).innerHTML = name;
      document.getElementById(`field_${x}_${y}`).style.backgroundColor =
          getPlayerColor(field.getOwner());
    }
  }

  // Update players.
  let players: Player[] = session.getPlayers();
  for (let i: number = 0; i < players.length; ++i) {
    document.getElementById(`player_${i}`).style.visibility = "visible";
    document.getElementById(`player_${i}_name`).innerHTML = players[i].name;
    document.getElementById(`player_${i}_money`).innerHTML = `${players[i].money}`;
    document.getElementById(`player_${i}_salary`).innerHTML = `${players[i].salary}`;
  }
  for (let i: number = players.length; i < 4; ++i) {
    document.getElementById(`player_${i}`).style.visibility = "hidden";
  }
}

function onClickField(x, y): void {
  console.log(`clicked: field_${x}_${y}`);
  HttpRequest.Send(`/build?x=${x}&y=${y}&player_id=0`, callbackSession);
}

function drawBoard(column: number=12, row: number=5): void {
  // Add click listeners.
  for (let y: number = 0; y < row; ++y) {
    for (let x: number = 0; x < column; ++x) {
      document.getElementById(`field_${x}_${y}`).addEventListener(
          "click", ()=>{onClickField(x, y);});
    }
  }
}

// HttpRequest.Send("/dice?dice_num=2&aim=7", callbackDice);
drawBoard();
HttpRequest.Send("/board", callbackSession);
