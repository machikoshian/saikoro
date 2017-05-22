import { RequestCallback, RequestHandler, UpdateListener, Client } from "./client";
import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility } from "./facility";
import { Dice, DiceResult } from "./dice";
import { HtmlView } from "./html_view";

class HttpRequest {
    static Send(url: string, callback: RequestCallback) {
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

export class HttpUpdateListener extends UpdateListener {
    public check_update_timer: any = 0;  // Timer

    public startCheckUpdate(client: Client): void {
        this.check_update_timer = setInterval(() => { this.checkUpdate(client) }, 2000);
    }
    public stopCheckUpdate(): void {
        clearInterval(this.check_update_timer);
    }
    public checkUpdate(client: Client): void {
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

export class HttpRequestHandler extends RequestHandler {
    constructor() {
        super();
    }

    public sendRequest(json: any, callback: RequestCallback): void {
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

export class FirebaseUpdateListener extends UpdateListener {
    private ref: any;

    constructor() {
        super();
    }

    public startCheckUpdate(client: Client): void {
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
    public checkUpdate(client: Client): void {
        // Do nothing.
    }
}

export class FirebaseRequestHandler extends RequestHandler {
    constructor() {
        super();
    }

    public sendRequest(json: any, callback: RequestCallback): void {
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

// TODO: can be merged with Client?
export class WebClient extends Client {
    private no_update_count: number = 0;
    private view: HtmlView;
    public callback: RequestCallback;

    constructor(update_listener: UpdateListener,
                request_handler: RequestHandler) {
        super(update_listener, request_handler);
        this.callback =  this.callbackSession.bind(this);
        this.view = new HtmlView(this);
    }

    public initBoard(): void {
        this.view.initView();
    }

    public startMatching(name: string): void {
        console.log("matching...");
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

    private callbackMatching(response: string): void {
        const response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.matching_id = response_json.matching_id;

        this.update_listener.checkUpdate(this);
        this.update_listener.startCheckUpdate(this);
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

        if (session.getPhase() === Phase.EndGame) {
            this.update_listener.stopCheckUpdate();
        }

        this.player_id = session.getCurrentPlayerId();

        let step: number = session.getStep();
        console.log(step);
        if (step === this.step) {
            console.log("Already updated.");
            return;
        }
        this.step = step;

        this.view.updateView(session, this.user_id);
    }
}
