import { RequestCallback, Connection, Client } from "./client";

class HttpRequest {
    static Send(url: string, callback: RequestCallback) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => HttpRequest.OnReadyStateChange(xhr,
            callback);
        xhr.open("GET", url, true);
    }

    static OnReadyStateChange(xhr: XMLHttpRequest,
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
        this.check_update_timer = setInterval(() => { this.checkUpdate(client) }, 2000);
    }
    public stopCheckUpdate(): void {
        clearInterval(this.check_update_timer);
    }
    public checkUpdate(client: Client): void {  // TODO: client argument can be callback?
        console.log(`checkUpdate(${client.step})`);
        let request = {
            command: "board",
            session_id: client.session_id,
            player_id: client.player_id,
            step: client.step,
        };
        this.sendRequest(request, client.callback);
    }

    public matching(query: any, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");
        HttpRequest.Send("/matching?" + params, callback);
    }

    public sendRequest(query: any, callback: RequestCallback): void {
        let params: string = Object.keys(query).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
        }).join("&");
        HttpRequest.Send("/command?" + params, callback);
    }
}
