export enum GameMode {
    None,
    OffLine_2,
    OffLine_3,
    OffLine_4,
    OnLineSingle_2,
    OnLineSingle_3,
    OnLineSingle_4,
    OnLine2Players,
    OnLineWatch,
};

export interface MatchingPlayerInfo {
    user_id: string,
    mode: GameMode,
    name: string,
    deck: number[],
}

export interface MatchingInfo {
    mode: GameMode,
    session_id: number,
    player_names: string[],
    is_matched: boolean,
}

export enum StampId {
    None,
    Hello,
    Doki,
    Sugoi,
    Otsukare,
}

export interface ChatMessage {
    session_id: number,
    user_id: string,
    stamp_id: StampId,
    timestamp: number,
}

export class Protocol {
    static isOnlineMode(mode: GameMode): boolean {
        const onlines: GameMode[] = [
            GameMode.OnLineSingle_2, GameMode.OnLineSingle_3, GameMode.OnLineSingle_4,
            GameMode.OnLine2Players, GameMode.OnLineWatch ];
        return (onlines.indexOf(mode) !== -1);
    }

    static getGameModeName(mode: GameMode): string {
        switch (mode) {
            case GameMode.OffLine_2:
                return "2人バトル 😺 👻";
            case GameMode.OffLine_3:
                return "3人バトル 😺 👻 👾";
            case GameMode.OffLine_4:
                return "4人バトル 😺 👻 👾 🗿";
            case GameMode.OnLineSingle_2:
                return "2人バトル 😺 👻";
            case GameMode.OnLineSingle_3:
                return "3人バトル 😺 👻 👾";
            case GameMode.OnLineSingle_4:
                return "4人バトル 😺 👻 👾 🗿";
            case GameMode.OnLine2Players:
                return "2人バトル 😺 😺";
            case GameMode.OnLineWatch:
                return "観戦モード";
            case GameMode.None:
                return "";
            default:
                return "";
        }
    }

    static getNpcCount(mode: GameMode): number {
        switch (mode) {
            case GameMode.OffLine_2:
            case GameMode.OnLineSingle_2:
                return 1;
            case GameMode.OffLine_3:
            case GameMode.OnLineSingle_3:
                return 2;
            case GameMode.OffLine_4:
            case GameMode.OnLineSingle_4:
                return 3;
            case GameMode.OnLine2Players:
            case GameMode.OnLineWatch:
                return 0;
            case GameMode.None:
            default:
                return -1;
        }
    }

    static getPlayerCount(mode: GameMode): number {
        switch (mode) {
            case GameMode.OffLine_2:
            case GameMode.OnLineSingle_2:
            case GameMode.OffLine_3:
            case GameMode.OnLineSingle_3:
            case GameMode.OffLine_4:
            case GameMode.OnLineSingle_4:
                return 1;
            case GameMode.OnLine2Players:
                return 2;
            case GameMode.OnLineWatch:
                return 0;
            case GameMode.None:
            default:
                return -1;
        }
    }
}
