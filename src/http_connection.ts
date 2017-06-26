import { RequestCallback, Connection, Client } from "./client";
import { StandaloneConnection } from "./standalone_connection";
import { MatchingInfo } from "./protocol";
import * as Query from "./query";

class HttpRequest {
    static send(url: string, callback: RequestCallback) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => HttpRequest.onReadyStateChange(xhr,
            callback);
        xhr.open("GET", url, true);
    }

    static onReadyStateChange(xhr: XMLHttpRequest, callback: RequestCallback): void {
        switch (xhr.readyState) {
            case XMLHttpRequest.OPENED:
                xhr.send();
                break;
            case XMLHttpRequest.HEADERS_RECEIVED:
                console.log(xhr.getAllResponseHeaders());
                break;
            case XMLHttpRequest.LOADING:
                break;
            case XMLHttpRequest.DONE:
                if (callback != null) {
                    callback(xhr.responseText);
                }
                break;
        }
    }
}

export class HttpConnection extends Connection {
    public check_update_timer: number = null;  // Timer
    private check_matched_timer: number = null;
    private check_live_timer: number = null;

    public startCheckUpdate(client: Client): void {
        if (this.check_update_timer != null) {
            return;
        }
        this.check_update_timer = window.setInterval(() => {
            client.checkUpdate();
            this.getData(`chat/${client.session_id}`, (response) => {
                client.callbackChat(JSON.parse(response));
            });
        }, 2000);
    }
    public stopCheckUpdate(): void {
        window.clearInterval(this.check_update_timer);
        this.check_update_timer = null;
    }

    public matching(query: Query.MatchingQuery, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");

        this.check_matched_timer = window.setInterval(() => {
            this.getData(`matched/${query.user_id}`, callback);
        }, 2000);
        HttpRequest.send("/matching?" + params, callback);
    }

    public stopCheckMatching(): void {
        window.clearInterval(this.check_matched_timer);
        this.check_matched_timer = null;
    }

    public setQueryOnDisconnect(query: Query.Query): void {
        // Do nothing.  Nice to have a way to do something if possible.
    }

    public startCheckLive(callback: RequestCallback): void {
        if (this.check_live_timer != null) {
            return;
        }
        HttpRequest.send("/live", callback);
        this.check_live_timer = window.setInterval(() => {
            HttpRequest.send("/live", callback);
        }, 10000);
    }
    public stopCheckLive(): void {
        window.clearInterval(this.check_live_timer);
        this.check_live_timer = null;
    }

    private getData(key: string, callback: RequestCallback): void {
        const ekey: string = encodeURIComponent(key);
        HttpRequest.send(`/data?command=get&key=${ekey}`, callback);
    }

    private setData(key: string, value: string, callback: RequestCallback): void {
        const ekey: string = encodeURIComponent(key);
        const evalue: string = encodeURIComponent(value);
        HttpRequest.send(`/data?command=set&key=${ekey}&value=${evalue}`, callback);
    }

    private sendChat(query: Query.ChatQuery): void {
        if (query.session_id === -1 || query.user_id == null) {
            return;
        }
        const key: string = `chat/${query.session_id}/${query.user_id}`;
        const value: string = JSON.stringify(query);
        this.setData(key, value, null);
    }

    public sendRequest(query: Query.Query, callback: RequestCallback): void {
        if (query.command === "chat") {
            this.sendChat(<Query.ChatQuery>query);
            return;
        }

        const equery: string = encodeURIComponent(JSON.stringify(query));
        HttpRequest.send("/command?query=" + equery, callback);
    }
}
