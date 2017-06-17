import { Storage, LocalStorage, SessionHandler } from "./session_handler";
import { HttpServer } from "./http_server";
import { FirebaseStorage, FirebaseServer } from "./firebase_server";

// Set DEBUG mode if specified.
let DEBUG: string = process.env.DEBUG || "";

// Source map support.
if (DEBUG) {
    require("source-map-support").install();
}

const storage = new LocalStorage();
// const storage = new MemcacheStorage("localhost:11211");
// const storage = new FirebaseStorage();

let session_handler: SessionHandler = new SessionHandler(storage);

let main_http: HttpServer = new HttpServer(session_handler);
main_http.run();
// let main_firebase: FirebaseServer = new FirebaseServer(session_handler);
// main_firebase.run();
