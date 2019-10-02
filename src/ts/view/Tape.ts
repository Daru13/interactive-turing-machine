import * as d3 from "d3-selection";

export class Tape{
  tape: any;

  constructor(){
    this.tape = d3.select("#tape");
    this.addCells();
  }

  addCells(){
    for(var i = 0; i < 20; i++){
      this.tape.append("div").classed("cell", true)
    }
  }
}
