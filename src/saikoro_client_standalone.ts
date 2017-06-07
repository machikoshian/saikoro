import { Connection, Client } from "./client";
import { StandaloneConnection } from "./standalone_connection";
import { WebClient } from "./saikoro";

const delay: number = 0;  // msec
let connection: Connection = new StandaloneConnection(delay);

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
