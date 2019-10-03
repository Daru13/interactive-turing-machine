import * as d3 from "d3-selection";
import * as d3Transition from "d3-transition";

export class Tape{
  tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  indexOfHead: number;
  stepMovement: number;
  head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor(){
    this.tapeHolder = d3.select("#tapeHolder");
    this.tape = this.addTape();
    this.head = this.addHead();
    this.indexOfHead = 0;
    this.moveTapeBy(3);
  }

  addTape(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any>{
    let tape = this.tapeHolder.append("div").attr("id", "tape");
    for(var i = 0; i < 100; i++){
      tape.append("div")
        .attr("id", "cell-"+i)
        .classed("cell", true)
        .append("input")
          .attr("type", "text")
    }

    let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;

    tape.style("left", (widthHolder / 2 - 2 - 45).toString() + "px");

    this.stepMovement = 90 + 2 + 2;
    return tape;
  }

  addHead(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any>{
    return this.tapeHolder.append("div").attr("id", "head")
  }

  moveTapeBy(n: number){
    let l = parseInt(this.tape.style("left"));
    this.tape
      .style("left", (l - n * this.stepMovement).toString() + "px")
  }
}
