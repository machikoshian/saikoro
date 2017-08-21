import { PlayerId, Player, Board } from "./board";
import { CardId, CardDataId, CardData, Facility, FacilityType, Character } from "./facility";
import { Phase, Event, EventType, Session } from "./session";
import { PlayerCards } from "./card_manager";
import { DiceResult } from "./dice";
import { DiceEffects, DiceNum, Position } from "./types";
import { Protocol } from "./protocol";

// TODO: Move it to a new file for util.
const COLOR_FIELD: string = "#FFE082";
const COLOR_LANDMARK: string = "#B0BEC5";
const COLOR_CLICKABLE: string = "#FFCA28";
const COLOR_INACTIVE: string = "#EEEEEE";
const COLOR_HIGHTLIGHT_CARD: string = "#FFE082";
const COLOR_CHARACTER: string = "#FFF9C4";
const COLOR_GRAY: string = "#B0BEC5";
const COLOR_BLUE: string = "#90CAF9";
const COLOR_GREEN: string = "#A5D6A7";
const COLOR_RED: string = "#EF9A9A";
const COLOR_PURPLE: string = "#B39DDB";

export type PlayerIdCallback = (player_id: PlayerId) => void;
export type CardIdCallback = (card_id: CardId) => void;
export type CardDataIdCallback = (card_data_id: CardDataId) => void;
export type PositionCallback = (position: Position) => void;

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

    public isVisible(): boolean {
        if (this.element.offsetParent == null) {
            return false;
        }
        return true;
    }

    public reset() {}

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
        this.element.parentElement.removeChild(this.element);
    }

    public width(): number {
        return this.element.getBoundingClientRect().width;
    }

    public getPosition(): [number, number] {
        let rect: ClientRect = this.element.getBoundingClientRect();
        return [rect.left + window.pageXOffset, rect.top + window.pageYOffset];
    }

    public getZIndex(): number {
        return Number(this.element.style.zIndex);
    }

    public setZIndex(z: number): void {
        this.element.style.zIndex = String(z);
    }

    public addClickListener(callback: () => void) {
        this.element.addEventListener("click", callback);
    }

    public showAt([x, y]: [number, number]): void {
        // The parent element should be relative.
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.transitionDuration = "0s";
        this.element.style.transitionTimingFunction = "none";
        this.element.style.transform = "none";
        this.show();
    }

    public showAtElementId(element_id: string): void {
        this.show();
        this.showAt(this.getPositionAlignedWithElementId(element_id));
    }

    public moveTo([x, y]: [number, number]): void {
        if (!this.isVisible()) {
            this.showAt([x, y]);
            return;
        }
        const [src_x, src_y] = this.getPosition();
        if (src_x === 0 && src_y === 0) {
            this.showAt([x, y]);
            return;
        }

        // The parent element should be relative.
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.transitionDuration = "1s";
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = "none";
        this.show();
    }

    public moveToElementId(element_id: string): void {
        this.moveTo(this.getPositionAlignedWithElementId(element_id));
    }

    public getPositionAligned(dst: ClientRect): [number, number] {
        const src: ClientRect = this.element.getBoundingClientRect();
        const x: number = dst.left + window.pageXOffset + (dst.width  - src.width)  / 2;
        const y: number = dst.top  + window.pageYOffset + (dst.height - src.height) / 2;
        return [x, y];
    }

    public getPositionAlignedWithElementId(element_id): [number, number] {
        const rect: ClientRect = document.getElementById(element_id).getBoundingClientRect();
        return this.getPositionAligned(rect);
    }

    public animateMoveToElementId(element_id: string, duration: number = 1000): void {
        this.animateMoveTo(this.getPositionAlignedWithElementId(element_id), duration);
    }

    public animateMoveTo([x, y]: [number, number], duration: number = 1000): void {
        let [from_x, from_y] = this.getPosition();
        let diff_x: number = x - from_x;
        let diff_y: number = y - from_y;

        this.element.style.visibility = "visible";
        this.element.style.zIndex = "200";
        this.element.style.position = "absolute";
        this.element.style.left = from_x + "px";
        this.element.style.top = from_y + "px";

        this.element.style.transitionDuration = `${duration / 1000}s`;
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = `translate(${diff_x}px, ${diff_y}px)`;
    }
}

export class HtmlHomeNameView extends HtmlViewObject {
    private name: string = "";
    private random_name: string = "";

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        if (localStorage.name != undefined) {
            this.name = localStorage.name;
            (<HTMLInputElement>this.element).value = this.name;
        }
        else {
            const NAMES = ["コロまる", "ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石", "ハルカ"];
            const name_index = Math.floor(Math.random() * NAMES.length);
            this.random_name = NAMES[name_index];
            (<HTMLInputElement>this.element).value = this.random_name;
        }
    }

    public checkName(): string {
        const input_name: string = (<HTMLInputElement>this.element).value;
        if (input_name === this.name || input_name === this.random_name) {
            return input_name;
        }
        this.name = input_name;
        localStorage.name = input_name;
        return input_name;
    }
}

export class HtmlCardsView extends HtmlViewObject {
    private card_id_map: { [card_id: number]: number } = {};  // CardId -> CardDataId
    private card_ids: CardId[] = [];
    private cards_pool: { [data_id: number]: HtmlCardView } = {};
    public y_offset: number = 0;

    private callback: CardIdCallback = null;
    readonly base_z_index = 10;

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        this.setZIndex(this.base_z_index);
    }

    public reset(): void {
        this.resetClickable();
        this.card_id_map = {};
        this.card_ids = [];
        const keys: string[] = Object.keys(this.cards_pool);
        for (let key of keys) {
            this.cards_pool[Number(key)].remove();
        }
        this.cards_pool = {};
        this.y_offset = 0;
        super.reset();
    }

    private onClick(card_id: CardId, data_id: CardDataId) {
        for (let i: number = 0; i < this.card_ids.length; ++i) {
            this.getCardView(this.card_ids[i]).setZIndex(this.base_z_index + i);
        }

        let card_view: HtmlCardView = this.getCardView(card_id);
        card_view.setZIndex(this.base_z_index + this.card_ids.length + 1);

        if (this.callback == null) {
            return;
        }
        this.resetPosition();
        this.callback(card_view.card_id);
    }

    public draw(session: Session, card_ids: CardId[]): void {
        this.show();

        const [base_x, base_y]: [number ,number] = this.getPosition();

        // Update card_id_map.
        // TODO: move this to other.
        for (let card_id of card_ids) {
            this.card_id_map[card_id] = session.getCardDataId(card_id);

            if (session.isLandmark(card_id)) {
                this.getCardView(card_id).setOwnerId(session.getOwnerId(card_id));
            }
        }

        // Removed cards
        for (let card_id of this.card_ids) {
            if (card_ids.indexOf(card_id) === -1) {
                this.getCardView(card_id).none();
            }
        }

        // Added cards
        for (let card_id of card_ids) {
            if (this.card_ids.indexOf(card_id) === -1) {
                this.getCardView(card_id).showAt([-200, base_y]);
            }
        }
        this.card_ids = card_ids.slice();  // Shallow copy.
        this.resetPosition();
    }

    public resetPosition(): void {
        const num_cards: number = this.card_ids.length;
        if (num_cards === 0) {
            return;
        }

        const [base_x, base_y]: [number ,number] = this.getPosition();
        const base_width: number = this.width();
        const card_width: number = this.getCardView(this.card_ids[0]).width();
        let x_delta: number = (base_width - card_width) / (num_cards - 1);
        x_delta = Math.min(x_delta, card_width);
        for (let i: number = 0; i < num_cards; ++i) {
            let card_view: HtmlCardView = this.getCardView(this.card_ids[i]);
            card_view.setZIndex(this.base_z_index + i);
            card_view.moveTo([base_x + x_delta * i, base_y + this.y_offset]);
        }
    }

    public getCardView(card_id: CardId): HtmlCardView {
        let card_view: HtmlCardView = this.cards_pool[card_id];
        if (card_view != undefined) {
            return card_view;
        }

        let base: HTMLElement = document.getElementById("card_widget");
        let new_node: Node = base.cloneNode(true);
        let new_element: HTMLElement = <HTMLElement>this.element.appendChild(new_node);
        new_element.id = `card_id_${card_id}`;
        const data_id: CardDataId = this.card_id_map[card_id];
        card_view = new HtmlCardView(new_element.id, data_id, card_id);
        card_view.addClickListener(() => { this.onClick(card_id, data_id); });
        card_view.none();
        card_view.setZIndex(this.base_z_index);
        this.cards_pool[card_id] = card_view;
        return card_view;
    }

    public addCard(data_id: CardDataId, card_id: CardId, element_id: string): void {
        this.card_id_map[card_id] = data_id;
        this.card_ids.unshift(card_id);
        this.getCardView(card_id).showAtElementId(element_id);
        this.resetPosition();
    }

    public useCard(card_id: CardId, element_id: string): void {
        const index: number = this.card_ids.indexOf(card_id);
        if (index === -1) {
            return;
        }

        if (!CardData.isLandmark(this.card_id_map[card_id])) {
            this.card_ids.splice(index, 1);
        }

        let card_view: HtmlCardView = this.getCardView(card_id);
        card_view.moveToElementId(element_id);
        window.setTimeout(() => {
            if (!CardData.isLandmark(this.card_id_map[card_id])) {
                card_view.none();
            }
            this.resetPosition();
        }, 1000);
    }

    public resetClickable(): void {
        for (let i: number = 0; i < this.card_ids.length; ++i) {
            this.getCardView(this.card_ids[i]).setHighlight(false);
        }
        this.resetPosition();
        this.callback = null;
    }

    public setCharCardsClickable(callback: CardIdCallback): void {
        let delay: number = 0;
        for (let i: number = 0; i < this.card_ids.length; ++i) {
            let card: HtmlCardView = this.getCardView(this.card_ids[i]);
            if (!CardData.isCharacter(card.getDataId())) {
                continue;
            }
            let [x, y] = card.getPosition();
            const delta_y: number = -250;
            window.setTimeout(() => {
                card.moveTo([x, y + delta_y]);
            }, delay);
            delay += 200;
            card.setHighlight(true);
        }
        this.callback = callback;
    }

    public setFacilityCardsClickable(callback: CardIdCallback): void {
        let delay: number = 0;
        for (let i: number = 0; i < this.card_ids.length; ++i) {
            let card: HtmlCardView = this.getCardView(this.card_ids[i]);
            if (CardData.isCharacter(card.getDataId())) {
                continue;
            }
            card.setHighlight(true);
        }
        this.callback = callback;
    }
}

