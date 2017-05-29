import { Session, Phase } from "./session";
import { Player, PlayerId } from "./board";
import { CardId, Facility } from "./facility";
import { shuffle } from "./utils";

export class AutoPlay {
    static play(session: Session): boolean {
        let player_id: PlayerId = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case Phase.CharacterCard:
            case Phase.DiceRoll:
                return session.diceRoll(player_id, 2, 0);
            case Phase.BuildFacility:
                return AutoPlay.playBuildFacility(session);
        }
        return false;
    }

    static playBuildFacility(session: Session): boolean {
        let landmarks: CardId[] = session.getLandmarks();
        let player_id: PlayerId = session.getCurrentPlayerId();
        let player: Player = session.getPlayer(player_id);
        let money: number = player.getMoney();

        for (let landmark of landmarks) {
            if (session.getOwnerId(landmark) !== -1) {
                continue;
            }

            if (money >= session.getFacility(landmark).getCost()) {
                return session.buildLandmark(player_id, landmark);
            }
        }

        let card_ids: CardId[] = session.getPlayerCards(player_id).getHand();

        for (let card_id of card_ids) {
            if (session.isCharacter(card_id)) {
                continue;
            }
            let facility: Facility = session.getFacility(card_id);
            if (money < facility.getCost()) {
                continue;
            }

            // TODO: Enabled to overwrite existing facilities.
            // availablePosition does not return overwritable facilities.
            let positions: [number, number][] = shuffle(session.availablePosition(card_id));
            if (positions.length === 0) {
                continue;
            }

            let [x, y] = positions[0];
            return session.buildFacility(player_id, x, y, card_id);
        }
        return session.buildFacility(player_id, -1, -1, -1);
    }
}