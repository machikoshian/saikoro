import { KeyValue, Memcache, MatchedData, SessionHandler } from "./session_handler";

// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

// Set DEBUG mode if specified.
let DEBUG: string = process.env.DEBUG || "";

// Source map support.
if (DEBUG) {
    require("source-map-support").install();
}

class MemcacheServer extends Memcache {
    private memcache;

    constructor(url: string = "") {
        super();
        const memjs = require("memjs");
        if (url) {
            // Do nothing.
        }
        else if (process.env.MEMCACHE_URL) {
            url = process.env.MEMCACHE_URL;
        }
        else if (process.env.USE_GAE_MEMCACHE) {
            url = `${process.env.GAE_MEMCACHE_HOST}:${process.env.GAE_MEMCACHE_PORT}`;
        }
        this.memcache = memjs.Client.create(url);
    }

    public get(key: string, callback: (err: any, value: any) => void): void {
        this.memcache.get(key, callback);
    }

    public getWithPromise(key: string): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            this.memcache.get(key, (err, value) => {
                resolve(new KeyValue(key, value));
            });
        });
    }

    public set(key: string, value: any, callback: (err: any) => void, expire: number): void {
        this.memcache.set(key, value, callback, expire);
    }

    public setWithPromise(key: string, value: any): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            this.memcache.set(key, value, (err, value) => {
                resolve(new KeyValue(key, value));
            }, 600);
        });
    }
}

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

class FirebaseMemcache extends Memcache {
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

class FirebaseServer {
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

        return this.session_handler.handleMatching(data.val().name, user_id).then(
                (matched: MatchedData) => {
            return Promise.all([
                this.ref_session.child(`session_${matched.session_id}`).set(matched.session_string),
                this.ref_matched.child(user_id).set({ matching_id: matched.matching_id,
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


class HttpServer {
    private server;
    private session_handler: SessionHandler;

    constructor(session_handler: SessionHandler) {
        this.session_handler = session_handler;
        this.server = http.createServer();
    }

    public run() {
        this.server.on("request", (request, response) => this.requestHandler(request, response));
        this.server.listen(process.env.PORT || 3156);
        console.log(`Port: ${process.env.PORT || 3156}`);
    }

    private serveStaticFiles(pathname: string, response): void {
        if (pathname == "/") {
            pathname = "/saikoro.html";
        }

        let filepath: string = "./out/client" + pathname;
        fs.stat(filepath, function (error, stat) {  // can use readFile only?
            if (error == null) {
                fs.readFile(filepath, "utf8", function (error, output) {
                    response.end(output);
                });
            }
            else {
                response.end(pathname);
            }
        });
        return;
    }

    private requestHandler(request, response): void {
        let url_parts = url.parse(request.url, true);
        let pathname: string = url_parts.pathname;
        let query = url_parts.query;

        if (pathname == "/env") {
            let output: string = "";
            output += `MEMCACHE_URL: ${process.env.MEMCACHE_URL}\n`;
            output += `USE_GAE_MEMCACHE: ${process.env.USE_GAE_MEMCACHE}\n`;
            output += `GAE_MEMCACHE_HOST: ${process.env.GAE_MEMCACHE_HOST}\n`;
            output += `GAE_MEMCACHE_PORT: ${process.env.GAE_MEMCACHE_PORT}\n`;
            response.end(output);
            return;
        }

        if (pathname == "/command") {
            this.session_handler.handleCommand(query).then((data: KeyValue) => {
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(data.value);
            });
            return;
        }

        if (pathname == "/matching") {
            this.session_handler.handleMatching(query.name, query.user_id).then(
                    (matched: MatchedData) => {
                response.end(JSON.stringify({ matching_id: matched.matching_id,
                                              session_id: matched.session_id }));
                console.log(matched.session_string);
            });
            return;
        }

        this.serveStaticFiles(pathname, response);
    }
}


// const mc = new MemcacheMock();
// const mc = new MemcacheServer("localhost:11211");
const mc = new FirebaseMemcache();

let session_handler: SessionHandler = new SessionHandler(mc);

let main_http: HttpServer = new HttpServer(session_handler);
main_http.run();
let main_firebase: FirebaseServer = new FirebaseServer(session_handler);
main_firebase.run();
