import { Connection, Client } from "./client";
import { FirebaseConnection } from "./firebase_connection";
import { HybridConnection } from "./standalone_connection";
import { WebClient } from "./saikoro";

let connection: Connection = new HybridConnection(new FirebaseConnection());

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
