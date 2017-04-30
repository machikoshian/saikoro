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
  readonly id: number;  // TODO: How to assign an id number?
  readonly name: string;
  readonly money: number;
  readonly color: string;

  constructor(id: number, name: string, money: number, color: string) {
    this.id = id;
    this.name = name;
    this.money = money;
    this.color = color;
  }

  public toJSON(): Object {
    return {
      class_name: "Player",
      id: this.id,
      name: this.name,
      money: this.money,
      color: this.color,
    }
  }

  static fromJSON(json): Player {
    return new Player(json.id, json.name, json.money, json.color);
  }
}

export class Session {
  private board: Board;
  private players: Player[];

  constructor(board?: Board, players?: Player[]) {
    this.board = board ? board : new Board();
    this.players = players ? players : [];
  }

  public toJSON():Object {
    return {
      class_name: "Session",
      board: this.board.toJSON(),
      players: this.players.map(player => { player.toJSON(); }),
    }
  }

  static fromJSON(json): Session {
    let board: Board = Board.fromJSON(json.board);
    let players: Player[] =
        json.players.map(player => { Player.fromJSON(player); });
    let session:Session = new Session();
    session.board = board;
    session.players = players;
    return session;
    // return new Session(board, players);
  }

  public getBoard(): Board {
    return this.board;
  }
  public getPlayers(): Player[] {
    return this.players;
  }
}

export class Field {
  private facility: Facility;
  readonly x: number;  // dice pips - 1
  readonly y: number;
  private owner: Player;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toJSON(): Object {
    return {
      class_name: "Field",
      facility: this.facility ? this.facility.toJSON() : null,
      x: this.x,
      y: this.y,
      owner: this.owner ? this.owner.toJSON() : null,
    }
  }

  static fromJSON(json): Field {
    let field: Field = new Field(json.x, json.y);
    if (json.facility) {
      field.setFacility(Facility.fromJSON(json.facility));
    }
    if (json.owner) {
      field.setOwner(Player.fromJSON(json.owner));
    }
    return field;
  }

  public getFacility(): Facility {
    return this.facility;
  }

  public setFacility(facility: Facility):void {
    this.facility = facility;
  }

  public getOwner(): Player {
    return this.owner;
  }

  public setOwner(owner: Player): void {
    this.owner = owner;
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

  setFacility(x: number, y: number, facility: Facility):void {
    this.fields[x][y].setFacility(facility);
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
