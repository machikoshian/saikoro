import { Player, Board, PlayerId } from "./board";
import { CardId, FacilityDataId, FacilityType, Facility,
         Character, CharacterData, CharacterDataId, CharacterType } from "./facility";

export class PlayerCards {
    private talon: CardId[];    // 山札
    private hand: CardId[];     // 手札
    private field: CardId[];    // 使用中 (建設中)
    private discard: CardId[];  // 捨て札
    readonly max_hand: number = 10;

    constructor(
        talon: CardId[] = [],
        hand: CardId[] = [],
        field: CardId[] = [],
        discard: CardId[] = []) {
        this.talon = talon;
        this.hand = hand;
        this.field = field;
        this.discard = discard;
    }

    public toJSON(): Object {
        return {
            class_name: "PlayerCards",
            talon: this.talon,
            hand: this.hand,
            field: this.field,
            discard: this.discard,
        }
    }

    static fromJSON(json): PlayerCards {
        return new PlayerCards(json.talon, json.hand, json.field, json.discard);
    }

    public getSize(): number {
        return this.talon.length + this.hand.length + this.field.length + this.discard.length;
    }

    private getIndex(card_id: CardId, facility_array: CardId[]): number {
        // indexOf is type sensitive (e.g. "1" is different value from 1).
        // card_id could be a string.
        if (typeof card_id !== "number") {
            console.warn(`card_id(${card_id}) is not a number`);
            card_id = Number(card_id);
        }
        return facility_array.indexOf(card_id);
    }

    private deleteCardId(card_id: CardId, facility_array: CardId[]): boolean {
        let index: number = this.getIndex(card_id, facility_array);
        if (index < 0) {
            console.warn("deleteCardId - index < 0.");
            return false;
        }
        facility_array.splice(index, 1);
        return true;
    }

    private moveCardId(
        card_id: CardId, array_from: CardId[], array_to: CardId[]): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        if (!this.deleteCardId(card_id, array_from)) {
            console.warn("deleteCardId failed.");
            return false;
        }
        array_to.push(card_id);
        return true;
    }

    public addTalon(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        this.talon.push(card_id);
        return true;
    }

    public getTalon(): CardId[] {
        return this.talon;
    }

    public getHand(): CardId[] {
        return this.hand;
    }

    // Move a random facility from Talon to Hand.
    public dealToHand(): CardId {
        if (this.talon.length === 0 || this.hand.length === this.max_hand) {
            return -1;
        }
        let random_index: number = Math.floor(Math.random() * this.talon.length);
        let card_id: CardId = this.talon[random_index];
        this.moveTalonToHand(card_id);
        return card_id;
    }

    public getTalonSize(): number {
        return this.talon.length;
    }

    public getHandSize(): number {
        return this.hand.length;
    }

    public moveTalonToHand(card_id: CardId): boolean {
        if (this.hand.length === this.max_hand) {
            return false;
        }
        return this.moveCardId(card_id, this.talon, this.hand);
    }

    public isInHand(card_id: CardId): boolean {
        let index: number = this.getIndex(card_id, this.hand);
        return (index >= 0);
    }

    // Used for initial build.
    public moveTalonToField(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.talon, this.field);
    }

    public moveHandToField(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.hand, this.field);
    }

    public moveHandToDiscard(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.hand, this.discard);
    }

    public moveFieldToDiscard(card_id: CardId): boolean {
        return this.moveCardId(card_id, this.field, this.discard);
    }
}

type LandmarkInfo = [CardId, PlayerId];

export class CardManager {
    private facilities: { [key: number]: Facility; };
    private characters: { [key: number]: Character; };
    private player_cards_list: PlayerCards[];
    private landmarks: LandmarkInfo[];

    readonly max_card_size: number = 1000;
    readonly landmark_id_base: number = 10000;

    constructor(
        facilities: { [key: number]: Facility; } = {},
        characters: { [key: number]: Character; } = {},
        player_cards_list: PlayerCards[] = null,
        landmarks: LandmarkInfo[] = []) {
        this.facilities = facilities;
        this.characters = characters;
        if (player_cards_list) {
            this.player_cards_list = player_cards_list;
        } else {
            this.player_cards_list = [];
            for (let i: number = 0; i < 4; i++) {
                this.player_cards_list.push(new PlayerCards());
            }
        }
        this.landmarks = landmarks;
    }

