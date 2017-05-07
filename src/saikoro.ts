import { Phase, Session, PlayerCards } from "./session";
import { Player, Board, Field, PlayerId } from "./board";
import { FacilityId, FacilityType, Facility } from "./facility";
import { Dice, DiceResult } from "./dice";

class HttpRequest {
    static Send(url: string, callback: (response: string) => void) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => HttpRequest.OnReadyStateChange(xhr,
            callback);
        xhr.open("GET", url, true);
    }

    static OnReadyStateChange(xhr: XMLHttpRequest,
        callback: (response: string) => void): void {
        switch (xhr.readyState) {
            case XMLHttpRequest.OPENED:
                xhr.send();
                break;
            case XMLHttpRequest.HEADERS_RECEIVED:
                console.log(xhr.getAllResponseHeaders());
                break;
            case XMLHttpRequest.LOADING:
                break;
            case XMLHttpRequest.DONE:
                callback(xhr.responseText);
                break;
        }
    }
}

class WebClient {
    public session: Session = new Session();
    public session_id: number = 0;
    public matching_id: number = 0;
    public player_id: PlayerId = 0;
    public step: number = 0;
    public clicked_facility_id: FacilityId = -1;
    public clicked_card_element: HTMLElement = null;
    public player_cards_list: FacilityId[][] = [];
    public callback: (response: string) => void;
    public check_update_timer: number = 0;
    public no_update_count: number = 0;

    constructor() {
        this.callback = this.callbackSession.bind(this);
    }

    public diceResultMessage(dice: DiceResult): string {
        let faces: string[] = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

        let d1: number = dice.dice1;
        let d2: number = dice.dice2;
        return `${faces[d1]} ${faces[d2]} : ${d1 + d2} でした。`;
    }

    public getPlayerColor(player: Player): string {
        // TODO: Support landmark colors (set / built).
        let colors = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];

