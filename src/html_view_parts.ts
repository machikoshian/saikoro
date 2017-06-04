import { PlayerId, Player } from "./board";
import { CardId, Facility, FacilityType, Character } from "./facility";
import { Session } from "./session";
import { PlayerCards } from "./card_manager";

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

function getPlayerColor(player_id: PlayerId): string {
    if (player_id === -1 || player_id > COLOR_PLAYERS.length) {
        return COLOR_FIELD;
    }
    return COLOR_PLAYERS[player_id];
}


export enum Visibility {
    Visible,
    Invisible,
    None,
}

export class HtmlViewObject {
    constructor(readonly element: HTMLElement) {
    }

    public setVisibility(visibility: Visibility): void {       
        if (visibility === Visibility.Visible) {
            this.element.style.visibility = "visible";
            this.element.style.display = "";
            return;
        }
        if (visibility === Visibility.Invisible) {
            this.element.style.visibility = "hidden";
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

    public showAt(x: number, y: number): void {
        // The parent element should be relative.
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.top = x + "px";
        this.element.style.left = y + "px";
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

    public setCardId(card_id: CardId): void {
        this.card_id = card_id;
    }

    public getCardId(): CardId {
        return this.card_id;
    }

    public draw(session: Session, card_id: CardId): void {
        this.card_id = card_id;

        // No card
        if (card_id === -1) {
            this.none();
            return;
        }

        // Character
        if (session.isCharacter(card_id)) {
            let character: Character = session.getCharacter(card_id);
            this.drawCharacterCard(character);
            return;
        }

        // Landmark
        if (session.isLandmark(card_id)) {
            let landmark: Facility = session.getFacility(card_id);
            let owner_id: PlayerId = session.getOwnerId(card_id);
            this.drawLandmarkCard(landmark, owner_id);
            return;
        }

        // Facility
        let facility: Facility = session.getFacility(card_id);
        this.drawFacilityCard(facility);
    }

    public drawFacilityCard(facility: Facility): void {
        let area: string = this.getFacilityAreaString(facility);
        this.element_name.innerText = `${area} ${facility.getName()}`;
        this.element_cost.innerText = String(facility.getCost());
        this.element_description.innerText = facility.getDescription();
        this.element.style.backgroundColor = getFacilityColor(facility);
        this.show();
    }

    public drawCharacterCard(character: Character): void {
        this.element_name.innerText = character.getName();
        this.element_cost.innerText = "";
        this.element_description.innerText = character.getDescription();
        this.element.style.backgroundColor = COLOR_CHARACTER;
        this.show();
    }

    public drawLandmarkCard(landmark: Facility, owner_id: PlayerId): void {
        this.element_name.innerText = landmark.getName();
        this.element_cost.innerText = String(landmark.getCost());
        this.element_description.innerText = landmark.getDescription();
        if (owner_id === -1) {
            this.element.style.backgroundColor = getFacilityColor(landmark);
        } else {
            this.element.style.backgroundColor = getPlayerColor(owner_id);
        }
        this.show();
    }

    public setHighlight(is_highlight: boolean): void {
        this.element.style.borderColor = is_highlight ? COLOR_HIGHTLIGHT_CARD : "#EEEEEE";
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

// HtmlFloatingCardView represents a parent <table> tag of HtmlCardView
// which represents a <td> tag. It is nice to use <div> instead and merge them.
// TODO: merge this class to HtmlCardView.
export class HtmlFloatingCardView extends HtmlViewObject {
    private card_view: HtmlCardView = null;

    constructor(element_id: string) {
        super(document.getElementById(element_id + "_node"));
        this.card_view = new HtmlCardView(element_id);
    }

    public setCardId(card_id: CardId): void {
        this.card_view.setCardId(card_id);
    }

    public getCardId(): CardId {
        return this.card_view.getCardId();
    }

    public draw(session: Session): void {
        let card_id: CardId = this.card_view.getCardId();
        if (card_id === -1) {
            this.none();
            return;
        }
        this.card_view.draw(session, card_id);
        this.show();
    }
}

export class HtmlPlayerView extends HtmlViewObject {
    readonly player_id: PlayerId;
    private element_name: HTMLElement;
    private element_money: HTMLElement;
    private element_salary: HTMLElement;
    private element_talon: HTMLElement;
    private money_animation_timer = null;
    private money: number = 0;

    constructor(player_id: PlayerId) {
        super(document.getElementById(`player_${player_id}`));
        this.player_id = player_id;
        this.element_name = document.getElementById(this.element.id + "_name");
        this.element_money = document.getElementById(this.element.id + "_money");
        this.element_salary = document.getElementById(this.element.id + "_salary");
        this.element_talon = document.getElementById(this.element.id + "_talon");
    }

    public draw(session: Session): void {
        this.show();
        let player: Player = session.getPlayer(this.player_id);
        this.element_name.innerText = player.name;
        this.element_salary.innerHTML = String(player.salary);
        let cards: PlayerCards = session.getPlayerCards(this.player_id);
        this.element_talon.innerHTML = `${cards.getHandSize()}　／　📇 ${cards.getTalonSize()}`;

        this.setMoney(player.getMoney());
    }

    public setMoney(money: number): void {
        this.money = money;
        this.animateMoney(money);
    }

    public addMoney(delta: number): void {
        this.money += delta;
        this.animateMoney(this.money);
    }

    // TODO: move this logic to HtmlViewObject ?
    private animateMoney(money: number): void {
        if (this.money_animation_timer) {
            clearInterval(this.money_animation_timer);
        }
        this.money_animation_timer = setInterval(() => {
            let current_money = Number(this.element_money.innerText);
            if (current_money === money) {
                clearInterval(this.money_animation_timer);
                this.money_animation_timer = null;
                return;
            }

            if (current_money > money) {
                current_money -= Math.min(10, current_money - money);
            }
            else {
                current_money += Math.min(10, money - current_money);
            }
            this.element_money.innerText = String(current_money);
        }, 5);
    }
}
