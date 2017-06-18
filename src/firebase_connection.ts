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

    constructor() {
        super();
    }

    public startCheckUpdate(client: Client): void {
        let session_key = `session_${client.session_id}`;
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

    public sendRequest(json: any, callback: RequestCallback): void {
        firebase.database().ref("command").push(json);
    }

    public getLiveSessions(callback: RequestCallback): void {
        let ref = firebase.database().ref("live");
        ref.once("value", (snapshot) => {
            let keys: number[] = [];
            snapshot.forEach((childSnapshot) => {
                keys.push(childSnapshot.key);
            });
            callback(JSON.stringify(keys));
        });
    }
}
