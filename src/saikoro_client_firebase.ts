import { Connection, Client } from "./client";
import { FirebaseConnection } from "./firebase_connection";
import { WebClient } from "./saikoro";

let connection: Connection = new FirebaseConnection();

let client: Client = new WebClient(connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });
