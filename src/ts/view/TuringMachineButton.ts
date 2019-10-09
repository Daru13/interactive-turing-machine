import * as d3 from "d3-selection";
import { TuringMachine } from "../model/TuringMachine";
import { Tape } from "./Tape";

export class TuringMachineButton{
  holder: d3.Selection<HTMLDivElement, any, HTMLElement, any>;
  turingMachine: TuringMachine;
  tape: Tape;

  constructor(turingMachine: TuringMachine, tape: Tape){
    this.turingMachine = turingMachine;
    this.tape = tape;
    this.setupUI();
  }

  setupUI(){
    var tM: TuringMachine = this.turingMachine;
    var tape: Tape = this.tape;
    this.holder = d3.select("#turingMachineButton");
    this.holder.append("button").on("click", function(){
      tM.tape.setContent(tape.toArray());
      console.log(tM.toString());
      tM.run();
      console.log(tM.toString());
    }).text("start");

  this.holder.append("button").on("click", function () {
    tM.tape.setContent(tape.toArray());
    console.log(tM.toString());
    tM.tape.resetHeadPosition();
    console.log(tM.toString());
  }).text("reset");
  }
}