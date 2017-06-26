import { RequestCallback, Connection, Client } from "./client";
import { MatchedData, SessionHandler } from "./session_handler";
import { KeyValue, Storage, LocalStorage } from "./storage";
import { GameMode, Protocol, MatchingInfo } from "./protocol";
import * as Query from "./query";

const storage = new LocalStorage();
let session_handler: SessionHandler = new SessionHandler(storage);

export class StandaloneConnection extends Connection {
    constructor(public delay: number = 0) {
        super();
    }

    public startCheckUpdate(client: Client): void {}
    public stopCheckUpdate(): void {}

    public matching(query: Query.MatchingQuery, callback: RequestCallback): void {
        session_handler.handleMatching(query).then((data: KeyValue) => {
            let matching_info: MatchingInfo = data.value;
            setTimeout(() => {
                callback(JSON.stringify(matching_info));
            }, this.delay);
        });
    }
    public stopCheckMatching(): void {
        // Do nothing.
    }

    public setQueryOnDisconnect(query: Query.Query): void {
        // Do nothing.
    }

    public sendRequest(query: Query.Query, callback: RequestCallback): void {
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

    public matching(query: Query.MatchingQuery, callback: RequestCallback): void {
        this.connection.stopCheckUpdate();
        this.connection = this.getConnection(query.mode);
        this.connection.matching(query, callback);
    }
    public stopCheckMatching(): void {
        if (this.online_connection) {
            this.online_connection.stopCheckMatching();
            return;
        }
        this.offline_connection.stopCheckMatching();
    }

    public setQueryOnDisconnect(query: Query.Query): void {
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

    public sendRequest(query: Query.Query, callback: RequestCallback): void {
        this.getConnection(query.mode).sendRequest(query, callback);
    }
}
