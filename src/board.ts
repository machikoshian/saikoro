export class Facility {
  public name:string;
  constructor(name:string) {
    this.name = name;
  }

  public toJSON():Object {
    return {
      class_name: "Facility",
      name: this.name,
    }
  }

  static fromJSON(json) {
    return new Facility(json.name);
  }
}

export class Field {
  public name:string;
  public facility:Facility;
  private x:number;  // dice pips - 1
  private y:number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
    this.name = "(" + x + "," + y + ")";
  }

  public toJSON():Object {
    return {
      class_name: "Field",
      name: this.name,
      facility: this.facility ? this.facility.toJSON() : null,
      x: this.x,
      y: this.y,
    }
  }

  static fromJSON(json):Field {
    let field:Field = new Field(json.x, json.y);
    field.name = json.name;
    if (json.facility) {
      field.facility = Facility.fromJSON(json.facility);
    }
    return field;
  }

  debugString():string {
    if (this.facility == undefined) {
      return this.name;
    } else {
      return this.facility.name;
    }
  }
}

export class Board {
  private fields:Field[][];
  private row:number = 5;
  private column:number = 12;

  constructor(fields = null) {
    if (fields) {
      this.fields = fields;
    } else {
      this.fields = [];
      for (let x:number = 0; x < this.column; ++x) {
        this.fields[x] = [];
        for (let y:number = 0; y < this.row; ++y) {
          this.fields[x][y] = new Field(x, y);
        }
      }
    }
  }

  public toJSON():Object {
    let fields = [];
    for (let x:number = 0; x < this.column; ++x) {
      fields[x] = [];
      for (let y:number = 0; y < this.row; ++y) {
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

  static fromJSON(json):Board {
    let fields = [];
    for (let x:number = 0; x < json.column; ++x) {
      fields[x] = [];
      for (let y:number = 0; y < json.row; ++y) {
        fields[x][y] = Field.fromJSON(json.fields[x][y]);
      }
    }
    return new Board(fields);
  }

  setFacility(x:number, y:number, facility:Facility):void {
    this.fields[x][y].facility = facility;
  }

  debugString():string {
    let output:string = "";
    for (let y:number = 0; y < this.row; ++y) {
      for (let x:number = 0; x < this.column; ++x) {
        output += this.fields[x][y].debugString();
      }
      output += "\n";
    }
    return output;
  }
}
