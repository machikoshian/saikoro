import { FirebaseStorage, FirebaseServer } from "./firebase_server";
import { SessionHandler } from "./session_handler";

const functions = require("firebase-functions");
const storage = new FirebaseStorage();

let session_handler: SessionHandler = new SessionHandler(storage);
let main_firebase: FirebaseServer = new FirebaseServer(session_handler);

exports.matching = functions.database.ref("/matching/{saikoro_user_id}").onWrite(event => {
    if (!event.data.exists()) {
        return;
    }
    return main_firebase.onMatching(event.data);
});

exports.command = functions.database.ref("/command/{saikoro_user_id}").onWrite(event => {
    if (!event.data.exists()) {
        return;
    }
    return main_firebase.onCommand(event.data);
});
