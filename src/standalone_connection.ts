import { RequestCallback, Connection, Client } from "./client";
import { KeyValue, Storage, LocalStorage, MatchedData, SessionHandler } from "./session_handler";
import { GameMode, Protocol } from "./protocol";

const storage = new LocalStorage();
let session_handler: SessionHandler = new SessionHandler(storage);

export class StandaloneConnection extends Connection {
    constructor(public delay: number = 0) {
        super();
    }

    public startCheckUpdate(client: Client): void {}
    public stopCheckUpdate(): void {}

    public matching(query: any, callback: RequestCallback): void {
        session_handler.handleMatching(query).then((matched: MatchedData) => {
            setTimeout(() => {
                callback(JSON.stringify({ matching_id: matched.matching_id,
                                            player_id: matched.player_id,
                                           session_id: matched.session_id }));
            }, this.delay);
        });
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        session_handler.handleCommand(query).then((data: KeyValue) => {
            setTimeout(() => {
                callback(data.value);
            }, this.delay);
        });
    }
}

export class HybridConnection extends Connection {
    private online_connection: Connection = null;
    private offline_connection: Connection = null;
    private connection: Connection = null;

    constructor(online_connection: Connection = null) {
        super();
        this.online_connection = online_connection;
        this.offline_connection = new StandaloneConnection();
        this.connection = this.offline_connection;
    }

    public setOnlineConnection(connection: Connection): void {
        if (this.online_connection) {
            this.online_connection.stopCheckUpdate();
        }
        this.online_connection = connection;
    }

    public startCheckUpdate(client: Client): void {
        this.connection.startCheckUpdate(client);
    }

    public stopCheckUpdate(): void {
        this.connection.stopCheckUpdate();
    }

    public matching(query: any, callback: RequestCallback): void {
        this.connection.stopCheckUpdate();
        if (Protocol.isOnlineMode(query.mode) && (this.online_connection != null)) {
            this.connection = this.online_connection;
        }
        else  {
            this.connection = this.offline_connection;
        }
        this.connection.matching(query, callback);
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        this.connection.sendRequest(query, callback);
    }
}