    public toJSON(): Object {
        let facility_json = {};
        for (let id in this.facilities) {
            facility_json[id] = this.facilities[id].toJSON();
        }
        let character_json = {};
        for (let id in this.characters) {
            character_json[id] = this.characters[id].toJSON();
        }
        return {
            class_name: "CardManager",
            facilities: facility_json,
            characters: character_json,
            player_cards_list: this.player_cards_list.map(cards => { return cards.toJSON(); }),
            landmarks: this.landmarks,
        }
    }

    static fromJSON(json): CardManager {
        let facilities: { [key: number]: Facility; } = {};
        for (let id in json.facilities) {
            facilities[id] = Facility.fromJSON(json.facilities[id]);
        }
        let characters: { [key: number]: Character; } = {};
        for (let id in json.characters) {
            characters[id] = Character.fromJSON(json.characters[id]);
        }
        return new CardManager(
            facilities,
            characters,
            json.player_cards_list.map(cards => { return PlayerCards.fromJSON(cards); }),
            json.landmarks,
        );
    }

    public addFacility(player_id: PlayerId, facility_data_id: FacilityDataId): boolean {
        let player_cards: PlayerCards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        let size: number = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        let card_id: CardId = player_id * this.max_card_size + size;
        this.facilities[card_id] = new Facility(facility_data_id);
        player_cards.addTalon(card_id);
        return true;
    }

    public addCharacter(player_id: PlayerId, character_data_id: CharacterDataId): boolean {
        let player_cards: PlayerCards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        let size: number = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // Character card ID starts from 500.
        const char_base: CardId = 500;
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        let card_id: CardId = player_id * this.max_card_size + char_base + size;
        this.characters[card_id] = new Character(character_data_id);
        player_cards.addTalon(card_id);
        return true;
    }

    public addLandmark(landmark: Facility): CardId {
        let card_id: CardId = this.landmark_id_base + this.landmarks.length;
        this.facilities[card_id] = landmark;
        this.landmarks.push([card_id, -1]);  // NO_PLAYER.
        return card_id;
    }

    public buildLandmark(player_id: PlayerId, landmark_id: CardId): boolean {
        for (let landmark_info of this.landmarks) {
            if (landmark_info[0] === landmark_id) {
                landmark_info[1] = player_id;
                return true;
            }
        }
        return false;
    }

    public isCharacter(card_id: CardId): boolean {
        return (this.characters[card_id] != undefined);
    }

    public getCharacter(card_id: CardId): Character {
        if (card_id < 0) {
            return null;
        }
        return this.characters[card_id];
    }

    public isLandmark(card_id: CardId): boolean {
        for (let landmark_info of this.landmarks) {
            if (landmark_info[0] === card_id) {
                return true;
            }
        }
        return false;
    }

    public getLandmarks(): CardId[] {
        let landmarks: CardId[] = [];
        for (let landmark_info of this.landmarks) {
            landmarks.push(landmark_info[0]);
        }
        return landmarks;
    }

    public getFacility(card_id: CardId): Facility {
        if (card_id < 0) {
            return null;
        }
        return this.facilities[card_id];
    }

    public getOwner(card_id: CardId): PlayerId {
        if (card_id < 0) {
            return -1;
        }
        if (this.isLandmark(card_id)) {
            for (let landmark_info of this.landmarks) {
                if (landmark_info[0] === card_id) {
                    return landmark_info[1];
                }
            }
            return -1;
        }
        // TODO: Check actual existance of card_id.
        // TODO: Owner can be changed while the game.
        return Math.floor(card_id / this.max_card_size);
    }

