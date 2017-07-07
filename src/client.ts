import { CardId } from "./facility";
import { PlayerId } from "./board";
import { Protocol, GameMode, MatchingInfo } from "./protocol";
import * as Query from "./query";

export type RequestCallback = (response: string) => void;

export abstract class Connection {
    // Receivers from server.
    abstract startCheckUpdate(client: Client): void;
    abstract stopCheckUpdate(): void;

    abstract startCheckLive(callback: RequestCallback): void;
    abstract stopCheckLive(): void;

    // Senders from client.
    abstract sendRequest(query: Query.Query, callback: RequestCallback): void;
    abstract matching(query: Query.MatchingQuery, callback: RequestCallback): void;
    abstract stopCheckMatching(): void;

    // This is for Firebase.onDisconnect only so far.
    abstract setQueryOnDisconnect(query: Query.Query): void;
}

export abstract class Client {
    // TODO: These variables should not be modified by others.
    public session_id: number = -1;
    public mode: GameMode = GameMode.None;
    public player_id: PlayerId = -1;
    // TODO: user_id should be unique. 0 - 9 is reserved for NPCs.
    public user_id: string = String(Math.floor(Math.random() * 1000000) + 10);
    public step: number = -1;
    public live_sessions: number[] = [];

    constructor(connection: Connection) {}

    abstract callbackSession(response: string): void;
    abstract callbackChat(response: { [user_id: string]: Query.ChatQuery }): void;
    abstract reset(): void;
    abstract matching(query: Query.MatchingQuery): void;
    abstract quit(); void;
    abstract checkUpdate(): void;
    abstract startCheckLive(callback: RequestCallback): void;
    abstract watchGame(session_id: number): void;
    abstract sendRequest(request: Query.Query): void;
    abstract initBoard(): void;

    public createQuery(): Query.Query {
        return {
            command: "",
            user_id: this.user_id,
            session_id: this.session_id,
            player_id: this.player_id,
            mode: this.mode,
        };
    }

    public fillQuery(query: Query.Query): Query.Query {
        query.user_id = this.user_id;
        query.session_id = this.session_id;
        query.player_id = this.player_id;
        query.mode = this.mode;
        return query;
    }

    public createMatchingQuery(name: string, mode: GameMode, deck: string): Query.MatchingQuery {
        let query: Query.MatchingQuery = <Query.MatchingQuery>this.createQuery();
        query.command = "matching";
        // mode is intentionally overwriten here, because this query decides the game mode.
        query.mode = mode;
        query.name = name;
        query.deck = deck;
        return query;
    }

    public createChatQuery(stamp_id: number): Query.ChatQuery {
        let query: Query.ChatQuery = <Query.ChatQuery>this.createQuery();
        query.command = "chat";
        query.stamp_id = stamp_id;
        query.step = this.step;
        query.timestamp = new Date().getTime();
        return query;
    }

    public createUpdateQuery(step: number): Query.UpdateQuery {
        let query: Query.UpdateQuery = <Query.UpdateQuery>this.createQuery();
        query.command = "board";  // TODO: rename it to "update".
        query.step = step;
        return query;
    }

    public createBuildQuery(x: number, y: number, card_id: CardId): Query.BuildQuery {
        let query: Query.BuildQuery = <Query.BuildQuery>this.createQuery();
        query.command = "build";
        query.x = x;
        query.y = y;
        query.card_id = card_id;
        return query;
    }

    public createDiceQuery(dice_num: number, aim: number): Query.DiceQuery {
        let query: Query.DiceQuery = <Query.DiceQuery>this.createQuery();
        query.command = "dice";
        query.dice_num = dice_num;
        query.aim = aim;
        return query;
    }

    // TODO: Enable to accept other additional values.
    public createCharacterQuery(card_id: CardId, target_player_id: PlayerId = -1): Query.CharacterQuery {
        let query: Query.CharacterQuery = <Query.CharacterQuery>this.createQuery();
        query.command = "character";
        query.card_id = card_id;
        query.target_player_id = target_player_id;
        return query;
    }

    public createCharacterWithCardIdQuery(card_id: CardId,
                                          target_card_id: CardId): Query.CharacterQuery {
        let query: Query.CharacterQuery = <Query.CharacterQuery>this.createQuery();
        query.command = "character";
        query.card_id = card_id;
        query.target_card_id = target_card_id;
        return query;
    }

    public createInteractQuery(card_id: CardId, target_player_id: PlayerId): Query.InteractQuery {
        let query: Query.InteractQuery = <Query.InteractQuery>this.createQuery();
        query.command = "interact";
        query.card_id = card_id;
        query.target_player_id = target_player_id;
        return query;
    }

    // TODO: Use EndTurnQuery instead.
    public createEndTurnQuery(): Query.BuildQuery {
        let query: Query.BuildQuery = <Query.BuildQuery>this.createQuery();
        query.command = "build";
        query.x = -1;
        query.y = -1;
        query.card_id = -1;
        return query;
    }

    public createQuitQuery(): Query.QuitQuery {
        let query: Query.QuitQuery = <Query.QuitQuery>this.createQuery();
        query.command = "quit";
        return query;
    }

    public createWatchQuery(): Query.WatchQuery {
        let query: Query.WatchQuery = <Query.WatchQuery>this.createQuery();
        query.command = "watch";
        return query;
    }
}
