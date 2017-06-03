import { PlayerId } from "./board";

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
    constructor(readonly player_id: PlayerId) {
        super(document.getElementById(`cards_${player_id}`));
    }
}
