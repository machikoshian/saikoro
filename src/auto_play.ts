import { Session, Phase } from "./session";
import { PlayerId } from "./board";

export class AutoPlay {
    static play(session: Session): boolean {
        let player_id: PlayerId = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case Phase.CharacterCard:
            case Phase.DiceRoll:
                return session.diceRoll(player_id, 2, 0);
            case Phase.BuildFacility:
                return session.buildFacility(player_id, -1, -1, -1);
        }
        return false;
    }
}