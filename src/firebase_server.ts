import { KeyValue, Storage, MatchedData, SessionHandler } from "./session_handler";

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
        let ref_memcache = db.ref("memcache").child(key);
        ref_memcache.once('value').then((snapshot) => {
            callback(null, snapshot.val());
        });
    }

    public getWithPromise(key: string): Promise<KeyValue> {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        return ref_memcache.once('value').then((snapshot) => {
            return new KeyValue(key, snapshot.val());
        });
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        ref_memcache.set(value).then((unused) => { callback(null); });
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        let db = firebase_admin.database();
        let ref_memcache = db.ref("memcache").child(key);
        return ref_memcache.set(value).then((snapshot) => {
            return new KeyValue(key, value);
        });
    }
}

export class FirebaseServer {
    private db;
    private ref_session;
    private ref_matched;
    private ref_matching;
    private ref_command;
    private session_handler: SessionHandler;

    constructor(session_handler: SessionHandler) {
        this.session_handler = session_handler;
        this.db = firebase_admin.database();
        this.ref_session = this.db.ref("session");
        this.ref_matched = this.db.ref("matched");
        this.ref_matching = this.db.ref("matching");
        this.ref_command = this.db.ref("command");
    }

    public onMatching(data): Promise<{}> {
        let user_id: string = data.val().user_id;

        return this.session_handler.handleMatching(data.val()).then((matched: MatchedData) => {
            return Promise.all([
                this.ref_session.child(`session_${matched.session_id}`).set(matched.session_string),
                this.ref_matched.child(user_id).set({ matching_id: matched.matching_id,
                                                        player_id: matched.player_id,
                                                       session_id: matched.session_id }),
                // Delete handled event.
                this.ref_matching.child(data.key).set(null)
            ]);
        });
    }

    public onCommand(data): Promise<{}> {
        return this.session_handler.handleCommand(data.val()).then((session_data) => {
            let session_string = session_data.value;
            let promises: Promise<{}>[] = [];

            if (session_string !== "{}") {
                promises.push(this.ref_session.child(session_data.key).set(session_string));
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
