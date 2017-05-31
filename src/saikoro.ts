import { RequestCallback, RequestHandler, UpdateListener, Client } from "./client";
import { Phase, Session } from "./session";
import { HtmlView } from "./html_view";

// TODO: can be merged with Client?
export class WebClient extends Client {
    private no_update_count: number = 0;
    private view: HtmlView;
    public callback: RequestCallback;

    constructor(update_listener: UpdateListener,
                request_handler: RequestHandler) {
        super(update_listener, request_handler);
        this.callback =  this.callbackSession.bind(this);
        this.view = new HtmlView(this);
    }

    public initBoard(): void {
        this.view.initView();
    }

    // Do not directly call this method.
    // Use this.callback as a wrapper of this method.
    private callbackSession(response: string): void {
        if (!response) {
            console.log("Stop polling.");
            this.update_listener.stopCheckUpdate();
        }

        // If the response is "{}", the server does not have any update.
        if (response === "{}") {
            console.log("Already updated.");

            // If no update continues 100 times, stop polling.
            this.no_update_count++;
            if (this.no_update_count > 100) {
                console.log("No update for a while.");
                this.update_listener.stopCheckUpdate();
            }
            return;
        }
        this.no_update_count = 0;

        let session: Session = Session.fromJSON(JSON.parse(response));

        if (session.getPhase() === Phase.EndGame) {
            this.update_listener.stopCheckUpdate();
        }

        this.player_id = session.getCurrentPlayerId();

        let step: number = session.getStep();
        console.log(step);
        if (step === this.step) {
            console.log("Already updated.");
            return;
        }
        this.step = step;

        this.view.updateView(session, this.user_id);
    }
}
