export enum QueryCommand {
    None,
    Matching,
    Chat,
    Build,
    Dice,
    Character,
    Interact,
    Quit,
    Watch,
}

export interface Query {
    command: string;
    user_id: string;
    session_id: number;
    player_id: number;
    mode: number;
}

export interface MatchingQuery extends Query {
    name: string,
    deck: string,
}

export interface ChatQuery extends Query {
    stamp_id: number,
    step: number,
    timestamp: number,
}

export interface UpdateQuery extends Query {
    step: number,
}

export interface BuildQuery extends Query {
    x: number,
    y: number,
    card_id: number,  // TODO: CardId
}

export interface DiceQuery extends Query {
    dice_num: number,
    aim: number,
}

export interface CharacterQuery extends Query {
    card_id: number,  // TODO: CardId
    target_player_id?: number  // TODO: PlayerId
    target_card_id?: number  // TODO: CardId
}

export interface InteractQuery extends Query {
    card_id: number,  // TODO: CardId
    target_player_id: number  // TODO: PlayerId
}

export interface EndTurnQuery extends Query {}
export interface QuitQuery extends Query {}
export interface WatchQuery extends Query {}