    public getPlayerCards(player_id: PlayerId): PlayerCards {
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return null;
        }
        return this.player_cards_list[player_id];
    }

    public getPlayerCardsFromCardId(card_id: CardId): PlayerCards {
        if (card_id < 0 || card_id >= this.landmark_id_base) {
            return null;
        }
        return this.player_cards_list[this.getOwner(card_id)];
    }

    public isInHand(player_id: PlayerId, card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return false;
        }

        // Check is owner is correct.
        if (this.getOwner(card_id) !== player_id) {
            return false;
        }

        return this.player_cards_list[player_id].isInHand(card_id);
    }

    public isInArea(area: number, card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return (this.facilities[card_id].getArea().indexOf(area) !== -1);
    }

    public moveFieldToDiscard(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveFieldToDiscard(card_id);
    }

    public moveHandToField(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToField(card_id);
    }

    public moveHandToDiscard(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToDiscard(card_id);
    }

    // Used for initial build.
    public moveTalonToField(card_id: CardId): boolean {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveTalonToField(card_id);
    }

    private compareCharacters(id1: CardId, id2: CardId): number {
        let char1: Character = this.characters[id1];
        let char2: Character = this.characters[id2];
        return char1.data_id - char2.data_id;
    }

    private compareAreas(area1: number[], area2: number[]): number {
        let len1: number = area1.length;
        let len2: number = area2.length;
        for (let i: number = 0; i < Math.min(len1, len2); ++i) {
            if (area1[i] === area2[i]) {
                continue;
            }
            return area1[i] - area2[i];
        }
        return len1 - len2;
    }

    public sortFacilitiesForHand(facilities: CardId[]): CardId[] {
        return facilities.sort((id1, id2) => {
            // Check cases of character cards.
            let c1: number = this.isCharacter(id1) ? 1 : 0;
            let c2: number = this.isCharacter(id2) ? 1 : 0;
            if (c1 + c2 === 2) {
                return this.compareCharacters(id1, id2);
            }
            else if (c1 + c2 === 1) {
                return c1 - c2;
            }

            // Both IDs represents facilities.
            let f1: Facility = this.facilities[id1];
            let f2: Facility = this.facilities[id2];
            let comp_area = this.compareAreas(f1.area, f2.area);
            if (comp_area !== 0) {
                return comp_area;
            }
            else if (f1.type !== f2.type) {
                return f1.type - f2.type;
            }
            else if (f1.cost !== f2.cost) {
                return f1.cost - f2.cost;
            }
            else if (f1.name !== f2.name) {
                return f1.name < f2.name ? -1 : 1;
            }
            return 0;
        });
    }

    // Check if the facility is overwritable regardless the cost.
    public canOverwrite(card_id: CardId): boolean {
        if (this.isLandmark(card_id)) {
            return false;
        }
        return true;
    }
}

export class CardEffect {
    readonly data_id: CharacterDataId;
    readonly character: Character;  // TODO: Nice to merge it to CardManager?
    readonly round: number;
    readonly turn: number;

    constructor(data_id: CharacterDataId, round: number, turn: number) {
        this.data_id = data_id;
        this.character = new Character(data_id);
        this.round = round;
        this.turn = turn;
    }

    public toJSON(): Object {
        return {
            class_name: "CardEffect",
            data_id: this.data_id,
            // Character is not encoded. data_id can reproduce Character.
            round: this.round,
            turn: this.turn,
        };
    }

    static fromJSON(json): CardEffect {
        return new CardEffect(json.data_id, json.round, json.turn);
    }
}

export class EffectManager {
    private cards: CardEffect[];
    constructor(cards: CardEffect[] = []) {
        this.cards = cards;
    }

    public toJSON(): Object {
        let cards: Object[] = this.cards.map((card) => { return card.toJSON(); });
        return {
            class_name: "EffectManager",
            cards: cards,
        };
    }

    static fromJSON(json): EffectManager {
        let cards: CardEffect[] = json.cards.map((card) => { return CardEffect.fromJSON(card); });
        return new EffectManager(cards);
    }

    public addCard(data_id: CharacterDataId, round: number, turn: number): void {
        this.cards.push(new CardEffect(data_id, round, turn));
    }

    // Remove expired cards.
    public expire(round: number, turn: number): void {
        let new_cards: CardEffect[] = [];
        const round_factor: number = 10;  // Any number >= 4.
        for (let card of this.cards) {
            if ((card.round + card.character.round) * round_factor + card.turn >
                round * round_factor + turn) {
                new_cards.push(card);
            }
        }
        this.cards = new_cards;
    }

    public getDiceDelta(): number {
        let delta: number = 0;
        for (let card of this.cards) {
            if (card.character.type === CharacterType.DiceDelta) {
                delta += card.character.property["delta"];
            }
        }
        return delta;
    }
}
