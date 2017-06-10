import { PlayerId, Player } from "./board";
import { CardId, Facility, FacilityType, Character } from "./facility";
import { Phase, Event, EventType, Session } from "./session";
import { PlayerCards } from "./card_manager";
import { DiceResult } from "./dice";

// TODO: Move it to a new file for util.
const COLOR_FIELD: string = "#FFE082";
const COLOR_LANDMARK: string = "#B0BEC5";
const COLOR_CLICKABLE: string = "#FFCA28";
const COLOR_INACTIVE: string = "#EEEEEE";
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
            this.element.style.visibility = "inherit";
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

    public clone(): HtmlViewObject {
        let new_node: Node = this.element.cloneNode(true);
        let new_element: HTMLElement = <HTMLElement>document.body.appendChild(new_node);
        return new HtmlViewObject(new_element);
    }

    public remove(): void {
        document.body.removeChild(this.element);
    }

    public getPosition(): [number, number] {
        let rect: ClientRect = this.element.getBoundingClientRect();
        return [rect.left, rect.top];
    }

    public addClickListener(callback: () => void) {
        this.element.addEventListener("click", callback);
    }

    public showAt([x, y]: [number, number]): void {
        // The parent element should be relative.
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.show();
    }

    public getPositionAligned(dst: ClientRect): [number, number] {
        const src: ClientRect = this.element.getBoundingClientRect();
        const x: number = dst.left + (dst.width  - src.width)  / 2;
        const y: number = dst.top  + (dst.height - src.height) / 2;
        return [x, y];
    }

    public getPositionAlignedWithElementId(element_id): [number, number] {
        const rect: ClientRect = document.getElementById(element_id).getBoundingClientRect();
        return this.getPositionAligned(rect);
    }

    public animateMoveToElementId(element_id: string): void {
        this.animateMoveTo(this.getPositionAlignedWithElementId(element_id));
    }

    public animateMoveTo([x, y]: [number, number]): void {
        let rect_from = this.element.getBoundingClientRect();
        let diff_x: number = x - rect_from.left;
        let diff_y: number = y - rect_from.top;

        this.element.style.visibility = "visible";
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.top = rect_from.top + "px";
        this.element.style.left = rect_from.left + "px";

        this.element.style.transitionDuration = "1s";
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = `translate(${diff_x}px, ${diff_y}px)`;

        window.setTimeout(() => { this.none(); }, 1500);
    }
}

export class HtmlCardsView extends HtmlViewObject {
    readonly cards: HtmlCardView[] = [];
    private card_ids: CardId[] = [];

    constructor(readonly element_id: string, readonly max_size: number) {
        super(document.getElementById(element_id));
        for (let i: number = 0; i < this.max_size; ++i) {
            let card_view: HtmlCardView = new HtmlCardView(`${element_id}_${i}`);
            this.cards.push(card_view);
            card_view.none();
        }
    }

    public draw(session: Session, card_ids: CardId[]): void {
        for (let i: number = 0; i < this.max_size; ++i) {
            this.cards[i].draw(session, (i < card_ids.length) ? card_ids[i] : -1);
        }
    }

    public getCardView(card_id: CardId): HtmlCardView {
        for (let card of this.cards) {
            if (card.getCardId() === card_id) {
                return card;
            }
        }
        return null;
    }

