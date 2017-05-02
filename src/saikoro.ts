import { Steps, Session, Player, Board, Field, Facility, PlayerId } from "./board";
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

function diceResultMessage(dice: DiceResult): string {
  let faces: string[] = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  let d1: number = dice.dice1;
  let d2: number = dice.dice2;
  return `${faces[d1]} ${faces[d2]} : ${d1 + d2} です。`;
}

function callbackDice(response: string): void {
  let dice: DiceResult = DiceResult.fromJSON(JSON.parse(response));
  let message: string = diceResultMessage(dice);

  document.getElementById("message").innerHTML = message;
}

function getPlayerColor(player: Player): string {
  let colors = [ "#909CC2", "#D9BDC5", "#90C290", "#9D8189" ];

  if (!player || player.id > colors.length) {
    return "#EFF0D1";
  }
  return colors[player.id];
}

let _hack_player_id: PlayerId = 0;

function callbackSession(response: string): void {
  let session: Session = Session.fromJSON(JSON.parse(response));
  let player_id: PlayerId = session.getCurrentPlayerId();
  _hack_player_id = player_id;

  // Update board.
  let board: Board = session.getBoard();
  for (let y: number = 0; y < board.row; ++y) {
    for (let x: number = 0; x < board.column; ++x) {
      let facility: Facility = board.getFacility(x, y);
      let name: string = facility ? facility.getName() : "";
      let owner_id: PlayerId = facility ? facility.getPlayerId() : null;

      document.getElementById(`field_${x}_${y}`).innerHTML = name;
      document.getElementById(`field_${x}_${y}`).style.backgroundColor =
          getPlayerColor(session.getPlayer(owner_id));
    }
  }

  // Update players.
  let players: Player[] = session.getPlayers();
  for (let i: number = 0; i < players.length; ++i) {
    document.getElementById(`player_${i}`).style.visibility = "visible";
    document.getElementById(`player_${i}_name`).innerHTML = players[i].name;

    let money_element = document.getElementById(`player_${i}_money`);
    let money: number = players[i].getMoney();
    let timer = setInterval( () => {
        let current_money = Number(money_element.innerText);
        if (current_money == money) {
          clearInterval(timer);
          return;
        }
        else if (current_money > money) {
          current_money -= Math.min(10, current_money - money);
        }
        else if (current_money < money) {
          current_money += Math.min(10, money - current_money);
        }
        money_element.innerHTML = String(current_money);
      }, 5);
    document.getElementById(`player_${i}_salary`).innerHTML = `${players[i].salary}`;
  }
  for (let i: number = players.length; i < 4; ++i) {
    document.getElementById(`player_${i}`).style.visibility = "hidden";
  }

  // Update message.
  let player: Player = players[player_id];
  let name: string = player.name;
  let message: string = "";
  if (session.getState().getStep() == Steps.DiceRoll) {
    message = `🎲 ${name} のサイコロです 🎲`;
  }
  else if (session.getState().getStep() == Steps.BuildFacility) {
    message = diceResultMessage(session.getDiceResult());
    message += `  🎲 ${name} の建設です 🎲`;
  }
  document.getElementById("message").innerHTML = message;
  document.getElementById("message").style.backgroundColor = getPlayerColor(player);
}

function onClickField(x, y): void {
  console.log(`clicked: field_${x}_${y}`);
  HttpRequest.Send(`/build?player_id=${_hack_player_id}&x=${x}&y=${y}`,
                   callbackSession);
}

function onClickDice(dice_num: number, aim: number): void {
  console.log(`clicked: dice_num:${dice_num}, aim:${aim}`);
  HttpRequest.Send(`/dice?player_id=${_hack_player_id}&dice_num=${dice_num}&aim=${aim}`,
                   callbackSession);
}

function initBoard(column: number=12, row: number=5): void {
  // Add click listeners.
  for (let y: number = 0; y < row; ++y) {
    for (let x: number = 0; x < column; ++x) {
      document.getElementById(`field_${x}_${y}`).addEventListener(
          "click", ()=>{onClickField(x, y);});
    }
  }
  document.getElementById("dice_1").addEventListener(
      "click", ()=>{onClickDice(1, 0);});
  document.getElementById("dice_2").addEventListener(
      "click", ()=>{onClickDice(2, 0);});
}

initBoard();
HttpRequest.Send("/board", callbackSession);
