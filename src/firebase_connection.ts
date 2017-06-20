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
    private ref_command: any;
    private ref_map: {} = {};
    private session_key: string;

    constructor() {
        super();
        this.ref_command = firebase.database().ref("command");
    }

    public startCheckValue(key: string, callback: (value) => void): void {
        let ref = firebase.database().ref(key);
        ref.on("value", (snapshot) => {
            let value = snapshot.val();
            if (!value) {
                return;
            }
            callback(value);
        });
        this.ref_map[key] = ref;
    }
    public stopCheckValue(key: string): void {
        this.ref_map[key].off();
    }

    public startCheckUpdate(client: Client): void {
        this.session_key = `/session/session_${client.session_id}`;
        this.startCheckValue(this.session_key, (value) => { client.callback(value); });
    }
    public stopCheckUpdate(): void {
        this.stopCheckValue(this.session_key);
    }

    public matching(query: any, callback: RequestCallback): void {
        if (!query.user_id) {
            return;
        }
        let ref_matched = firebase.database().ref("matched").child(query.user_id);
        ref_matched.on("value", (snapshot) => {
            let value = snapshot.val();
            if (!value) {
                return;
            }
            callback(JSON.stringify(value));
        });
        firebase.database().ref("matching").push(query);
    }

    public setQueryOnDisconnect(query: any): void {
        this.ref_command.child(query.user_id).onDisconnect().set(query);
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        this.ref_command.child(query.user_id).set(query);
    }

    public getLiveSessions(callback: RequestCallback): void {
        let ref = firebase.database().ref("live");
        ref.once("value", (snapshot) => {
            let keys: number[] = [];
            snapshot.forEach((childSnapshot) => {
                keys.push(Number(childSnapshot.key.substr("session_".length)));
            });
            callback(JSON.stringify(keys));
        });
    }
}
