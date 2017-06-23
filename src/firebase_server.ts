import { MatchedData, SessionHandler } from "./session_handler";
import { KeyValue, Storage } from "./storage";

// Firebase
let firebase_admin = require("firebase-admin");
let service_account = require("./serviceAccountKey.json");  // This file is private.

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(service_account),
    databaseURL: "https://saikoro-5a164.firebaseio.com/",
    databaseAuthVariableOverride: {
        uid: "saikoro-server",
    }
});

export class FirebaseStorage extends Storage {
    public get(key: string, callback: (err: any, value: any) => void): void {
        let db = firebase_admin.database();
        db.ref(key).once('value').then((snapshot) => {
            callback(null, snapshot.val());
        });
    }

    public getWithPromise(key: string): Promise<KeyValue> {
        let db = firebase_admin.database();
        return db.ref(key).once('value').then((snapshot) => {
            return new KeyValue(key, snapshot.val());
        });
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        let db = firebase_admin.database();
        db.ref(key).set(value).then((unused) => { callback(null); });
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        let db = firebase_admin.database();
        return db.ref(key).set(value).then((snapshot) => {
            return new KeyValue(key, value);
        });
    }

    public delete(key: string): void {
        let db = firebase_admin.database();
        db.ref(key).set(null);
    }
}

export class FirebaseServer {
    private db;
    private ref_matched;
    private ref_matching;
    private ref_command;
    private session_handler: SessionHandler;

    constructor(session_handler: SessionHandler) {
        this.session_handler = session_handler;
        this.db = firebase_admin.database();
        this.ref_matched = this.db.ref("matched");
        this.ref_matching = this.db.ref("matching");
        this.ref_command = this.db.ref("command");
    }

    public onMatching(data): Promise<KeyValue> {
        let user_id: string = data.val().user_id;
        this.ref_matching.child(user_id).set(null);
        return this.session_handler.handleMatching(data.val());
    }

    public onCommand(data): Promise<{}> {
        return this.session_handler.handleCommand(data.val()).then((session_data) => {
            let session_string = session_data.value;
            let promises: Promise<{}>[] = [];

            if (session_string !== "{}") {
                // session_data.key looks like /session/session_10
                promises.push(this.db.ref(session_data.key).set(session_string));
            }
            // Delete handled event.
            promises.push(this.ref_command.child(data.key).set(null));
            return Promise.all(promises);
        });
    }

    public run() {
        // matching
        this.ref_matching.on("child_added", (data) => {
            return this.onMatching(data);
        });

        // command
        this.ref_command.on("child_added", (data) => {
            return this.onCommand(data);
        });
    }
}
