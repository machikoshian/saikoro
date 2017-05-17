import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility } from "./facility";
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

abstract class RequestHandler {
    abstract sendRequest(json: any, callback: (response: string) => void): void;
}

class HttpRequestHandler extends RequestHandler {
    constructor() {
        super();
    }

    public sendRequest(json: any, callback: (response: string) => void): void {
        let params: string = Object.keys(json).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]); }).join("&");
        let url: string;
        if (json.command === "matching") {
            url = "/matching?" + params;
        }
        else {
            url = "/command?" + params;
        }
        HttpRequest.Send(url, callback);
    }
}

abstract class UpdateListener {
    abstract startCheckUpdate(client: WebClient): void;
    abstract stopCheckUpdate(): void;
    abstract checkUpdate(client: WebClient): void;
}

let firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDRJc2z_Ux19YdyhvMSEv5yK41rAPTrCPo",
    authDomain: "saikoro-5a164.firebaseapp.com",
    databaseURL: "https://saikoro-5a164.firebaseio.com",
    projectId: "saikoro-5a164",
    storageBucket: "saikoro-5a164.appspot.com",
    messagingSenderId: "636527675008"
};
firebase.initializeApp(config);

class FirebaseUpdateListener extends UpdateListener {
    private ref: any;

    constructor() {
        super();
    }

    public startCheckUpdate(client: WebClient): void {
        let session_key = "session_" + client.session_id;
        this.ref = firebase.database().ref("session").child(session_key);
        this.ref.on("value", (snapshot) => {
            let value = snapshot.val();
            if (!value) {
                return;
            }
            console.log(value);
            client.callback(value);
        });
    }
    public stopCheckUpdate(): void {
        this.ref.off();
    }
    public checkUpdate(client: WebClient): void {
        // Do nothing.
    }
}

class FirebaseRequestHandler extends RequestHandler {
    constructor() {
        super();
    }

    public sendRequest(json: any, callback: (response: string) => void): void {
        let path: string;
        if (json.command === "matching") {
            path = "matching";
            if (!json.user_id) {
                return;
            }
            let ref_matched = firebase.database().ref("matched").child(json.user_id);
            ref_matched.on("value", (snapshot) => {
                let value = snapshot.val();
                if (!value) {
                    return;
                }
                callback(JSON.stringify(value));
            });
        }
        else {
            path = "command";
        }

        let ref = firebase.database().ref(path);
        ref.push(json);
    }
}

class HttpUpdateListener extends UpdateListener {
    public check_update_timer: any = 0;  // Timer

    public startCheckUpdate(client: WebClient): void {
        this.check_update_timer = setInterval(() => { this.checkUpdate(client) }, 2000);
    }
    public stopCheckUpdate(): void {
        clearInterval(this.check_update_timer);
    }
    public checkUpdate(client: WebClient): void {
        console.log(`checkUpdate(${client.step})`);
        let request = {
            command: "board",
            session_id: client.session_id,
            player_id: client.player_id,
            step: client.step,
        };
        client.request_handler.sendRequest(request, client.callback);
    }
}

class WebClient {
    public session: Session = new Session();
    public session_id: number = 0;
    public matching_id: number = 0;
    public player_id: PlayerId = 0;
    // TODO: user_id should be unique.
    public user_id: string = String(Math.floor(Math.random() * 1000000));
    public step: number = 0;
    public clicked_card_id: CardId = -1;
    public clicked_card_element: HTMLElement = null;
    public player_cards_list: CardId[][] = [];
    public callback: (response: string) => void;
    public no_update_count: number = 0;
    private money_animation_timers = [null, null, null, null];

    public update_listener: UpdateListener;
    public request_handler: RequestHandler;

    constructor(update_listener: UpdateListener, request_handler: RequestHandler) {
        this.update_listener = update_listener;
        this.request_handler = request_handler;
        this.callback = this.callbackSession.bind(this);
    }

    public diceResultMessage(dice: DiceResult): string {
        let faces: string[] = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

        let d1: number = dice.dice1;
        let d2: number = dice.dice2;
        return `${faces[d1]} ${faces[d2]} : ${d1 + d2} でした。`;
    }

    public getPlayerColor(player_id: PlayerId): string {
        // TODO: Support landmark colors (set / built).
        let colors = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];