export class HtmlDeckButtonsView extends HtmlViewObject {
    private buttons: HtmlButtonView[] = [];
    public callback: (i: number) => void;
    readonly deck_size: number = 5;

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        for (let i = 0; i < this.deck_size; ++i) {
            let button: HtmlButtonView = new HtmlButtonView(`deck_button_${i}`);
            button.addClickListener(() => { this.onClick(i); });
            this.buttons.push(button);
        }
    }

    private onClick(deck_index: number) {
        for (let i = 0; i < this.deck_size; ++i) {
            this.buttons[i].element.classList.toggle("selected", deck_index === i);
        }

        if (this.callback == null) {
            return;
        }
        this.callback(deck_index);
    }
}

export class HtmlDeckCardsView extends HtmlViewObject {
    private cards_pool: { [data_id: number]: HtmlCardDataView } = {};
    private data_ids: CardDataId[] = [];
    public callback: CardDataIdCallback = null;
    readonly base_z_index = 10;

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        this.setZIndex(this.base_z_index);
    }

    private onClick(data_id: CardDataId) {
        for (let i: number = 0; i < this.data_ids.length; ++i) {
            this.getCardView(this.data_ids[i]).setZIndex(this.base_z_index + i);
        }

        let card_view: HtmlCardDataView = this.getCardView(data_id);
        card_view.setZIndex(this.base_z_index + this.data_ids.length + 1);

        if (this.callback == null) {
            return;
        }
        this.resetPosition();
        this.callback(data_id);
    }

    private getCardView(data_id: CardDataId): HtmlCardDataView {
        let card_view: HtmlCardDataView = this.cards_pool[data_id];
        if (card_view != undefined) {
            return card_view;
        }

        let base: HTMLElement = document.getElementById("card_widget");
        let new_node: Node = base.cloneNode(true);
        let new_element: HTMLElement = <HTMLElement>this.element.appendChild(new_node);
        new_element.id = `card_data_id_${data_id}`;
        card_view = new HtmlCardDataView(new_element.id, data_id);
        card_view.addClickListener(() => { this.onClick(data_id); });
        card_view.none();
        card_view.setZIndex(this.base_z_index);
        this.cards_pool[data_id] = card_view;
        return card_view;
    }

    public draw(data_ids: CardDataId[]): void {
        for (let data_id of this.data_ids) {
            if (data_ids.indexOf(data_id) === -1) {
                this.getCardView(data_id).moveTo([-200, 0]);
            }
        }

        for (let data_id of data_ids) {
            if (this.data_ids.indexOf(data_id) === -1) {
                this.getCardView(data_id).showAt([-200, 0]);
            }
        }
        this.data_ids = data_ids;
        this.resetPosition();
    }

    public resetPosition(): void {
        const cols: number = 6;
        const num_cards: number = this.data_ids.length;
        if (num_cards === 0) {
            return;
        }

        const [base_x, base_y]: [number ,number] = this.getPosition();
        const base_width: number = this.width();
        const card_width: number = this.getCardView(this.data_ids[0]).width();
        let x_delta: number = (base_width - card_width) / (Math.min(num_cards, cols) - 1);
        x_delta = Math.min(x_delta, card_width);
        for (let i: number = 0; i < num_cards; ++i) {
            let card_view: HtmlCardDataView = this.getCardView(this.data_ids[i]);
            card_view.moveTo([base_x + x_delta * (i % cols), 145 * Math.floor(i / cols)]);
        }
    }
}