    // TODO: Not necessary?
    public setCardIds(card_ids: CardId[]): void {
        this.card_ids = card_ids;
        let i: number = 0;
        for (; i < card_ids.length; ++i) {
            this.cards[i].setCardId(card_ids[i]);
        }
        for (; i < this.max_size; ++i) {
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
        this.element_name = <HTMLElement>this.element.getElementsByClassName("card_name")[0];
        this.element_cost = <HTMLElement>this.element.getElementsByClassName("card_cost")[0];
        this.element_description = <HTMLElement>this.element.getElementsByClassName("card_description")[0];
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

export class HtmlMessageView extends HtmlViewObject {
    constructor(element_id: string) {
        super(document.getElementById(element_id));
    }

    public drawMessage(message: string, color: string = COLOR_FIELD): void {
        this.element.innerText = `🎲 ${message} 🎲`;
        this.element.style.backgroundColor = color;
    }
}

export class HtmlDeckCharView extends HtmlViewObject {
    public callback: (i: number) => void;
    readonly fields: HtmlViewObject[];
    readonly clickables: HtmlClickableFieldView[];

    constructor(element_id: string) {
        super(document.getElementById(element_id));
        this.fields = [];
        this.clickables = [];
        for (let i: number = 0; i < 5; ++i) {
            let field: HtmlViewObject = new HtmlViewObject(document.getElementById(`${element_id}_${i}`));
            this.fields.push(field);
            let clickable: HtmlClickableFieldView = new HtmlClickableFieldView(`clickable_${element_id}_${i}`);
            this.clickables.push(clickable);
            clickable.addClickListener(() => { this.onClick(i); });
        }
    }

    private onClick(i: number): void {
        this.callback(i);
    }

    public setHighlight(i: number, highlight: boolean): void {
        this.clickables[i].setClickable(highlight);
    }

    public drawCharacter(i: number, character: Character): void {
        let value: string = "";
        if (character != null) {
            value = character.name;
        }
        this.fields[i].element.innerText = value;
    }
}

export class HtmlButtonView extends HtmlViewObject {
    constructor(element_id: string) {
        super(document.getElementById(element_id));
    }

    public setClickable(is_clickable: boolean): void {
        // TODO: Use class of "clickable".
        this.element.style.backgroundColor = is_clickable ? COLOR_CLICKABLE : COLOR_FIELD;
    }
}

export class HtmlButtonsView extends HtmlViewObject {
    readonly dice1: HtmlButtonView;
    readonly dice2: HtmlButtonView;
    readonly char_card: HtmlButtonView;
    readonly end_turn: HtmlButtonView;

    constructor(element_id: string) {
        super(document.getElementById(element_id));

        this.dice1 = new HtmlButtonView(element_id + "_dice1");
        this.dice2 = new HtmlButtonView(element_id + "_dice2");
        this.char_card = new HtmlButtonView(element_id + "_char_card");
        this.end_turn = new HtmlButtonView(element_id + "_end_turn");
    }

    public draw(session: Session, player_id: PlayerId): void {
        if (session.getCurrentPlayerId() !== player_id) {
            this.none();
            return;
        }

        this.dice1.hide();
        this.dice2.hide();
        this.char_card.hide();
        this.end_turn.hide();

        let phase: Phase = session.getPhase();
        if (phase === Phase.CharacterCard || phase === Phase.DiceRoll) {
            this.dice1.show();
            this.dice2.show();
        }

        if (phase === Phase.CharacterCard) {
            this.char_card.show();
            this.char_card.setClickable(false);
        }

        if (phase === Phase.BuildFacility) {
            this.end_turn.show();
        }
        this.show();
    }
}

export class HtmlClickableFieldView extends HtmlViewObject {
    constructor(element_id: string) {
        super(document.getElementById(element_id));
    }

    public reset(): void {
        this.element.style.borderColor = "transparent";
    }

    public setClickable(is_clickable: boolean): void {
        // TODO: Use class of "clickable".
        this.element.style.borderColor = is_clickable ? COLOR_CLICKABLE : "transparent";
    }

    public setColor(color: string): void {
        this.element.style.borderColor = color;
    }
}

export class HtmlClickableFieldsView extends HtmlViewObject {
    readonly row: number;
    readonly column: number;
    readonly fields: HtmlClickableFieldView[][] = [];

    constructor(element_id: string, row: number, column: number) {
        super(document.getElementById(element_id));
        this.row = row;
        this.column = column;

        for (let x: number = 0; x < column; ++x) {
            this.fields.push([]);
            for (let y: number = 0; y < row; ++y) {
                this.fields[x].push(new HtmlClickableFieldView(`${element_id}_${x}_${y}`));
            }
        }
    }

    public resetAll(): void {
        for (let x: number = 0; x < this.column; ++x) {
            for (let y: number = 0; y < this.row; ++y) {
                this.fields[x][y].reset();
            }
        }
    }

    public setClickableAreas(areas: number[]): void {
        for (let area of areas) {
            let x: number = area - 1;
            for (let y: number = 0; y < this.row; ++y) {
                this.fields[x][y].setClickable(true);
            }
        }
    }

    public setClickable([x, y]: [number, number], is_clickable): void {
        this.fields[x][y].setClickable(is_clickable);
    }

    public animateDiceResult(pip: number, color: string): void {
        let x: number = pip - 1;
        let delay: number = 0;
        for (let i: number = 0; i < this.row; ++i) {
            let y = this.row - 1 - i;
            window.setTimeout(() => {
                this.fields[x][y].setColor(color);
                window.setTimeout(() => {
                    this.fields[x][y].setColor("transparent"); }, 1500);
            }, delay);
            delay = delay + 10 * i;  // 0, 10, 30, 60, 100, ...
        }
    }
}