        if (player_id === -1 || player_id > colors.length) {
            return "#EFF0D1";
        }
        return colors[player_id];
    }

    public getFacilityColor(facility: Facility): string {
        if (!facility) {
            return "#EFF0D1";
        }
        let type: FacilityType = facility.type;
        switch(type) {
            case FacilityType.Gray:
                return "#B0BEC5";
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

    public resetCards(): void {
        if (this.clicked_card_element) {
            this.clicked_card_element.style.borderColor = "#EEEEEE";
            this.clicked_card_element = null;
        }
        this.clicked_card_id = -1;
    }

    public onClickField(x, y): void {
        console.log(`clicked: field_${x}_${y}`);
        if (this.clicked_card_id < 0) {
            return;
        }
        let request = {
            command: "build",
            session_id: this.session_id,
            player_id: this.player_id,
            x: x,
            y: y,
            card_id: this.clicked_card_id,
        };
        this.request_handler.sendRequest(request, this.callback);
    }

    public onClickDice(dice_num: number, aim: number): void {
        console.log(`clicked: dice_num:${dice_num}, aim:${aim}`);
        let request = {
            command: "dice",
            session_id: this.session_id,
            player_id: this.player_id,
            dice_num: dice_num,
            aim: aim,
        };
        this.request_handler.sendRequest(request, this.callback);
    }

    public onClickEndTurn(): void {
        console.log("clicked: end_turn");
        let request = {
            command: "build",
            session_id: this.session_id,
            player_id: this.player_id,
            x: -1,
            y: -1,
            card_id: -1,
        };
        this.request_handler.sendRequest(request, this.callback);
    }

    public onClickCard(player: number, card: number): void {
        if (this.session.getPhase() !== Phase.BuildFacility) {
            return;
        }

        console.log(`clicked: card_${player}_${card}`);
        this.resetCards();
        this.clicked_card_element = document.getElementById(`card_${player}_${card}`);
        this.clicked_card_element.style.borderColor = "#FFE082";
        this.clicked_card_id = this.player_cards_list[player][card];

        this.updateBoard(this.session);

        let x: number = this.session.getFacility(this.clicked_card_id).getArea() - 1;
        for (let y: number = 0; y < 5; y++) {
            let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
            // TODO: Keep the owner's color too.
            field.style.backgroundColor = "#FFF176";
        }
    }

    public onClickLandmark(card: number): void {
        if (this.session.getPhase() !== Phase.BuildFacility) {
            return;
        }

        console.log(`clicked: landmark_${card}`);

        let clicked_card_id: CardId = this.session.getLandmarks()[card];
        if (this.session.getOwnerId(clicked_card_id) !== -1) {
            return;
        }

        this.resetCards();
        this.clicked_card_element = document.getElementById(`landmark_${card}`);
        this.clicked_card_element.style.borderColor = "#FFE082";
        this.clicked_card_id = clicked_card_id;

        this.updateBoard(this.session);

        let [x, y] = this.session.getPosition(this.clicked_card_id);
        document.getElementById(`field_${x}_${y}`).style.backgroundColor = "#FFF176";
    }

    public callbackMatching(response: string): void {
        const response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.matching_id = response_json.matching_id;

        document.getElementById("matching").style.display = "none";
        document.getElementById("game").style.visibility = "visible";

        this.update_listener.checkUpdate(this);
        this.update_listener.startCheckUpdate(this);
    }

    public onClickMatching(): void {
        console.log("matching...");
        let name: string = (<HTMLInputElement>document.getElementById("matching_name")).value;
        if (name.length === 0) {
            return;
        }
        let request = {
            command: "matching",
            name: name,
            user_id: this.user_id,
        };
        this.request_handler.sendRequest(request, this.callbackMatching.bind(this));
    }

    public initBoard(column: number = 12, row: number = 5): void {
        // Add click listeners.
        for (let y: number = 0; y < row; ++y) {
            for (let x: number = 0; x < column; ++x) {
                document.getElementById(`field_${x}_${y}`).addEventListener(
                    "click", () => { this.onClickField(x, y); });
            }
        }

        // Dices
        document.getElementById("dice_1").addEventListener(
            "click", () => { this.onClickDice(1, 0); });
        document.getElementById("dice_2").addEventListener(
            "click", () => { this.onClickDice(2, 0); });

        // End turn
        document.getElementById("end_turn").addEventListener(
            "click", () => { this.onClickEndTurn(); });

        // Cards
        let player_size: number = 4;
        let card_size: number = 10;
        for (let p: number = 0; p < player_size; ++p) {
            for (let c: number = 0; c < card_size; ++c) {
                document.getElementById(`card_${p}_${c}`).addEventListener(
                    "click", () => { this.onClickCard(p, c); });
            }
        }

        // Landmark cards
        let landmark_size: number = 5;
        for (let l: number = 0; l < landmark_size; ++l) {
            document.getElementById(`landmark_${l}`).addEventListener(
                "click", () => { this.onClickLandmark(l); });
        }

        document.getElementById("matching_button").addEventListener(
            "click", () => { this.onClickMatching(); });
        document.getElementById("game").style.visibility = "hidden";

        document.getElementById("money_motion").style.visibility = "hidden";
    }

    private updateBoard(session: Session): void {
        let board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                let facility: Facility = session.getFacilityOnBoard(x, y);
                let name: string = facility ? facility.getName() : "";
                let owner_id: PlayerId = session.getOwnerIdOnBoard(x, y);

                let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
                field.innerText = name;
                if (facility && facility.getType() === FacilityType.Gray && owner_id === -1) {
                    field.style.backgroundColor = this.getFacilityColor(facility);
                }
                else {
                    field.style.backgroundColor = this.getPlayerColor(owner_id);
                }
                field.style.borderColor = this.getFacilityColor(facility);
            }
        }
    }

    // Do not directly call this method.
    // Use this.callback as a wrapper of this method.
    private callbackSession(response: string): void {
        if (!response) {
            console.log("Stop polling.");
            this.update_listener.stopCheckUpdate();
        }

        // If the response is "{}", the server does not have any update.
        if (response === "{}") {
            console.log("Already updated.");

            // If no update continues 100 times, stop polling.
            this.no_update_count++;
            if (this.no_update_count > 100) {
                console.log("No update for a while.");
                this.update_listener.stopCheckUpdate();
            }
            return;
        }

        this.no_update_count = 0;

        let session: Session = Session.fromJSON(JSON.parse(response));

        this.showEvents(session);

        this.session = session;
        let player_id: PlayerId = session.getCurrentPlayerId();
        this.player_id = player_id;
        let step: number = session.getStep();
        console.log(step);
        if (step == this.step) {
            console.log("Already updated.");
            return;
        }
        this.step = step;

        // Update board.
        this.updateBoard(session);

        // Update players.
        let players: Player[] = session.getPlayers();
        for (let i: number = 0; i < players.length; ++i) {
            let player: Player = players[i];
            document.getElementById(`player_${i}`).style.visibility = "visible";
            document.getElementById(`player_${i}_name`).innerText = player.name;

            let money_element = document.getElementById(`player_${i}_money`);
            let money: number = player.getMoney();

            if (this.money_animation_timers[i]) {
                clearInterval(this.money_animation_timers[i]);
            }
            this.money_animation_timers[i] = setInterval(() => {
                let current_money = Number(money_element.innerText);
                if (current_money == money) {
                    clearInterval(this.money_animation_timers[i]);
                    this.money_animation_timers[i] = null;
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

            document.getElementById(`player_${i}_salary`).innerHTML = `${player.salary}`;
            let cards: PlayerCards = session.getPlayerCards(i);
            document.getElementById(`player_${i}_talon`).innerHTML =
                `${cards.getHandSize()}　／　📇 ${cards.getTalonSize()}`;

            if (player.user_id === this.user_id) {
                document.getElementById(`cards_${i}`).style.display = "table-row";
            }
            else {
                document.getElementById(`cards_${i}`).style.display = "none";
            }

        }
        for (let i: number = players.length; i < 4; ++i) {
            document.getElementById(`player_${i}`).style.visibility = "hidden";
            document.getElementById(`cards_${i}`).style.display = "none";
        }

        // Update message.
        let current_player: Player = players[player_id];
        let name: string = current_player.name;
        let message: string = "";
        let phase: Phase = session.getPhase();
        if (phase == Phase.StartGame) {
            message = `🎲 マッチング中です 🎲`;
        }
        else if (phase == Phase.DiceRoll) {
            message = `🎲 ${name} のサイコロです 🎲`;
        }
        else if (phase == Phase.BuildFacility) {
            message = this.diceResultMessage(session.getDiceResult());
            message += `  🎲 ${name} の建設です 🎲`;
        }
        else if (phase == Phase.EndGame) {
            let winner: string = session.getPlayer(session.getWinner()).name;
            message = `🎲 ${name} の勝ちです 🎲`;
            this.update_listener.stopCheckUpdate();
        }
        document.getElementById("message").innerText = message;
        document.getElementById("message").style.backgroundColor = this.getPlayerColor(player_id);

        // Update buttons.
        if (current_player.user_id === this.user_id) {
            document.getElementById("dice").style.display = "";
        }
        else {
            document.getElementById("dice").style.display = "none";
        }

        if (phase == Phase.DiceRoll) {
            document.getElementById("dice_1").style.visibility = "visible";
            document.getElementById("dice_2").style.visibility = "visible";
        }
        else {
            document.getElementById("dice_1").style.visibility = "hidden";
            document.getElementById("dice_2").style.visibility = "hidden";
        }

        if (phase == Phase.BuildFacility) {
            document.getElementById("end_turn").style.visibility = "visible";
        }
        else {
            document.getElementById("end_turn").style.visibility = "hidden";
        }

        // Update cards.
        this.player_cards_list = [];
        const area_name: string[] =
            ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫"];
        for (let i: number = 0; i < players.length; ++i) {
            let card_ids: CardId[] = session.getSortedHand(i);
            this.player_cards_list.push(card_ids);
            for (let j: number = 0; j < Math.min(10, card_ids.length); ++j) {
                let facility: Facility = session.getFacility(card_ids[j]);
                document.getElementById(`card_${i}_${j}`).style.display = "table-cell";
                document.getElementById(`card_${i}_${j}_name`).innerText =
                    `${area_name[facility.getArea()]} ${facility.getName()}`;
                document.getElementById(`card_${i}_${j}_cost`).innerText = String(facility.getCost());
                document.getElementById(`card_${i}_${j}_description`).innerText = facility.getDescription();
                document.getElementById(`card_${i}_${j}`).style.backgroundColor =
                    this.getFacilityColor(facility);
            }
            for (let j: number = Math.min(10, card_ids.length); j < 10; ++j) {
                document.getElementById(`card_${i}_${j}`).style.display = "none";
            }
        }

        // Update landmarks.
        let card_ids: CardId[] = session.getLandmarks();
        this.player_cards_list.push(card_ids);
        for (let j: number = 0; j < Math.min(5, card_ids.length); ++j) {
            let facility: Facility = session.getFacility(card_ids[j]);
            document.getElementById(`landmark_${j}`).style.display = "table-cell";
            document.getElementById(`landmark_${j}_name`).innerText = facility.getName();
            document.getElementById(`landmark_${j}_cost`).innerText = String(facility.getCost());
            document.getElementById(`landmark_${j}_description`).innerText = facility.getDescription();
            let owner_id: PlayerId = this.session.getOwnerId(card_ids[j]);
            if (owner_id === -1) {
                document.getElementById(`landmark_${j}`).style.backgroundColor =
                    this.getFacilityColor(facility);
            } else {
                document.getElementById(`landmark_${j}`).style.backgroundColor =
                    this.getPlayerColor(owner_id);
            }
        }
        for (let j: number = Math.min(5, card_ids.length); j < 5; ++j) {
            document.getElementById(`landmark_${j}`).style.display = "none";
        }

        this.resetCards();  // Nice to check if built or not?
    }

    private showEvents(session: Session): void {
        let events: Event[] = session.getEvents();
        if (events.length === 0) {
            return;
        }

        for (let event of events) {
            let player_id: PlayerId = -1;
            let [x, y]: [number, number] = session.getPosition(event.card_id);

            for (let i = 0; i < event.moneys.length; i++) {
                let money: number = event.moneys[i];
                if (money > 0) {
                    effectMoneyMotion(`field_${x}_${y}`, `player_${i}_money`, money);
                }
                else if (event.moneys[i] < 0) {
                    effectMoneyMotion(`player_${i}_money`, `field_${x}_${y}`, money);
                }
            }
        }
    }
}

function effectMoneyMotion(elementFrom: string, elementTo: string, money: number): void {
    // Animation.
    let new_node: Node = document.getElementById("money_motion").cloneNode(true);
    let money_motion: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
    let element_from: HTMLElement = document.getElementById(elementFrom);
    let rect_from = element_from.getBoundingClientRect();
    let element_to: HTMLElement = document.getElementById(elementTo);
    let rect_to = element_to.getBoundingClientRect();
    let diff_x: number = rect_to.left - rect_from.left;
    let diff_y: number = rect_to.top - rect_from.top;

    money_motion.innerHTML += String(money);
    money_motion.style.visibility = "visible";
    money_motion.style.zIndex = "2";
    money_motion.style.position = "absolute";
    money_motion.style.width = "40px";
    money_motion.style.height = "40px";
    money_motion.style.top = rect_from.top + "px";
    money_motion.style.left = rect_from.left + "px";

    money_motion.style.transitionDuration = "1s";
    money_motion.style.transform = `translate(${diff_x}px, ${diff_y}px)`;

    window.setTimeout(() => {
        document.body.removeChild(money_motion);
    }, 1500);
}

let update_listener: UpdateListener = new FirebaseUpdateListener();
let request_handler: RequestHandler = new FirebaseRequestHandler();
// let update_listener: UpdateListener = new HttpUpdateListener();
// let request_handler: RequestHandler = new HttpRequestHandler();

let client: WebClient = new WebClient(update_listener, request_handler);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
