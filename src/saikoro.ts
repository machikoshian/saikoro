import { RequestCallback, Connection, Client } from "./client";
import { Phase, Session } from "./session";
import { HtmlView } from "./html_view";
import { GameMode, Protocol, MatchingInfo } from "./protocol";
import * as Query from "./query";
import { StandaloneConnection } from "./standalone_connection";

// TODO: can be merged with Client?
export class WebClient extends Client {
    private no_update_count: number = 0;
    private view: HtmlView;
    private chat_timestamps: { [user_id: string]: number } = {};
    private prev_mode: GameMode = GameMode.None;
    readonly connection: Connection;
    readonly offline_connection: Connection;

    constructor(connection: Connection) {
        super(connection);
        const delay: number = 0;  // msec.
        this.offline_connection = new StandaloneConnection(delay);
        this.connection = connection ? connection : this.offline_connection;
        this.view = new HtmlView(this);
    }

    public reset(): void {
        if (this.prev_mode !== GameMode.None) {
            this.mode = this.prev_mode;
            this.prev_mode = GameMode.None;
        }
        else {
            this.mode = GameMode.None;
        }
        this.session_id = -1;
        this.player_id = -1;
        this.step = -1;
        this.connection.stopCheckUpdate();
        this.connection.stopCheckLive();
        this.no_update_count = 0;
    }

    public initBoard(): void {
        this.view.initView();
    }

    public matching(query: Query.MatchingQuery): void {
        query.command = "matching";
        query.user_id = this.user_id;

        if (query.mode === GameMode.OffLine_2_Matching) {
            this.prev_mode = this.mode;
        }
        else {
            // If mode is OffLine_2_Matching, do not stop previous actual matching request.
            this.connection.stopCheckMatching();
        }
        this.mode = query.mode;

        if (Protocol.isOnlineMode(query.mode)) {
            this.connection.setQueryOnDisconnect(this.createQuitQuery());
            this.connection.matching(query, this.callbackMatching.bind(this));
        }
        else {
            this.offline_connection.matching(query, this.callbackMatching.bind(this));
        }
    }

    public quit(): void {
        if (this.mode !== GameMode.OffLine_2_Matching) {
            this.sendRequest(this.createQuitQuery());
        }
    }

    private callbackMatching(response: string): void {
        const response_json: MatchingInfo = JSON.parse(response);
        if (response_json == null || !response_json.is_matched) {
            return;
        }

        // Mode is already changed to online.
        if (Protocol.isOnlineMode(this.mode) &&
            response_json.mode === GameMode.OffLine_2_Matching) {
            return;
        }

        this.session_id = response_json.session_id;
        this.mode = response_json.mode;
        this.step = -1;
        this.no_update_count = 0;

        this.view.matched();
        this.checkUpdate();
        if (Protocol.isOnlineMode(response_json.mode)) {
            this.connection.setQueryOnDisconnect(this.createQuitQuery());
            this.connection.stopCheckMatching();
            this.connection.startCheckUpdate(this);
            this.connection.stopCheckLive();
        }
    }

    public callbackSession(response: string): void {
        if (this.mode === GameMode.None) {
            return;
        }

        if (!response) {
            console.log("Stop polling.");
            this.connection.stopCheckUpdate();
        }

        // If the response is "{}", the server does not have any update.
        if (response === "{}") {
            console.log("Already updated.");

            // If no update continues 100 times, stop polling.
            this.no_update_count++;
            if (this.no_update_count > 100) {
                console.log("No update for a while.");
                this.connection.stopCheckUpdate();
            }
            return;
        }
        this.no_update_count = 0;

        let session: Session = Session.fromJSON(JSON.parse(response));
        let step: number = session.getStep();
        console.log(step);
        if (step === this.step) {
            console.log("Already updated.");
            return;
        }
        this.player_id = session.getPlayerId(this.user_id);
        this.step = step;

        this.view.updateView(session, this.player_id);
    }

    public callbackChat(data: { [user_id: string]: Query.ChatQuery }): void {
        if (data == null) {
            return;
        }
        const user_ids: string[] = Object.keys(data);

        for (let user_id of user_ids) {
            const chat: Query.ChatQuery = data[user_id];
            const prev_timestamp: number = this.chat_timestamps[user_id];
            if (chat.timestamp == undefined || chat.timestamp === prev_timestamp) {
                continue;
            }
            if (chat.step < this.step) {
                continue;
            }
            this.view.updateChat(chat);
            this.chat_timestamps[user_id] = chat.timestamp;
        }
    }

    public checkUpdate(): void {
        this.sendRequest(this.createUpdateQuery(this.step));
    }

    public startCheckLive(callback: RequestCallback): void {
        this.connection.startCheckLive(callback);
    }

    public watchGame(session_id: number): void {
        this.reset();
        this.session_id = session_id;
        this.mode = GameMode.OnLineWatch;

        this.sendRequest(this.createWatchQuery());
        this.connection.setQueryOnDisconnect(this.createQuitQuery());
        this.connection.startCheckUpdate(this);
        this.connection.stopCheckLive();
    }

    public sendRequest(request: Query.Query): void {
        let connection: Connection =
            Protocol.isOnlineMode(this.mode) ? this.connection : this.offline_connection;
        connection.sendRequest(request, (response) => {
            this.callbackSession(response);
        });
    }
}
