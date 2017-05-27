import { CardId } from "./facility";
import { PlayerId } from "./board";

export type RequestCallback = (response: string) => void;

export abstract class UpdateListener {
    abstract startCheckUpdate(client: Client): void;
    abstract stopCheckUpdate(): void;
    abstract checkUpdate(client: Client): void;
}

export abstract class RequestHandler {
    abstract sendRequest(json: any, callback: RequestCallback): void;
}

export abstract class Client {
    public update_listener: UpdateListener;
    public request_handler: RequestHandler;

    public session_id: number = 0;
    public matching_id: number = 0;
    public mode: number = 0;
    public player_id: PlayerId = 0;
    // TODO: user_id should be unique.
    public user_id: string = String(Math.floor(Math.random() * 1000000));
    public step: number = 0;
    public callback: RequestCallback;

    constructor(update_listener: UpdateListener,
                request_handler: RequestHandler) {
        this.update_listener = update_listener;
        this.request_handler = request_handler;
    }

    public sendRequest(request: any): void {
        request.session_id = this.session_id;
        request.player_id = this.player_id;
        this.request_handler.sendRequest(request, this.callback);
    }

    abstract initBoard(): void;
    abstract startMatching(name: string, mode: number): void;  // TODO: Use enum for mode.
}

// Move this class to a Saikoro specific file.
export class Request {
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
