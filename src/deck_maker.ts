import { CardData, CardId, Facility, CardDataId, Character } from "./facility";
import { Board } from "./board";

class DeckData {
    public cards: { [key: number]: CardDataId }  = {};  // key is CardId.
    public board: Board = new Board();
    public chars: CardDataId[] = [-1, -1, -1, -1, -1];

    constructor() {
    }

    public toJSON(): Object {
        return {
            class_name: "DeckData",
            cards: this.cards,
            board: this.board.toJSON(),
            chars: this.chars,
        }
    }

    static fromJSON(json): DeckData {
        let deck_data: DeckData = new DeckData();
        deck_data.cards = json.cards;
        deck_data.board = Board.fromJSON(json.board);
        deck_data.chars = json.chars;
        return deck_data;
    }

    public getBoard(): Board {
        return this.board;
    }

    public setFacility(x: number, y: number, data_id: CardDataId): boolean {
        let facility: Facility = new Facility(data_id);  // TODO: Can refer FACILITY_DATA instead?

        // Check the facility's area.
        let valid: boolean = false;
        for (let s = 0; s < facility.size; ++s) {
            if (facility.area.indexOf(x + 1 - s) !== -1) {  // area is 1-origin.
                x = x - s;
                valid = true;
                break;
            }
        }
        if (!valid) {
            return false;
        }

        let size: number = facility.size;
        this.board.removeCards(x, y, size).map((removed: CardId) => {
            delete this.cards[removed];
        });
        let card_id: CardId = this.board.row * x + y;
        this.board.setCardId(x, y, card_id, size);
        this.cards[card_id] = data_id;
        return true;
    }

    public getFacility(card_id: CardId): Facility {
        return new Facility(this.cards[card_id]);  // TODO: Create a Facility pool.
    }

    public removeFacility(x: number, y: number): void {
        this.board.removeCards(x, y, 1).map((removed: CardId) => {
            delete this.cards[removed];
        });
    }

    public getDeck(): CardDataId[] {
        let deck: CardDataId[] = [];
        for (let key of Object.keys(this.cards)) {
            deck.push(this.cards[key]);
        }
        for (let data_id of this.chars) {
            if (data_id !== -1) {
                deck.push(data_id);
            }
        }
        return deck;
    }

    public setCharacter(x: number, data_id: CardDataId): void {
        this.chars[x] = data_id;
    }

    public getCharacter(x: number): Character {
        let data_id: CardDataId = this.chars[x];
        if (data_id === -1) {
            return null;
        }
        return new Character(data_id);
    }

    public removeCharacter(x): void {
        this.chars[x] = -1;
    }
}

export class DeckMaker {
    private data: DeckData[] = [];
    private deck_index: number = 0;
    private availables: CardDataId[][];

    constructor() {
        this.availables = [];
        for (let i: number = 0; i < 5; ++i) {
            this.data.push(new DeckData());
        }
        for (let x: number = 0; x < this.data[0].board.column; ++x) {
            this.availables[x] = CardData.getAvailableFacilities(x + 1);
        }
    }

    public toJSON(): Object {
        let data = this.data.map(data => { return data.toJSON(); });
        return {
            class_name: "DeckMaker",
            data: data,
            deck_index: this.deck_index,
        }
    }

    static fromJSON(json): DeckMaker {
        let deck_maker: DeckMaker = new DeckMaker();
        deck_maker.data = json.data.map(data => { return DeckData.fromJSON(data); });
        deck_maker.deck_index = json.deck_index;
        return deck_maker;
    }

    public save(): void {
        localStorage.deck = JSON.stringify(this.toJSON());
    }

    public load(): void {
        const json_string: string = localStorage.deck;
        if (json_string == undefined) {
            return;
        }
        const json = JSON.parse(json_string);
        if (json.data == undefined) {
            return;
        }
        this.data = json.data.map(data => { return DeckData.fromJSON(data); });
        this.deck_index = json.deck_index;
    }

    public getAvailableFacilities(x: number): CardDataId[] {
        return this.availables[x];
    }

    private getDeckData(): DeckData {
        return this.data[this.deck_index];
    }

    public getBoard(): Board {
        return this.getDeckData().board;
    }

    public changeDeckIndex(index: number): void {
        this.deck_index = index;
    }

    public setFacility(x: number, y: number, data_id: CardDataId): boolean {
        return this.getDeckData().setFacility(x, y, data_id);
    }

    public getFacility(card_id: CardId): Facility {
        return new Facility(this.getDeckData().cards[card_id]);  // TODO: Create a Facility pool.
    }

    public removeFacility(x: number, y: number): void {
        this.getDeckData().removeFacility(x, y);
    }

    public getDeck(): CardDataId[] {
        return this.getDeckData().getDeck();
    }

    public setCharacter(x: number, data_id: CardDataId): void {
        this.getDeckData().setCharacter(x, data_id);
    }

    public getCharacter(x: number): Character {
        return this.getDeckData().getCharacter(x);
    }

    public removeCharacter(x): void {
        this.getDeckData().removeCharacter(x);
    }
}
