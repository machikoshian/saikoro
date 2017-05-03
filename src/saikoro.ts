import { Steps, Session, PlayerCards } from "./session";
import { Player, Board, Field, Facility, PlayerId, FacilityId, FacilityType } from "./board";
import { Dice, DiceResult } from "./dice";

class HttpRequest {
    static Send(url: string, callback: (response: string) => void) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => HttpRequest.OnReadyStateChange(xhr,
            callback);
        xhr.open("GET", url, true);
    }

    static OnReadyStateChange(xhr: XMLHttpRequest,
        callback: (response: string) => void): void {
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
    let colors = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];

    if (!player || player.id > colors.length) {
        return "#EFF0D1";
    }
    return colors[player.id];
}

function getFacilityColor(facility: Facility): string {
    if (!facility) {
        return "#EFF0D1";
    }
    let type: FacilityType = facility.type;
    switch(type) {
        case FacilityType.Gray:
            return "#90CAF9";
        case FacilityType.Blue:
            return "#90CAF9";
        case FacilityType.Green:
            return "#A5D6A7";
        case FacilityType.Red:
            return "#EF9A9A";
        case FacilityType.Purple:
            return "#B39DDB";
    }
}

class WebClient {
    public player_id: PlayerId;
    public clicked_facility_id: FacilityId = -1;
    public clicked_card_element: HTMLElement = null;
    public player_cards_list: FacilityId[][] = [];

    public resetCards(): void {
        if (this.clicked_card_element) {
            this.clicked_card_element.style.borderColor = "#EEEEEE";
            this.clicked_card_element = null;
        }
        this.clicked_facility_id = -1;
    }

    public onClickCard(player: number, card: number): void {
        console.log(`clicked: card_${player}_${card}`);
        this.resetCards();
        this.clicked_card_element = document.getElementById(`card_${player}_${card}`);
        this.clicked_card_element.style.borderColor = "#FFE082";
        this.clicked_facility_id = client.player_cards_list[player][card];
    }
}

let client: WebClient = new WebClient();

let _hack_player_id: PlayerId = 0;

function callbackSession(response: string): void {
    let session: Session = Session.fromJSON(JSON.parse(response));
    let player_id: PlayerId = session.getCurrentPlayerId();
    _hack_player_id = player_id;

    // Update board.
    let board: Board = session.getBoard();
    for (let y: number = 0; y < board.row; ++y) {
        for (let x: number = 0; x < board.column; ++x) {
            let facility: Facility = session.getFacilityOnBoard(x, y);
            let name: string = facility ? facility.getName() : "";
            let owner_id: PlayerId = session.getOwnerIdOnBoard(x, y);

            document.getElementById(`field_${x}_${y}`).innerHTML = name;
            document.getElementById(`field_${x}_${y}`).style.backgroundColor =
                getPlayerColor(session.getPlayer(owner_id));
            document.getElementById(`field_${x}_${y}`).style.borderColor =
                getFacilityColor(facility);
        }
    }

    // Update players.
    let players: Player[] = session.getPlayers();
    for (let i: number = 0; i < players.length; ++i) {
        document.getElementById(`player_${i}`).style.visibility = "visible";
        document.getElementById(`player_${i}_name`).innerHTML = players[i].name;

        let money_element = document.getElementById(`player_${i}_money`);
        let money: number = players[i].getMoney();
        let timer = setInterval(() => {
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
        document.getElementById(`cards_${i}`).style.visibility = "hidden";
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

    // Update cards.
    client.player_cards_list = [];
    for (let i: number = 0; i < players.length; ++i) {
        let facility_ids: FacilityId[] = session.getPlayerCards(i).getHand();
        client.player_cards_list.push(facility_ids);
        for (let j: number = 0; j < Math.min(10, facility_ids.length); ++j) {
            let facility: Facility = session.getFacility(facility_ids[j]);
            document.getElementById(`card_${i}_${j}`).style.visibility = "visible";
            document.getElementById(`card_${i}_${j}_name`).innerText = facility.getName();
            document.getElementById(`card_${i}_${j}_cost`).innerText = String(facility.getCost());
            document.getElementById(`card_${i}_${j}`).style.backgroundColor = getFacilityColor(facility);
        }
        for (let j: number = Math.min(10, facility_ids.length); j < 10; ++j) {
            document.getElementById(`card_${i}_${j}`).style.visibility = "hidden";
        }
    }
    client.resetCards();  // Nice to check if built or not?
}

function onClickField(x, y): void {
    console.log(`clicked: field_${x}_${y}`);
    if (client.clicked_facility_id < 0) {
        return;
    }
    HttpRequest.Send(
        `/build?player_id=${_hack_player_id}&x=${x}&y=${y}&facility_id=${client.clicked_facility_id}`,
        callbackSession);
}

function onClickDice(dice_num: number, aim: number): void {
    console.log(`clicked: dice_num:${dice_num}, aim:${aim}`);
    HttpRequest.Send(`/dice?player_id=${_hack_player_id}&dice_num=${dice_num}&aim=${aim}`,
        callbackSession);
}

function initBoard(column: number = 12, row: number = 5): void {
    // Add click listeners.
    for (let y: number = 0; y < row; ++y) {
        for (let x: number = 0; x < column; ++x) {
            document.getElementById(`field_${x}_${y}`).addEventListener(
                "click", () => { onClickField(x, y); });
        }
    }

    // Dices
    document.getElementById("dice_1").addEventListener(
        "click", () => { onClickDice(1, 0); });
    document.getElementById("dice_2").addEventListener(
        "click", () => { onClickDice(2, 0); });

    // Cards
    let player_size: number = 4;
    let card_size: number = 10;
    for (let p: number = 0; p < player_size; ++p) {
        for (let c: number = 0; c < card_size; ++c) {
            document.getElementById(`card_${p}_${c}`).addEventListener(
                "click", () => { client.onClickCard(p, c); });
        }
    }
}

initBoard();
HttpRequest.Send("/board", callbackSession);
