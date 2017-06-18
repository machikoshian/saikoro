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
    public check_update_timer: any = 0;  // Timer

    public startCheckUpdate(client: Client): void {
        this.check_update_timer = setInterval(() => { client.checkUpdate(); }, 2000);
    }
    public stopCheckUpdate(): void {
        clearInterval(this.check_update_timer);
    }

    public matching(query: any, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");
        HttpRequest.send("/matching?" + params, callback);
    }

    public getLiveSessions(callback: RequestCallback): void {
        HttpRequest.send("/live", callback);
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");
        HttpRequest.send("/command?" + params, callback);
    }
}
