export class Facility {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }

  public toJSON(): Object {
    return {
      class_name: "Facility",
      name: this.name,
    }
  }

  static fromJSON(json) {
    return new Facility(json.name);
  }
}

export class Player {
  readonly id: number;
  readonly name: string;
  readonly money: number;
  readonly salary: number;
  readonly team: number;

  constructor(id: number, name: string, money: number, salary: number,
              team: number) {
    this.id = id;
    this.name = name;
    this.money = money;
    this.salary = salary;
    this.team = team;
  }

  public toJSON(): Object {
    return {
      class_name: "Player",
      id: this.id,
      name: this.name,
      money: this.money,
      salary: this.salary,
      team: this.team,
    }
  }

  static fromJSON(json): Player {
    return new Player(json.id, json.name, json.money, json.salary, json.color);
  }
}

enum Steps {
  // CardDraw,
  Start,
  CharacterCard,
  DiceRoll,
  // DiceRollAgain,
  FacilityAction,
  // FacilityAction2,
  // FacilityAction3,
  // FacilityAction4,
  // FacilityAction5,
  BuildFacility,
  CardRemoval,
  End,
}

export class State {
  private round: number;
  private turn: number;
  private current_player_id: number;
  private step: Steps;

  constructor() {
    this.round = 0;
    this.turn = 0;
    this.current_player_id = 0;
    this.step = Steps.BuildFacility;
  }

  public toJSON(): Object {
    return {
      class_name: "State",
      round: this.round,
      turn: this.turn,
      current_player_id: this.current_player_id,
      step: this.step,
    }
  }

  static fromJSON(json): State {
    let state: State = new State();
    state.round = json.round;
    state.turn = json.turn;
    state.current_player_id = json.current_player_id;
    state.step = json.step;
    return state;
  }

  public done(step: Steps): void {
    // TODO: Need to know all player info.
    if (this.current_player_id == 1) {
      this.current_player_id = 0;
    }
    else {
      this.current_player_id = 1;
    }
  }

  public getCurrentPlayerId(): number {
    return this.current_player_id;
  }

/*
  public getAvailableActions(): Steps[] {
    if (this.step == Steps.Start) {
      return [Steps.DiceRoll];
    }
    else if (this.step == Steps.DiceRoll) {
      return [Steps.FacilityAction];
    }
    else if (this.step == Steps.FacilityAction) {
      return [Steps.BuildFacility];
    }
    else if (this.step == Steps.BuildFacility) {
      return [Steps.CardRemoval];
    }
    else if (this.step == Steps.CardRemoval) {
      return [Steps.End];
    }
    // return a set of steps.
  }
*/
}

export class Session {
  private board: Board;
  private players: Player[];
  private state: State;

  constructor() {
    this.board = new Board();
    this.players = [];
    this.state = new State();
  }

  public toJSON(): Object {
    return {
      class_name: "Session",
      board: this.board.toJSON(),
      players: this.players.map(player => { return player.toJSON(); }),
      state: this.state.toJSON(),
    }
  }

  static fromJSON(json): Session {
    let board: Board = Board.fromJSON(json.board);
    let players: Player[] =
        json.players.map(player => { return Player.fromJSON(player); });
    let state: State = State.fromJSON(json.state);
    let session: Session = new Session();
    session.board = board;
    session.players = players;
    session.state = state;
    return session;
  }

  public addPlayer(name: string, money: number, salary: number): boolean {
    let player_id: number = this.players.length;
    if (player_id > 4) {
      return false;
    }
    // team == player_id (no 2vs2 so far).
    this.players.push(new Player(player_id, name, money, salary, player_id));
    return true;
  }

  public buildFacility(x: number, y: number,
                       facility: Facility, player_id: number): boolean {
    if (player_id >= this.players.length) {
      return false;
    }
    let player: Player = this.players[player_id];
    this.board.buildFacility(x, y, facility, player);

    this.state.done(Steps.BuildFacility);

    return true;
  }

  public getBoard(): Board {
    return this.board;
  }
  public getPlayers(): Player[] {
    return this.players;
  }
  public getState(): State {
    return this.state;
  }
  public getPlayer(player_id: number): Player {
    if (player_id == null) {
      return null;
    }
    return this.players[player_id];
  }
}

export class Field {
  private facility: Facility;
  readonly x: number;  // dice pips - 1
  readonly y: number;
  private owner_id: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.owner_id = -1;
  }

  public toJSON(): Object {
    return {
      class_name: "Field",
      facility: this.facility ? this.facility.toJSON() : null,
      x: this.x,
      y: this.y,
      owner_id: this.owner_id,
    }
  }

  static fromJSON(json): Field {
    let field: Field = new Field(json.x, json.y);
    if (json.facility) {
      field.facility = Facility.fromJSON(json.facility);
    }
    field.owner_id = json.owner_id;
    return field;
  }

  public getFacility(): Facility {
    return this.facility;
  }
  public getOwner(): number {
    return this.owner_id;
  }

  public buildFacility(facility: Facility, owner: Player):void {
    this.facility = facility;
    this.owner_id = owner.id;
  }

  debugString(): string {
    if (this.facility == undefined) {
      return `(${this.x},${this.y})`;
    }
    else {
      return this.facility.name;
    }
  }
}

export class Board {
  readonly fields: Field[][];
  readonly row: number = 5;
  readonly column: number = 12;

  constructor(fields = null) {
    if (fields) {
      this.fields = fields;
    }
    else {
      this.fields = [];
      for (let x: number = 0; x < this.column; ++x) {
        this.fields[x] = [];
        for (let y: number = 0; y < this.row; ++y) {
          this.fields[x][y] = new Field(x, y);
        }
      }
    }
  }

  public toJSON(): Object {
    let fields = [];
    for (let x: number = 0; x < this.column; ++x) {
      fields[x] = [];
      for (let y: number = 0; y < this.row; ++y) {
        fields[x][y] = this.fields[x][y].toJSON();
      }
    }

    return {
      class_name: "Board",
      fields: fields,
      row: this.row,
      column: this.column,
    }
  }

  static fromJSON(json): Board {
    let fields = [];
    for (let x: number = 0; x < json.column; ++x) {
      fields[x] = [];
      for (let y: number = 0; y < json.row; ++y) {
        fields[x][y] = Field.fromJSON(json.fields[x][y]);
      }
    }
    return new Board(fields);
  }

  buildFacility(x: number, y: number, facility: Facility, owner: Player):void {
    this.fields[x][y].buildFacility(facility, owner);
  }

  debugString(): string {
    let output: string = "";
    for (let y: number = 0; y < this.row; ++y) {
      for (let x: number = 0; x < this.column; ++x) {
        output += this.fields[x][y].debugString();
      }
      output += "\n";
    }
    return output;
  }
}
