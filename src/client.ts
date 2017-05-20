import { Phase, Session, PlayerCards, Event, EventType } from "./session";
import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityType, Facility } from "./facility";
import { Dice, DiceResult } from "./dice";
import { HtmlView } from "./html_view";

export type RequestCallback = (response: string) => void;

export abstract class RequestHandler {
    abstract sendRequest(json: any, callback: RequestCallback): void;
}

export abstract class UpdateListener {
    abstract startCheckUpdate(client: Client): void;
    abstract stopCheckUpdate(): void;
    abstract checkUpdate(client: Client): void;
}

export abstract class Client {
    public update_listener: UpdateListener;
    public request_handler: RequestHandler;
    public callback: RequestCallback;

    constructor(update_listener: UpdateListener,
                request_handler: RequestHandler) {
        this.update_listener = update_listener;
        this.request_handler = request_handler;
    }

    abstract initBoard(): void;
    abstract buildFacility(x: number, y: number, card_id: CardId): void;
    abstract rollDice(dice_num: number, aim: number): void;
    abstract endTurn(): void;
    abstract startMatching(name: string): void;
}
