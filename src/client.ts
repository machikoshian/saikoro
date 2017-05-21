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

    abstract initBoard(): void;
    abstract buildFacility(x: number, y: number, card_id: CardId): void;
    abstract rollDice(dice_num: number, aim: number): void;
    abstract characterCard(card_id: CardId): void;
    abstract endTurn(): void;
    abstract startMatching(name: string): void;
}
