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
