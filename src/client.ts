import { CardId } from "./facility";
import { PlayerId } from "./board";
import { GameMode } from "./protocol";

export type RequestCallback = (response: string) => void;

export abstract class Connection {
    // Receivers from server.
    abstract startCheckUpdate(client: Client): void;
    abstract stopCheckUpdate(): void;

    abstract startCheckLive(callback: RequestCallback): void;
    abstract stopCheckLive(): void;

    // Senders from client.
    abstract sendRequest(query: any, callback: RequestCallback): void;
    abstract matching(query: any, callback: RequestCallback): void;

    // This is for Firebase.onDisconnect only so far.
    abstract setQueryOnDisconnect(query: any): void;
}

export abstract class Client {
    // TODO: These variables should not be modified by others.
    public connection: Connection;
    public session_id: number = -1;
    public matching_id: number = -1;
    public mode: GameMode = GameMode.None;
    public player_id: PlayerId = -1;
    // TODO: user_id should be unique. 0 - 9 is reserved for NPCs.
    public user_id: string = String(Math.floor(Math.random() * 1000000) + 10);
    public step: number = -1;
    public callback: RequestCallback;
    public live_sessions: number[] = [];

    constructor(connection: Connection) {
        this.connection = connection;
    }

    public reset(): void {
        this.session_id = -1;
        this.matching_id = -1;
        this.mode = GameMode.None;
        this.player_id = -1;
        this.step = -1;
        this.connection.stopCheckUpdate();
        this.connection.stopCheckLive();
    }

    public matching(query: any): void {
        query.command = "matching";
        query.user_id = this.user_id;
        this.mode = query["mode"];
        this.connection.matching(query, this.callbackMatching.bind(this));
    }

    public checkUpdate(): void {
        let query = {
            command: "board",
            session_id: this.session_id,
            player_id: this.player_id,
            step: this.step,
        };
        this.sendRequest(query);
    }

    private callbackMatching(response: string): void {
        const response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.player_id = response_json.player_id;
        this.matching_id = response_json.matching_id;

        this.connection.setQueryOnDisconnect(this.fillRequest(Request.quit()));

        this.checkUpdate();
        this.connection.startCheckUpdate(this);
        this.connection.stopCheckLive();
    }

    public startCheckLive(callback: RequestCallback): void {
        this.connection.startCheckLive(callback);
    }

    public watchGame(session_id: number): void {
        this.reset();
        this.session_id = session_id;
        this.mode = GameMode.OnLineWatch;

        this.sendRequest(Request.watch());
        this.connection.setQueryOnDisconnect(this.fillRequest(Request.quit()));
        this.connection.startCheckUpdate(this);
        this.connection.stopCheckLive();
    }

    public sendRequest(request: any): void {
        this.connection.sendRequest(this.fillRequest(request), this.callback);
    }

    public fillRequest(request: any): any {
        request.user_id = this.user_id;
        request.session_id = this.session_id;
        request.player_id = this.player_id;
        request.mode = this.mode;
        return request;
    }

    abstract initBoard(): void;
}

// Move this class to a Saikoro specific file.
export class Request {
    static matching(name: string, mode: GameMode, deck: string): Object {
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

    static interactFacilityAction(card_id: CardId, target_player_id: PlayerId): Object {
        return {
            command: "interact",
            card_id: card_id,
            target_player_id: target_player_id,
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

    static watch(): Object {
        return {
            command: "watch",
        };
    }
}
