import { RequestCallback, Connection, Client } from "./client";
import { MatchedData, SessionHandler } from "./session_handler";
import { KeyValue, Storage, LocalStorage } from "./storage";
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
                callback(JSON.stringify(matched));
            }, this.delay);
        });
    }

    public setQueryOnDisconnect(query: any): void {
        // Do nothing.
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        session_handler.handleCommand(query).then((data: KeyValue) => {
            setTimeout(() => {
                callback(data.value);
            }, this.delay);
        });
    }

    public startCheckLive(callback: RequestCallback): void {
        // Do nothing.
    }
    public stopCheckLive(): void {
        // Do nothing.
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
        this.connection = this.getConnection(client.mode);
        this.connection.startCheckUpdate(client);
    }

    public stopCheckUpdate(): void {
        this.connection.stopCheckUpdate();
    }

    public matching(query: any, callback: RequestCallback): void {
        this.connection.stopCheckUpdate();
        this.connection = this.getConnection(query.mode);
        this.connection.matching(query, callback);
    }

    public setQueryOnDisconnect(query: any): void {
        // Online connection is used if available.
        if (this.online_connection) {
            this.online_connection.setQueryOnDisconnect(query);
            return;
        }
        this.offline_connection.setQueryOnDisconnect(query);
    }

    public startCheckLive(callback: RequestCallback): void {
        // Online connection is used if available.
        if (this.online_connection) {
            this.online_connection.startCheckLive(callback);
            return;
        }
        this.offline_connection.startCheckLive(callback);
    }
    public stopCheckLive(): void {
        // Online connection is used if available.
        if (this.online_connection) {
            this.online_connection.stopCheckLive();
            return;
        }
        this.offline_connection.stopCheckLive();
    }

    private getConnection(mode: GameMode): Connection {
        if (Protocol.isOnlineMode(mode) && (this.online_connection != null)) {
            return this.online_connection;
        }
        return this.offline_connection;
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        this.getConnection(query.mode).sendRequest(query, callback);
    }
}
