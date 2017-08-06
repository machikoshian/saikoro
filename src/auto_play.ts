import { Session, Phase } from "./session";
import { Player, PlayerId } from "./board";
import { CardId, Facility } from "./facility";
import { shuffle } from "./utils";
import * as Query from "./query";

export class AutoPlay {
    static getQuery(session: Session): Query.Query {
        let player_id: PlayerId = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case Phase.CharacterCard:
            case Phase.DiceRoll:
                return AutoPlay.getDiceQuery(session);
            case Phase.BuildFacility:
                return AutoPlay.getBuildQuery(session);
            case Phase.FacilityActionWithInteraction:
                return AutoPlay.getInteractQuery(session);
        }
        return null;
    }

    static getDiceQuery(session: Session): Query.DiceQuery {
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
        return query;
    }

    // Find the most rich target.
    static getTargetPlayer(session: Session, player_id: PlayerId): PlayerId {
        let money: number = -1;
        let target_id: PlayerId = -1;
        const team_id: number = session.getTeamId(player_id);
        const players: Player[] = session.getPlayers();
        for (let player of players) {
            if (player.team === team_id) {
                continue;
            }
            if (player.getMoney() > money) {
                money = player.getMoney();
                target_id = player.id;
            }
        }

        if (target_id === -1) {
            console.error("No valid target found.");
            target_id = (player_id === 0) ? 1 : 0;
        }
        return target_id;
    }

    static getInteractQuery(session: Session): Query.InteractQuery {
        let player_id: PlayerId = session.getCurrentPlayerId();
        let target_facilities: CardId[] = session.getTargetFacilities();
        let target_id: PlayerId = AutoPlay.getTargetPlayer(session, player_id);

        if (target_facilities.length === 0) {
            return null;
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
        return query;
    }

    static getBuildQuery(session: Session): Query.BuildQuery {
        let landmarks: CardId[] = session.getLandmarks();
        let player_id: PlayerId = session.getCurrentPlayerId();
        let player: Player = session.getPlayer(player_id);
        let money: number = player.getMoney();

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

        for (let landmark of landmarks) {
            if (session.getOwnerId(landmark) !== -1) {
                continue;
            }

            if (money >= session.getFacility(landmark).getCost()) {
                query.card_id = landmark;
                return query;
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
            query.x = x;
            query.y = y;
            query.card_id = card_id;
            return query;
        }
        return query;
    }
}