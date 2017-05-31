import { CardData, CardId, Facility, FacilityDataId } from "./facility";
import { Board } from "./board";

export class DeckMaker {
    private deck: FacilityDataId[] = [];
    private cards: { [key: number]: FacilityDataId }  = {};  // key is CardId.
    readonly board: Board = new Board();
    private availables: FacilityDataId[][];

    constructor() {
        this.availables = [];
        for (let x: number = 0; x < this.board.column; ++x) {
            this.availables[x] = CardData.getAvailableFacilities(x + 1);
        }
    }

    public getAvailableFacilities(x: number): FacilityDataId[] {
        return this.availables[x];
    }

    public setFacility(x: number, y: number, data_id: FacilityDataId): boolean {
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

    public getFacilityDataIds(): FacilityDataId[] {
        return Object.keys(this.cards).map((key) => { return this.cards[key]; });
    }
}