import { Session, Phase } from "./session";
import { Player, PlayerId } from "./board";
import { CardId, Facility } from "./facility";
import { shuffle } from "./utils";
import * as Query from "./query";

export class AutoPlay {
    static play(session: Session): boolean {
        let player_id: PlayerId = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case Phase.CharacterCard:
            case Phase.DiceRoll:
                return AutoPlay.playDiceRoll(session);
            case Phase.BuildFacility:
                return AutoPlay.playBuildFacility(session);
            case Phase.FacilityActionWithInteraction:
                return AutoPlay.playInteractFacilityAction(session);
        }
        return false;
    }

    static playDiceRoll(session: Session): boolean {
        const player_id: PlayerId = session.getCurrentPlayerId();
        const query: Query.DiceQuery = {
            command: "dice",
            user_id: session.getPlayer(player_id).user_id,
            session_id: session.session_id,
            player_id: player_id,
            mode: -1,  // TODO: Fill a valid value.
            dice_num: 2,
            aim: 0,
        };
        return session.processDiceCommand(query);
    }

    static playInteractFacilityAction(session: Session): boolean {
        let player_id: PlayerId = session.getCurrentPlayerId();
        let target_facilities: CardId[] = session.getTargetFacilities();
        let target_id: PlayerId = (player_id === 0) ? 1 : 0;  // TODO: Fixme :)

        if (target_facilities.length === 0) {
            return false;
        }

        const query: Query.InteractQuery = {
            command: "interact",
            user_id: session.getPlayer(player_id).user_id,
            session_id: session.session_id,
            player_id: player_id,
            mode: -1,  // TODO: Fill a valid value.
            card_id: target_facilities[0],
            target_player_id: target_id,
        };
        return session.processInteractCommand(query);
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

        let query: Query.BuildQuery = {
            command: "build",
            user_id: session.getPlayer(player_id).user_id,
            session_id: session.session_id,
            player_id: player_id,
            mode: -1,  // TODO: Fill a valid value.
            x: -1,
            y: -1,
            card_id: -1,
        };

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
            query.x = x;
            query.y = y;
            query.card_id = card_id;
            return session.processBuildCommand(query);
        }
        return session.processBuildCommand(query);
    }
}