        if (!player || player.id > colors.length) {
            return "#EFF0D1";
        }
        return colors[player.id];
    }

    public getFacilityColor(facility: Facility): string {
        if (!facility) {
            return "#EFF0D1";
        }
        let type: FacilityType = facility.type;
        switch(type) {
            case FacilityType.Gray:
                return "#B0BEC5";
            case FacilityType.Blue:
                return "#90CAF9";
            case FacilityType.Green:
                return "#A5D6A7";
            case FacilityType.Red:
                return "#EF9A9A";
            case FacilityType.Purple:
                return "#B39DDB";
        }
    }

    public resetCards(): void {
        if (this.clicked_card_element) {
            this.clicked_card_element.style.borderColor = "#EEEEEE";
            this.clicked_card_element = null;
        }
        this.clicked_facility_id = -1;
    }

    public onClickField(x, y): void {
        console.log(`clicked: field_${x}_${y}`);
        if (this.clicked_facility_id < 0) {
            return;
        }
        HttpRequest.Send(
            `/command?command=build&session_id=${this.session_id}&player_id=${this.player_id}&x=${x}&y=${y}&facility_id=${this.clicked_facility_id}`,
            this.callback);
    }

    public onClickDice(dice_num: number, aim: number): void {
        console.log(`clicked: dice_num:${dice_num}, aim:${aim}`);
        HttpRequest.Send(`/command?command=dice&session_id=${this.session_id}&player_id=${this.player_id}&dice_num=${dice_num}&aim=${aim}`,
            this.callback);
    }

    public onClickEndTurn(): void {
        console.log("clicked: end_turn");
        HttpRequest.Send(
            `/command?command=build&session_id=${this.session_id}&player_id=${this.player_id}&x=-1&y=-1&facility_id=-1`,
            this.callback);
    }

    public onClickCard(player: number, card: number): void {
        if (this.session.getState().getPhase() !== Phase.BuildFacility) {
            return;
        }

        console.log(`clicked: card_${player}_${card}`);
        this.resetCards();
        this.clicked_card_element = document.getElementById(`card_${player}_${card}`);
        this.clicked_card_element.style.borderColor = "#FFE082";
        this.clicked_facility_id = this.player_cards_list[player][card];

        this.updateBoard(this.session);

        let x: number = this.session.getFacility(this.clicked_facility_id).getArea() - 1;
        for (let y: number = 0; y < 5; y++) {
            let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
            // TODO: Keep the owner's color too.
            field.style.backgroundColor = "#FFF176";
        }
    }

    public startCheckUpdate(): void {
        this.check_update_timer = setInterval(this.checkUpdate.bind(this), 2000);
    }
    public stopCheckUpdate(): void {
        clearInterval(this.check_update_timer);
    }

    public checkUpdate(): void {
        console.log(`checkUpdate(${this.step})`);
        HttpRequest.Send(`/command?command=board&session_id=${this.session_id}&step=${this.step}`, this.callback);
    }

    public callbackMatching(response: string): void {
        const response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.matching_id = response_json.matching_id;

        document.getElementById("matching").style.display = "none";
        document.getElementById("game").style.visibility = "visible";

        this.checkUpdate();
        this.startCheckUpdate();
    }

    public onClickMatching(): void {
        console.log("matching...");
        let name: string = (<HTMLInputElement>document.getElementById("matching_name")).value;
        if (name.length === 0) {
            return;
        }
        HttpRequest.Send(`/matching?name=${encodeURIComponent(name)}`, this.callbackMatching.bind(this));
    }

    public initBoard(column: number = 12, row: number = 5): void {
        // Add click listeners.
        for (let y: number = 0; y < row; ++y) {
            for (let x: number = 0; x < column; ++x) {
                document.getElementById(`field_${x}_${y}`).addEventListener(
                    "click", () => { this.onClickField(x, y); });
            }
        }

        // Dices
        document.getElementById("dice_1").addEventListener(
            "click", () => { this.onClickDice(1, 0); });
        document.getElementById("dice_2").addEventListener(
            "click", () => { this.onClickDice(2, 0); });

        // End turn
        document.getElementById("end_turn").addEventListener(
            "click", () => { this.onClickEndTurn(); });

        // Cards
        let player_size: number = 4;
        let card_size: number = 10;
        for (let p: number = 0; p < player_size; ++p) {
            for (let c: number = 0; c < card_size; ++c) {
                document.getElementById(`card_${p}_${c}`).addEventListener(
                    "click", () => { this.onClickCard(p, c); });
            }
        }

        document.getElementById("matching_button").addEventListener(
            "click", () => { this.onClickMatching(); });
        document.getElementById("game").style.visibility = "hidden";
    }

    private updateBoard(session: Session): void {
        let board: Board = session.getBoard();
        for (let y: number = 0; y < board.row; ++y) {
            for (let x: number = 0; x < board.column; ++x) {
                let facility: Facility = session.getFacilityOnBoard(x, y);
                let name: string = facility ? facility.getName() : "";
                let owner_id: PlayerId = session.getOwnerIdOnBoard(x, y);

                let field: HTMLElement = document.getElementById(`field_${x}_${y}`);
                field.innerText = name;
                if (facility && facility.getType() === FacilityType.Gray) {
                    field.style.backgroundColor = this.getFacilityColor(facility);
                }
                else {
                    field.style.backgroundColor = this.getPlayerColor(session.getPlayer(owner_id));
                }
                field.style.borderColor = this.getFacilityColor(facility);
            }
        }
    }

    // Do not directly call this method.
    // Use this.callback as a wrapper of this method.
    private callbackSession(response: string): void {
        if (!response) {
            console.log("Stop polling.");
            this.stopCheckUpdate();
        }

        // If the response is "{}", the server does not have any update.
        if (response === "{}") {
            console.log("Already updated.");

            // If no update continues 100 times, stop polling.
            this.no_update_count++;
            if (this.no_update_count > 100) {
                console.log("No update for a while.");
                this.stopCheckUpdate();
            }
            return;
        }

        this.no_update_count = 0;

        let session: Session = Session.fromJSON(JSON.parse(response));
        this.session = session;
        let player_id: PlayerId = session.getCurrentPlayerId();
        this.player_id = player_id;
        let step: number = session.getState().getStep();
        console.log(step);
        if (step == this.step) {
            console.log("Already updated.");
            return;
        }
        this.step = step;

        // Update board.
        this.updateBoard(session);

        // Update players.
        let players: Player[] = session.getPlayers();
        for (let i: number = 0; i < players.length; ++i) {
            document.getElementById(`player_${i}`).style.visibility = "visible";
            document.getElementById(`player_${i}_name`).innerText = players[i].name;

            let money_element = document.getElementById(`player_${i}_money`);
            let money: number = players[i].getMoney();
            let timer = setInterval(() => {
                let current_money = Number(money_element.innerText);
                if (current_money == money) {
                    clearInterval(timer);
                    return;
                }
                else if (current_money > money) {
                    current_money -= Math.min(10, current_money - money);
                }
                else if (current_money < money) {
                    current_money += Math.min(10, money - current_money);
                }
                money_element.innerHTML = String(current_money);
            }, 5);
            document.getElementById(`player_${i}_salary`).innerHTML = `${players[i].salary}`;
            let cards: PlayerCards = session.getPlayerCards(i);
            document.getElementById(`player_${i}_talon`).innerHTML =
                `${cards.getHandSize()}　／　📇 ${cards.getTalonSize()}`;
            document.getElementById(`cards_${i}`).style.display = "table-row";
        }
        for (let i: number = players.length; i < 4; ++i) {
            document.getElementById(`player_${i}`).style.visibility = "hidden";
            document.getElementById(`cards_${i}`).style.display = "none";
        }

        // Update message.
        let player: Player = players[player_id];
        let name: string = player.name;
        let message: string = "";
        if (session.getState().getPhase() == Phase.StartGame) {
            message = `🎲 マッチング中です 🎲`;
        }
        else if (session.getState().getPhase() == Phase.DiceRoll) {
            message = `🎲 ${name} のサイコロです 🎲`;
        }
        else if (session.getState().getPhase() == Phase.BuildFacility) {
            message = this.diceResultMessage(session.getDiceResult());
            message += `  🎲 ${name} の建設です 🎲`;
        }
        document.getElementById("message").innerText = message;
        document.getElementById("message").style.backgroundColor = this.getPlayerColor(player);

        // Update buttons.
        if (session.getState().getPhase() == Phase.DiceRoll) {
            document.getElementById("dice_1").style.visibility = "visible";
            document.getElementById("dice_2").style.visibility = "visible";
        }
        else {
            document.getElementById("dice_1").style.visibility = "hidden";
            document.getElementById("dice_2").style.visibility = "hidden";
        }

        if (session.getState().getPhase() == Phase.BuildFacility) {
            document.getElementById("end_turn").style.visibility = "visible";
        }
        else {
            document.getElementById("end_turn").style.visibility = "hidden";
        }

        // Update cards.
        this.player_cards_list = [];
        const area_name: string[] =
            ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫"];
        for (let i: number = 0; i < players.length; ++i) {
            let facility_ids: FacilityId[] = session.getSortedHand(i);
            this.player_cards_list.push(facility_ids);
            for (let j: number = 0; j < Math.min(10, facility_ids.length); ++j) {
                let facility: Facility = session.getFacility(facility_ids[j]);
                document.getElementById(`card_${i}_${j}`).style.display = "table-cell";
                document.getElementById(`card_${i}_${j}_name`).innerText =
                    `${area_name[facility.getArea()]} ${facility.getName()}`;
                document.getElementById(`card_${i}_${j}_cost`).innerText = String(facility.getCost());
                document.getElementById(`card_${i}_${j}_description`).innerText = facility.getDescription();
                document.getElementById(`card_${i}_${j}`).style.backgroundColor =
                    this.getFacilityColor(facility);
            }
            for (let j: number = Math.min(10, facility_ids.length); j < 10; ++j) {
                document.getElementById(`card_${i}_${j}`).style.display = "none";
            }
        }
        this.resetCards();  // Nice to check if built or not?
    }
}

let client: WebClient = new WebClient();
client.initBoard();
