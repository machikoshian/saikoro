import { RequestCallback, RequestHandler, UpdateListener, Client } from "./client";
import { KeyValue, Memcache, MemcacheMock, MatchedData, SessionHandler } from "./session_handler";

const mc = new MemcacheMock();
let session_handler: SessionHandler = new SessionHandler(mc);

export class StandaloneUpdateListener extends UpdateListener {
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
}

export class StandaloneRequestHandler extends RequestHandler {
    public sendRequest(query: any, callback: RequestCallback): void {
        if (query.command === "matching") {
            session_handler.handleMatching(query.name, query.mode, query.user_id).then(
                    (matched: MatchedData) => {
                callback(JSON.stringify({ matching_id: matched.matching_id,
                                            session_id: matched.session_id }));
            });
            return;
        }

        session_handler.handleCommand(query).then((data: KeyValue) => {
            callback(data.value);
        });
    }
}
