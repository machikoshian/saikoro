import { MatchedData, SessionHandler } from "./session_handler";
import { KeyValue, Storage, LocalStorage } from "./storage";

// Moduiles from Node.js
import * as http from "http";
import * as url from "url";
import * as fs from "fs";

export class MemcacheStorage extends Storage {
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

    public delete(key: string): void {
        this.memcache.delete(key, null);
    }

    public deleteWithPromise(key: string): Promise<KeyValue> {
        return new Promise<KeyValue>((resolve, reject) => {
            this.memcache.delete(key, (err, value) => {
                resolve(new KeyValue(key, null));
            }, 600);
        });
    }
}

export class GameInformation {
    public session_id: number;
    public title: string;
    //public mode: GameMode;
}

export class HttpServer {
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
        if (pathname === "/") {
            pathname = "/index.html";
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
        let query: any = url_parts.query;

        if (pathname === "/env") {
            let output: string = "";
            output += `MEMCACHE_URL: ${process.env.MEMCACHE_URL}\n`;
            output += `USE_GAE_MEMCACHE: ${process.env.USE_GAE_MEMCACHE}\n`;
            output += `GAE_MEMCACHE_HOST: ${process.env.GAE_MEMCACHE_HOST}\n`;
            output += `GAE_MEMCACHE_PORT: ${process.env.GAE_MEMCACHE_PORT}\n`;
            response.end(output);
            return;
        }

        if (pathname === "/data") {
            if (query.command === "set") {
                let value: any = JSON.parse(query.value);
                this.session_handler.storage.setWithPromise(query.key, value).then((data: KeyValue) => {
                    if (data.value == undefined) {
                        response.end("null");
                        return;
                    }
                    response.end(JSON.stringify(data.value));
                });
                return;
            }

            // Get.
            this.session_handler.storage.getWithPromise(query.key).then((data: KeyValue) => {
                if (data.value == undefined) {
                    response.end("null");
                    return;
                }
                response.end(JSON.stringify(data.value));
            });
            return;
        }

        if (pathname === "/command") {
            this.session_handler.handleCommand(query).then((data: KeyValue) => {
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(data.value);
            });
            return;
        }

        if (pathname === "/matching") {
            if (query.command === "live_sessions") {
                this.getLiveSessions(response);
                return;
            }
            this.session_handler.handleMatching(query).then((data: KeyValue) => {
                response.end(JSON.stringify(data.value));
            });
            return;
        }

        if (pathname === "/live") {
            this.getLiveSessions(response);
            return;
        }

        this.serveStaticFiles(pathname, response);
    }

    private getLiveSessions(response): void {
        this.session_handler.storage.getWithPromise("/live").then((data) => {
            if (data.value == undefined) {
                response.end("{}");
                return;
            }
            response.end(JSON.stringify(data.value));
        });
    }
}
