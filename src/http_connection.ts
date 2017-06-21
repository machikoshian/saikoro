import { RequestCallback, Connection, Client } from "./client";
import { StandaloneConnection } from "./standalone_connection";

class HttpRequest {
    static send(url: string, callback: RequestCallback) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => HttpRequest.onReadyStateChange(xhr,
            callback);
        xhr.open("GET", url, true);
    }

    static onReadyStateChange(xhr: XMLHttpRequest,
        callback: (response: string) => void): void {
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
                callback(xhr.responseText);
                break;
        }
    }
}

export class HttpConnection extends Connection {
    public check_update_timer: number = 0;  // Timer
    private check_live_timer: number = 0;

    public startCheckUpdate(client: Client): void {
        if (this.check_update_timer != null) {
            return;
        }
        this.check_update_timer = window.setInterval(() => { client.checkUpdate(); }, 2000);
    }
    public stopCheckUpdate(): void {
        window.clearInterval(this.check_update_timer);
        this.check_update_timer = null;
    }

    public matching(query: any, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");
        HttpRequest.send("/matching?" + params, callback);
    }

    public setQueryOnDisconnect(query: any): void {
        // Do nothing.  Nice to have a way to do something if possible.
    }

    public startCheckLive(callback: RequestCallback): void {
        if (this.check_live_timer != null) {
            return;
        }
        HttpRequest.send("/live", callback);
        this.check_live_timer = window.setInterval(() => {
            HttpRequest.send("/live", callback);
        }, 30000);
    }
    public stopCheckLive(): void {
        window.clearInterval(this.check_live_timer);
        this.check_live_timer = null;
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");
        HttpRequest.send("/command?" + params, callback);
    }
}
