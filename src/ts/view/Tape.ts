import * as d3 from "d3-selection";
import * as d3Transition from "d3-transition";
import { TapeSymbol, HeadAction } from "../model/Tape";

export class Tape{
  tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  origin: number;
  stepMovement: number;
  head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor() {
    this.origin = 0;
    this.tapeHolder = d3.select("#tapeHolder");
    this.tape = this.addTape();
    this.head = this.addHead();
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

    this.origin = widthHolder / 2 - 2 - 45;
    tape.style("left", (this.origin).toString() + "px");

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

  move(action: HeadAction){
    switch (action) {
      case HeadAction.MoveLeft:
        this.moveTapeBy(-1);
        break;

      case HeadAction.MoveRight:
        this.moveTapeBy(1);
        break;

      case HeadAction.None:
      default:
        break;
    }
  }

  toArray(): TapeSymbol[]{
    let tapeSymbols = [];
    this.tape.selectAll("input").each(function(){
      let input = this as HTMLInputElement;
      tapeSymbols.push(input.value);
    })
    return tapeSymbols;
  }

  updateCell(symbol: TapeSymbol, index: number){
    let inputCell = this.tape.select("#cell-"+index).select("input").node() as HTMLInputElement;
    inputCell.value = symbol;
  }

  setPos(pos: number){
    console.log(this.origin)
    this.tape
      .style("left", (this.origin).toString() + "px")
  }
}