export class HtmlCardBaseView extends HtmlViewObject {
    private element_name: HTMLElement;
    private element_cost: HTMLElement;
    private element_description: HTMLElement;
    protected data_id: CardDataId = -1;
    protected owner_id: PlayerId = -1;
    public is_highlight: boolean = false;

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        this.element_name = <HTMLElement>this.element.getElementsByClassName("card_name")[0];
        this.element_cost = <HTMLElement>this.element.getElementsByClassName("card_cost")[0];
        this.element_description = <HTMLElement>this.element.getElementsByClassName("card_description")[0];
    }

    public getDataId(): CardDataId {
        return this.data_id;
    }

    public setDataId(data_id: CardDataId): void {
        this.data_id = data_id;
        // No card
        if (data_id === -1) {
            this.none();
            return;
        }

        // Character
        if (CardData.isCharacter(data_id)) {
            let character: Character = new Character(data_id);
            this.setCharacterCard(character);
            return;
        }

        // Landmark
        if (CardData.isLandmark(data_id)) {
            let landmark: Facility = new Facility(data_id);
            let owner_id: PlayerId = -1;
            this.setLandmarkCard(landmark, owner_id);
            return;
        }

        // Facility
        let facility: Facility = new Facility(data_id);
        this.setFacilityCard(facility);
    }

    public setOwnerId(owner_id: PlayerId): void {
        this.owner_id = owner_id;
        if (!CardData.isLandmark(this.data_id)) {
            return;
        }

        for (let i: number = 0; i < 4; ++i) {
            this.element.classList.toggle(`player_${i}`, (owner_id === i));
        }
        this.element.style.backgroundColor = (owner_id === -1) ? COLOR_LANDMARK : null;
    }

    public setFacilityCard(facility: Facility): void {
        let area: string = this.getFacilityAreaString(facility);
        this.element_name.innerText = `${area} ${facility.getName()}`;
        this.element_cost.innerText = String(facility.getCost());
        this.element_description.innerText = facility.getDescription();
        this.element.style.backgroundColor = getFacilityColor(facility);
    }

    public setCharacterCard(character: Character): void {
        this.element_name.innerText = character.getName();
        this.element_cost.innerText = "";
        this.element_description.innerText = character.getDescription();
        this.element.style.backgroundColor = COLOR_CHARACTER;
    }

    public setLandmarkCard(landmark: Facility, owner_id: PlayerId): void {
        this.element_name.innerText = landmark.getName();
        this.element_cost.innerText = String(landmark.getCost());
        this.element_description.innerText = landmark.getDescription();
        this.setOwnerId(owner_id);
    }

    public setHighlight(is_highlight: boolean): void {
        this.is_highlight = is_highlight;
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

export class HtmlCardView extends HtmlCardBaseView {
    constructor(readonly element_id: string,
                data_id: CardDataId,
                readonly card_id: CardId) {
        super(element_id);
        this.setDataId(data_id);
    }
}

export class HtmlCardWidgetView extends HtmlCardBaseView {}

export class HtmlCardDataView extends HtmlCardBaseView {
    constructor(readonly element_id: string, data_id: CardDataId) {
        super(element_id);
        this.setDataId(data_id);
    }
}

export class HtmlPlayersView extends HtmlViewObject {
    readonly players: HtmlPlayerView[] = [];
    private players_length: number = 0;
    private callback: PlayerIdCallback;

    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
        for (let pid = 0; pid < 4; ++pid) {
            let player_view: HtmlPlayerView = new HtmlPlayerView(pid);
            player_view.callback = (player_id: PlayerId) => {
                this.onClick(player_id);
            }
            this.players.push(player_view);
        }
    }

    public reset(): void {
        for (let player of this.players) {
            player.reset();
        }
    }

    private onClick(player_id: PlayerId): void {
        for (let player of this.players) {
            player.setClickable(false);
        }
        this.callback(player_id);
    }

    public draw(session: Session): void {
        let players: Player[] = session.getPlayers();
        this.players_length = players.length;
        for (let i: number = 0; i < this.players_length; ++i) {
            this.players[i].draw(session);
        }
        for (let i: number = this.players_length; i < 4; ++i) {
            this.players[i].hide();
        }
        this.show();
    }

    public setClickableForPlayer(player_id: PlayerId, callback: PlayerIdCallback): void {
        for (let i: number = 0; i < this.players_length; ++i) {
            this.players[i].setClickable(player_id !== i);
        }
        this.callback = callback;
    }
}

