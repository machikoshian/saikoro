import { Connection, Client } from "./client";
import { HttpConnection } from "./http_connection";
import { WebClient } from "./saikoro";

let connection: Connection = new HttpConnection();

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
