import { UpdateListener, RequestHandler, Client } from "./client";
import { HttpUpdateListener, HttpRequestHandler, WebClient } from "./saikoro";

let update_listener: UpdateListener = new HttpUpdateListener();
let request_handler: RequestHandler = new HttpRequestHandler();

let client: Client = new WebClient(update_listener, request_handler);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