export class HtmlPlayerView extends HtmlViewObject {
    readonly player_id: PlayerId;
    private element_avatar: HTMLElement;
    private element_name: HTMLElement;
    private element_money: HTMLElement;
    private element_salary: HTMLElement;
    private element_hand: HTMLElement;
    private element_talon: HTMLElement;
    private money_animation_timer = null;
    private money: number = 0;
    private is_clickable: boolean = false;
    public callback: (player_id: PlayerId) => void;

    constructor(player_id: PlayerId) {
        super(document.getElementById(`player_${player_id}`));
        this.player_id = player_id;
        this.element_avatar = <HTMLElement>this.element.getElementsByClassName("player_avatar")[0];
        this.element_name   = <HTMLElement>this.element.getElementsByClassName("player_name")[0];
        this.element_money  = <HTMLElement>this.element.getElementsByClassName("player_money")[0];
        this.element_salary = <HTMLElement>this.element.getElementsByClassName("player_salary")[0];
        this.element_hand   = <HTMLElement>this.element.getElementsByClassName("player_hand")[0];
        this.element_talon  = <HTMLElement>this.element.getElementsByClassName("player_talon")[0];
        this.addClickListener(() => { this.onClick(); });
    }

    private onClick(): void {
        if (this.is_clickable) {
            this.callback(this.player_id);
        }
    }

