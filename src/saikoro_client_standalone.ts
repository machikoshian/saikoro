import { Connection, Client } from "./client";
import { StandaloneConnection } from "./standalone_connection";
import { WebClient } from "./saikoro";

let connection: Connection = new StandaloneConnection();

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
