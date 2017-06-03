import { PlayerId } from "./board";
import { CardId, Facility, FacilityType } from "./facility";

// TODO: Move it to a new file for util.
const COLOR_FIELD: string = "#EFF0D1";
const COLOR_LANDMARK: string = "#B0BEC5";
const COLOR_CLICKABLE: string = "#FFCA28";
const COLOR_HIGHTLIGHT_CARD: string = "#FFE082";
const COLOR_CHARACTER: string = "#FFF9C4";
const COLOR_PLAYERS: string[] = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
const COLOR_GRAY: string = "#B0BEC5";
const COLOR_BLUE: string = "#90CAF9";
const COLOR_GREEN: string = "#A5D6A7";
const COLOR_RED: string = "#EF9A9A";
const COLOR_PURPLE: string = "#B39DDB";

function getFacilityColor(facility: Facility): string {
    if (!facility) {
        return COLOR_FIELD;
    }
    let type: FacilityType = facility.type;
    switch(type) {
        case FacilityType.Gray:
            return COLOR_GRAY;
        case FacilityType.Blue:
            return COLOR_BLUE;
        case FacilityType.Green:
            return COLOR_GREEN;
        case FacilityType.Red:
            return COLOR_RED;
        case FacilityType.Purple:
            return COLOR_PURPLE;
    }
}

export enum Visibility {
    Visible,
    Invisible,
    None,
}

class HtmlViewObject {
    constructor(readonly element: HTMLElement) {
    }

    public setVisibility(visibility: Visibility): void {       
        if (visibility === Visibility.Visible) {
            this.element.style.visibility = "visible";
            this.element.style.display = "";
            return;
        }
        if (visibility === Visibility.Invisible) {
            this.element.style.visibility = "invisible";
            this.element.style.display = "";
            return;
        }
        if (visibility === Visibility.None) {
            this.element.style.display = "none";
            return;
        }
    }

    public show(): void {
        this.setVisibility(Visibility.Visible);
    }

    public hide(): void {
        this.setVisibility(Visibility.Invisible);
    }

    public none(): void {  // TODO: Rename it to a better one.
        this.setVisibility(Visibility.None);
    }
}

export class HtmlCardsView extends HtmlViewObject {
    readonly MAX_CARDS: number = 10;
    readonly cards: HtmlCardView[] = [];
    private card_ids: CardId[] = [];

    constructor(readonly player_id: PlayerId) {
        super(document.getElementById(`cards_${player_id}`));
        for (let i: number = 0; i < this.MAX_CARDS; ++i) {
            this.cards.push(new HtmlCardView(`card_${player_id}_${i}`));
        }
    }

    // TODO: Not necessary?
    public setCardIds(card_ids: CardId[]): void {
        this.card_ids = card_ids;
        let i: number = 0;
        for (; i < card_ids.length; ++i) {
            this.cards[i].setCardId(card_ids[i]);
        }
        for (; i < this.MAX_CARDS; ++i) {
            this.cards[i].setCardId(-1);
        }
    }
}

export class HtmlCardView extends HtmlViewObject {
    private card_id: CardId = -1;
    private element_name: HTMLElement;
    private element_cost: HTMLElement;
    private element_description: HTMLElement;

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        this.element_name = document.getElementById(element_id + "_name");
        this.element_cost = document.getElementById(element_id + "_cost");
        this.element_description = document.getElementById(element_id + "_description");
    }

    // TODO: Not necessary?
    public setCardId(card_id: CardId): void {
        this.card_id = card_id;
    }

    public drawFacilityCard(facility: Facility): void {
        let area: string = this.getFacilityAreaString(facility);
        this.element_name.innerText = `${area} ${facility.getName()}`;
        this.element_cost.innerText = String(facility.getCost());
        this.element_description.innerText = facility.getDescription();
        this.element.style.backgroundColor = getFacilityColor(facility);
        this.show();
    }

    private getFacilityAreaString(facility: Facility): string {
        const area_name: string[] =
            ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", ""];

        let area: string = facility.getArea().map((i) => {
            if (facility.size === 2) {  // TODO: support more than 2, if necessary.
                return `${area_name[i]}+${area_name[i + 1]}`;
            }
            return area_name[i];
        }).join(",");

        return area;
    }
}