    public reset(): void {
        this.element.classList.remove("team_0");
        this.element.classList.remove("team_1");
    }

    public draw(session: Session): void {
        this.show();

        let player: Player = session.getPlayer(this.player_id);

        // Team
        if (Protocol.isTeamMatch(session.mode)) {
            this.element.classList.toggle("team_0", player.team === 0);
            this.element.classList.toggle("team_1", player.team === 1);
        }

        // Avatar
        const npc_avatars: string[] = ["⛄", "👻", "👾", "🗿"];
        let avatar: string = "😺";
        if (player.isAuto()) {
            avatar = npc_avatars[this.player_id];
        }
        this.element_avatar.innerText = avatar;

        this.element_name.innerText = player.name;

        // Salary
        const boost: number = session.getSalaryBoost();
        this.element_salary.innerHTML = String(player.salary * boost);
        this.element_salary.classList.toggle("boosted", (boost !== 1.0));

        let cards: PlayerCards = session.getPlayerCards(this.player_id);
        this.element_hand.innerHTML = String(cards.getHandSize());
        this.element_talon.innerHTML = String(cards.getTalonSize());

        this.setMoney(player.getMoney());
    }

    public setClickable(is_clickable: boolean): void {
        this.is_clickable = is_clickable;
        if (is_clickable) {
            this.element.style.backgroundColor = COLOR_CLICKABLE;
        } else {
            this.element.style.backgroundColor = null;
        }
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
    private messages: [string, PlayerId][] = [];

    constructor(element_id: string) {
        super(document.getElementById(element_id));
    }

    public drawMessage(message: string, player_id: PlayerId = -1): void {
        this.messages.push([message, player_id]);
        this.element.innerText = `🎲 ${message} 🎲`;

        for (let i: number = 0; i < 4; ++i) {
            this.element.classList.toggle(`player_${i}`, (player_id === i));
        }
        this.element.style.backgroundColor = (player_id === -1) ? COLOR_FIELD : null;
    }

    public revertMessage(): void {
        if (this.messages.length < 2) {
            this.messages = [];
            this.drawMessage("");
            return;
        }
        this.messages.pop();
        const [message, player_id]: [string, PlayerId] = this.messages.pop();
        this.drawMessage(message, player_id);
    }
}

export class HtmlBoardView extends HtmlViewObject {
    readonly clickable_fields: HtmlClickableFieldsView;
    public callback: (x: number, y: number) => void;
    private dialogCallback: PositionCallback = null;

    constructor(element_id: string, row: number, column: number) {
        super(document.getElementById(element_id));

        this.clickable_fields = new HtmlClickableFieldsView("click", row, column);
        for (let y: number = 0; y < row; ++y) {
            for (let x: number = 0; x < column; ++x) {
                this.clickable_fields.fields[x][y].addClickListener(
                    () => { this.onClick(x, y); });
            }
        }
    }

    private onClick(x: number, y: number): void {
        if (this.dialogCallback != null) {
            if (this.isClickable([x, y])) {
                this.dialogCallback([x, y]);
                this.dialogCallback = null;
            }
        }
        else {
            this.callback(x, y);
        }
    }

    public clearEffects(): void {
        this.clickable_fields.reset();
    }

    public setClickable(position: [number, number], is_clickable: boolean): void {
        this.clickable_fields.setClickable(position, is_clickable);
    }

    public isClickable(position: [number, number]): boolean {
        return this.clickable_fields.isClickable(position);
    }

    public setHighlight(position: [number, number], color: string): void {
        this.clickable_fields.setHighlight(position, color);
    }

    public showCost(position: [number, number], cost: number): void {
        this.clickable_fields.showCost(position, cost);
    }

