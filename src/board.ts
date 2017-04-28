export class Facility {
  public name:string;
  constructor(name:string) {
    this.name = name;
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
  private colum:number = 12;

  constructor() {
    this.fields = [];
    for (let x:number = 0; x < this.colum; ++x) {
      this.fields[x] = [];
      for (let y:number = 0; y < this.row; ++y) {
        this.fields[x][y] = new Field(x, y);
      }
    }
  }

  setFacility(x:number, y:number, facility:Facility):void {
    this.fields[x][y].facility = facility;
  }

  debugString():string {
    let output:string = "";
    for (let y:number = 0; y < this.row; ++y) {
      for (let x:number = 0; x < this.colum; ++x) {
        output += this.fields[x][y].debugString();
      }
      output += "\n";
    }
    return output;
  }
}
