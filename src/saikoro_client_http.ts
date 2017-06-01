import { Connection, Client } from "./client";
import { HttpConnection } from "./http_client";
import { WebClient } from "./saikoro";

let connection: Connection = new HttpConnection();

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
