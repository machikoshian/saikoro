import { RequestCallback, Connection, Client } from "./client";
import { Phase, Session } from "./session";
import { HtmlView } from "./html_view";
import { GameMode } from "./protocol";

// TODO: can be merged with Client?
export class WebClient extends Client {
    private no_update_count: number = 0;
    private view: HtmlView;
    private chat_timestamps: { [user_id: string]: number } = {};

    constructor(connection: Connection) {
        super(connection);
        this.view = new HtmlView(this);
    }

    public reset(): void {
        super.reset();
        this.no_update_count = 0;
    }

    public initBoard(): void {
        this.view.initView();
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

        if (session.getPhase() === Phase.EndGame) {
            this.connection.stopCheckUpdate();
        }

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

    public callbackChat(data: any): void {  // Request.chat
        if (data == null) {
            return;
        }
        const user_ids: string[] = Object.keys(data);

        for (let user_id of user_ids) {
            const chat: any = data[user_id];
            const prev_timestamp: number = this.chat_timestamps[user_id];
            if (chat.timestamp == undefined || chat.timestamp === prev_timestamp) {
                continue;
            }
            this.view.updateChat(chat);
            this.chat_timestamps[user_id] = chat.timestamp;
        }
    }
}
