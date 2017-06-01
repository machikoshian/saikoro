import { Connection, Client } from "./client";
import { HttpConnection } from "./http_connection";
import { HybridConnection } from "./standalone_connection";
import { WebClient } from "./saikoro";

let connection: Connection = new HybridConnection(new HttpConnection());

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
