import { KeyValue, Memcache, MemcacheMock, MatchedData, SessionHandler } from "./session_handler";
import { FirebaseMemcache, FirebaseServer } from "./firebase_server";

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


const mc = new MemcacheMock();
// const mc = new MemcacheServer("localhost:11211");
// const mc = new FirebaseMemcache();

let session_handler: SessionHandler = new SessionHandler(mc);

let main_http: HttpServer = new HttpServer(session_handler);
main_http.run();
// let main_firebase: FirebaseServer = new FirebaseServer(session_handler);
// main_firebase.run();
