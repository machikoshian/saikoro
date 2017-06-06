import { RequestCallback, Connection, Client } from "./client";
import { KeyValue, Memcache, MemcacheMock, MatchedData, SessionHandler } from "./session_handler";
import { GameMode } from "./protocol";

const mc = new MemcacheMock();
let session_handler: SessionHandler = new SessionHandler(mc);

export class StandaloneConnection extends Connection {
    public startCheckUpdate(client: Client): void {}
    public stopCheckUpdate(): void {}
    public checkUpdate(client: Client): void {
        let query = {
            command: "board",
            session_id: client.session_id,
            player_id: client.player_id,
            step: client.step,
        };
        session_handler.handleCommand(query).then((data: KeyValue) => {
            client.callback(data.value);
        });
    }

    public matching(query: any, callback: RequestCallback): void {
        session_handler.handleMatching(query).then((matched: MatchedData) => {
            callback(JSON.stringify({ matching_id: matched.matching_id,
                                        player_id: matched.player_id,
                                       session_id: matched.session_id }));
        });
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        session_handler.handleCommand(query).then((data: KeyValue) => {
            callback(data.value);
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
    public checkUpdate(client: Client): void {
        this.connection.checkUpdate(client);
    }

    public matching(query: any, callback: RequestCallback): void {
        this.connection.stopCheckUpdate();
        if ((query.mode !== GameMode.OffLine) && (this.online_connection != null)) {
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