    public setFacilitiesClickable(session: Session, callback: PositionCallback): void {
        this.clearEffects();
        const board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                const facility_id: CardId = board.getRawCardId(x, y);
                if (session.isFacility(facility_id)) {
                    this.setClickable([x, y], true);
                }
            }
        }
        this.dialogCallback = callback;
    }

    public animateDiceResult(result: number, player_id: PlayerId): void {
        this.clickable_fields.animateDiceResult(result, player_id);
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

    public reset(): void {
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

    public setClickable([x, y]: [number, number], is_clickable: boolean): void {
        this.fields[x][y].setClickable(is_clickable);
    }

    public isClickable([x, y]: [number, number]): boolean {
        return this.fields[x][y].isClickable();
    }

    public setHighlight([x, y]: [number, number], color: string): void {
        this.fields[x][y].setColor(color);
    }

    public showCost([x, y]: [number, number], cost: number): void {
        this.fields[x][y].showCost(cost);
    }

    public animateDiceResult(pip: number, player_id: PlayerId): void {
        const x: number = pip - 1;
        if (x < 0 || 11 < x) {
            return;
        }
        let delay: number = 0;
        for (let i: number = 0; i < this.row; ++i) {
            const y = this.row - 1 - i;
            window.setTimeout(() => {
                this.fields[x][y].setPlayer(player_id);
                window.setTimeout(() => { this.fields[x][y].setPlayer(-1); }, 1500);
            }, delay);
            delay = delay + 10 * i;  // 0, 10, 30, 60, 100, ...
        }
    }
}

export class HtmlClickableFieldView extends HtmlViewObject {
    private is_clickable: boolean = false;

    constructor(element_id: string) {
        super(document.getElementById(element_id));
    }

    public reset(): void {
        this.element.style.borderColor = "transparent";
        this.element.innerText = "";
        this.is_clickable = false;
    }

    public isClickable(): boolean {
        return this.is_clickable;
    }

    public setClickable(is_clickable: boolean): void {
        this.is_clickable = is_clickable;
        // TODO: Use class of "clickable".
        this.element.style.borderColor = is_clickable ? COLOR_CLICKABLE : "transparent";
    }

    public setColor(color: string): void {
        this.element.style.borderColor = color;
    }

    public setPlayer(player_id: PlayerId): void {
        this.element.style.borderColor = null;
        for (let i: number = 0; i < 4; ++i) {
            this.element.classList.toggle(`player_${i}`, (player_id === i));
        }
    }

    public showCost(cost: number): void {
        this.element.innerText = String(cost);
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

export class HtmlCharCardButtonView extends HtmlButtonView {
    private is_open: boolean = false;
    public callback: (is_open: boolean) => void = null;

    constructor(element_id: string) {
        super(element_id);
        // TODO: Move this to HtmlButtonView.
        this.addClickListener(() => { this.onClick(); });
    }

    public reset(): void {
        this.is_open = false;
    }

    private onClick(): void {
        if (this.callback == null) {
            return;
        }
        this.is_open = !this.is_open;
        this.callback(this.is_open);
    }

    // TODO: move this function to other place/class.
    private hasCharacterCard(session: Session, player_id: PlayerId): boolean {
        let cards: CardId[] = session.getSortedHand(player_id);
        return session.isCharacter(cards[cards.length - 1]);
    }

    public draw(session: Session, player_id: PlayerId): void {
        if (this.hasCharacterCard(session, player_id)) {
            this.show();
            this.element.classList.remove("inactive");
        }
        else {
            // TODO: show it but keep inactive.
            this.element.classList.add("inactive");
        }
    }
}

export class HtmlButtonsView extends HtmlViewObject {
    readonly dice1: HtmlButtonView;
    readonly dice2: HtmlButtonView;
    readonly char_card: HtmlCharCardButtonView;
    readonly end_turn: HtmlButtonView;
    private dice_num: DiceNum = DiceNum.Any;

    constructor(readonly element_id: string, dice_widget: HtmlDiceView) {
        super(document.getElementById(element_id));

        this.dice1 = new HtmlButtonView(element_id + "_dice1");
        let dice1_1: HtmlViewObject = dice_widget.clone();
        dice1_1.element.id = "buttons_dice1_1";
        let dice2_1: HtmlViewObject = dice_widget.clone();
        dice2_1.element.id = "buttons_dice2_1";
        let dice2_2: HtmlViewObject = dice_widget.clone();
        dice2_2.element.id = "buttons_dice2_2";
        this.dice2 = new HtmlButtonView(element_id + "_dice2");
        this.dice1.element.appendChild(dice1_1.element);
        this.dice2.element.appendChild(dice2_1.element);
        this.dice2.element.appendChild(dice2_2.element);
        this.char_card = new HtmlCharCardButtonView(element_id + "_char_card");
        this.end_turn = new HtmlButtonView(element_id + "_end_turn");
    }

    public reset(): void {
        this.dice1.reset();
        this.dice2.reset();
        this.char_card.reset();
        this.end_turn.reset();
        super.reset();
    }

    public hide(): void {
        super.hide();
        this.char_card.reset();  // is_open -> false.
    }

    public hideDices(): void {
        this.dice1.hide();
        this.dice2.hide();
    }

    public showDices(): void {
        if (this.dice_num !== DiceNum.Two) {
            this.dice1.show();
        }
        if (this.dice_num !== DiceNum.One) {
            this.dice2.show();
        }
    }

    public draw(session: Session, player_id: PlayerId): void {
        if (session.getCurrentPlayerId() !== player_id) {
            this.hide();
            return;
        }

        this.dice_num = session.getDiceEffects().num;

        this.hideDices();
        this.char_card.hide();
        this.end_turn.hide();

        let phase: Phase = session.getPhase();
        if (phase === Phase.CharacterCard || phase === Phase.DiceRoll) {
            this.showDices();
        }

        if (phase === Phase.CharacterCard) {
            this.char_card.draw(session, player_id);
        }

        if (phase === Phase.BuildFacility) {
            this.end_turn.show();
        }
        this.show();
    }
}

export class HtmlDiceView extends HtmlViewObject {
    constructor(readonly element_id: string) {
        super(document.getElementById(element_id));
    }
}

export class HtmlChatButtonView extends HtmlViewObject {
    public stamp_box: HtmlViewObject;
    private stamps: HtmlViewObject[] = [];
    private prev_stamps: { [element_id: string]: HtmlViewObject } = {};
    public is_visible: boolean = false;
    public callback: (index: number) => void = null;

    constructor(readonly element_id: string, readonly stamp_box_id: string) {
        super(document.getElementById(element_id));
        this.stamp_box = new HtmlViewObject(document.getElementById(stamp_box_id));
        this.stamp_box.none();

        this.addClickListener(() => { this.toggleStampBox(); });

        let stamp_elements = this.stamp_box.element.getElementsByClassName("stamp");
        for (let i: number = 0; i < stamp_elements.length; ++i) {
            let stamp: HtmlViewObject = new HtmlViewObject(<HTMLElement>stamp_elements[i]);
            stamp.addClickListener(() => {
                if (this.callback) {
                    this.callback(i);
                }
                this.showStampBox(false);
            });
            this.stamps.push(stamp);
        }
    }

    public reset(): void {
        this.showStampBox(false);
        this.prev_stamps = {};
    }

    public showStampAt(index: number, element_id: string): void {
        let stamp: HtmlViewObject = this.stamps[index].clone();
        stamp.show();
        stamp.showAt(stamp.getPositionAlignedWithElementId(element_id));
        window.setTimeout(() => {
            if (this.prev_stamps[element_id] === stamp) {
                delete this.prev_stamps[element_id];
            }
            stamp.remove();
        }, 3000);

        let prev_stamp: HtmlViewObject = this.prev_stamps[element_id];
        if (prev_stamp) {
            prev_stamp.none();
        }
        this.prev_stamps[element_id] = stamp;
    }

    private toggleStampBox(): void {
        this.showStampBox(!this.is_visible);
    }

    private showStampBox(is_visible: boolean): void {
        if (is_visible) {
            this.is_visible = true;
            this.stamp_box.show();
            this.stamp_box.showAt(this.stamp_box.getPositionAlignedWithElementId("board"));
        }
        else {
            this.is_visible = false;
            this.stamp_box.none();
        }
    }
}