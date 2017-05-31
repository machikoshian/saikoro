import { CardId } from "./facility";
import { PlayerId } from "./board";

export type RequestCallback = (response: string) => void;

export abstract class UpdateListener {
    abstract startCheckUpdate(client: Client): void;
    abstract stopCheckUpdate(): void;
    abstract checkUpdate(client: Client): void;
}

export abstract class RequestHandler {
    abstract sendRequest(query: any, callback: RequestCallback): void;
    abstract matching(query: any, callback: RequestCallback): void;
}

export abstract class Client {
    public update_listener: UpdateListener;
    public request_handler: RequestHandler;

    public session_id: number = 0;
    public matching_id: number = 0;
    public mode: number = 0;
    public player_id: PlayerId = 0;
    // TODO: user_id should be unique. 0 - 9 is reserved for NPCs.
    public user_id: string = String(Math.floor(Math.random() * 1000000) + 10);
    public step: number = 0;
    public callback: RequestCallback;

    constructor(update_listener: UpdateListener,
                request_handler: RequestHandler) {
        this.update_listener = update_listener;
        this.request_handler = request_handler;
    }

    public matching(query: any): void {
        query.command = "matching";
        query.user_id = this.user_id;
        this.request_handler.matching(query, this.callbackMatching.bind(this));
    }

    private callbackMatching(response: string): void {
        const response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.matching_id = response_json.matching_id;

        this.update_listener.checkUpdate(this);
        this.update_listener.startCheckUpdate(this);
    }

    public sendRequest(request: any): void {
        request.session_id = this.session_id;
        request.player_id = this.player_id;
        this.request_handler.sendRequest(request, this.callback);
    }

    abstract initBoard(): void;
}

// Move this class to a Saikoro specific file.
export class Request {
    static matching(name: string, mode: number, deck: string): Object {
        return {
            command: "matching",
            name: name,
            mode: mode,
            deck: deck,
        };
    }

    static buildFacility(x: number, y: number, card_id: CardId): Object {
        return {
            command: "build",
            x: x,
            y: y,
            card_id: card_id,
        };
    }

    static rollDice(dice_num: number, aim: number): Object {
        return {
            command: "dice",
            dice_num: dice_num,
            aim: aim,
        };
    }

    static characterCard(card_id: CardId): Object {
        return {
            command: "character",
            card_id: card_id,
        };
    }

    static endTurn(): Object {
        return {
            command: "build",
            x: -1,
            y: -1,
            card_id: -1,
        };
    }

    static quit(): Object {
        return {
            command: "quit",
        };
    }
}
