import { RequestCallback, RequestHandler, UpdateListener, Client } from "./client";

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

export class HttpUpdateListener extends UpdateListener {
    public check_update_timer: any = 0;  // Timer

    public startCheckUpdate(client: Client): void {
        this.check_update_timer = setInterval(() => { this.checkUpdate(client) }, 2000);
    }
    public stopCheckUpdate(): void {
        clearInterval(this.check_update_timer);
    }
    public checkUpdate(client: Client): void {
        console.log(`checkUpdate(${client.step})`);
        let request = {
            command: "board",
            session_id: client.session_id,
            player_id: client.player_id,
            step: client.step,
        };
        client.request_handler.sendRequest(request, client.callback);
    }
}

export class HttpRequestHandler extends RequestHandler {
    constructor() {
        super();
    }

    public sendRequest(json: any, callback: RequestCallback): void {
        let params: string = Object.keys(json).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]); }).join("&");
        let url: string;
        if (json.command === "matching") {
            url = "/matching?" + params;
        }
        else {
            url = "/command?" + params;
        }
        HttpRequest.Send(url, callback);
    }
}
