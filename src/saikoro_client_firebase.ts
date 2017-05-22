import { UpdateListener, RequestHandler, Client } from "./client";
import { FirebaseUpdateListener, FirebaseRequestHandler, WebClient } from "./saikoro";

let update_listener: UpdateListener = new FirebaseUpdateListener();
let request_handler: RequestHandler = new FirebaseRequestHandler();

let client: Client = new WebClient(update_listener, request_handler);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
