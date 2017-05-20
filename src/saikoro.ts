import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility } from "./facility";
import { Dice, DiceResult } from "./dice";
import { HtmlView } from "./html_view";

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

export class WebClient {
    public session: Session = new Session();
    public session_id: number = 0;
    public matching_id: number = 0;
    public player_id: PlayerId = 0;
    // TODO: user_id should be unique.
    public user_id: string = String(Math.floor(Math.random() * 1000000));
    public step: number = 0;
    public callback: (response: string) => void;
    public no_update_count: number = 0;
    private view: HtmlView;

    public update_listener: UpdateListener;
    public request_handler: RequestHandler;

    constructor(update_listener: UpdateListener, request_handler: RequestHandler) {
        this.update_listener = update_listener;
        this.request_handler = request_handler;
        this.view = new HtmlView(this);
        this.callback = this.callbackSession.bind(this);
    }

    public buildFacility(x: number, y: number, card_id: CardId): void {
        let request = {
            command: "build",
            session_id: this.session_id,
            player_id: this.player_id,
            x: x,
            y: y,
            card_id: card_id,
        };
        this.request_handler.sendRequest(request, this.callback);
    }

    public rollDice(dice_num: number, aim: number): void {
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

    public endTurn(): void {
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

    public initBoard(): void {
        this.view.initView();
        document.getElementById("matching_button").addEventListener(
            "click", () => { this.onClickMatching(); });
        document.getElementById("game").style.visibility = "hidden";
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

        let phase: Phase = session.getPhase();
        if (phase == Phase.EndGame) {
            this.update_listener.stopCheckUpdate();
        }

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

        this.view.updateView(session, this.user_id);
    }
}

// let update_listener: UpdateListener = new FirebaseUpdateListener();
// let request_handler: RequestHandler = new FirebaseRequestHandler();
let update_listener: UpdateListener = new HttpUpdateListener();
let request_handler: RequestHandler = new HttpRequestHandler();

let client: WebClient = new WebClient(update_listener, request_handler);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
