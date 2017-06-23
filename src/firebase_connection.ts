import { RequestCallback, Connection, Client } from "./client";

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

export class FirebaseConnection extends Connection {
    private ref: any;
    private ref_command: any = null;
    private ref_session: any = null;
    private ref_matched: any = null;
    private ref_live: any = null;
    private ref_map: {} = {};
    private session_key: string;

    constructor() {
        super();
        this.ref_command = firebase.database().ref("command");
    }

    public startCheckValue(key: string, callback: (snapshot) => void): void {
        let ref = firebase.database().ref(key);
        ref.on("value", (snapshot) => {
            callback(snapshot);
        });
        this.ref_map[key] = ref;
    }
    public stopCheckValue(key: string): void {
        if (this.ref_map[key]) {
            this.ref_map[key].off();
        }
    }

    public startCheckUpdate(client: Client): void {
        this.ref_session = firebase.database().ref(`session/session_${client.session_id}`);
        this.ref_session.on("value", (snapshot) => {
            let value = snapshot.val();
            if (!value) {
                return;
            }
            client.callback(value);
        });
    }
    public stopCheckUpdate(): void {
        if (this.ref_session) {
            this.ref_session.off();
        }
        this.ref_session = null;
    }

    public matching(query: any, callback: RequestCallback): void {
        if (!query.user_id) {
            return;
        }
        this.ref_matched = firebase.database().ref(`matched/${query.user_id}`);
        this.ref_matched.on("value", (snapshot) => {
            let value = snapshot.val();
            if (!value) {
                return;
            }
            callback(JSON.stringify(value));
        });
        firebase.database().ref(`/matching/${query.user_id}`).set(query);
    }
    public stopCheckMatching(): void {
        if (this.ref_matched) {
            this.ref_matched.off();
        }
        this.ref_matched = null;
    }

    public setQueryOnDisconnect(query: any): void {
        this.ref_command.child(query.user_id).onDisconnect().set(query);
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        this.ref_command.child(query.user_id).set(query);
    }

    public startCheckLive(callback: RequestCallback): void {
        this.ref_live = firebase.database().ref("live");
        this.ref_live.on("value", (snapshot) => {
            let value = snapshot.val();
            if (!value) {
                return;
            }
            callback(JSON.stringify(value));
        });
    }
    public stopCheckLive(): void {
        if (this.ref_live) {
            this.ref_live.off();
        }
        this.ref_live = null;
    }
}
