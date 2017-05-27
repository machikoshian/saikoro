import { UpdateListener, RequestHandler, Client } from "./client";
import { StandaloneUpdateListener, StandaloneRequestHandler } from "./standalone_client";
import { WebClient } from "./saikoro";

let update_listener: UpdateListener = new StandaloneUpdateListener();
let request_handler: RequestHandler = new StandaloneRequestHandler();

let client: Client = new WebClient(update_listener, request_handler);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
