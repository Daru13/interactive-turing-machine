import * as d3 from "d3-selection";
import { TuringMachine } from "../model/TuringMachine";
import { Tape } from "./Tape";
import { Popup } from "./editors/Popup";

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
        let tM: TuringMachine = this.turingMachine;
        let tape: Tape = this.tape;
        let t = this;

        this.holder = d3.select("#turingMachineButton");
        this.holder.append("button")
            .attr("id", "runButton")
            .on("click", function(){
                tM.tape.setContent(tape.toArray());
                tape.moveToCell(tM.tape.getHeadPosition());
                try {
                    tM.run()
                } catch (error) {
                    t.catchError(error);
                }
            })
            .text("Run");

        this.holder.append("button")
            .attr("id", "runOneStepButton")
            .on("click", function () {
                tM.tape.setContent(tape.toArray());
                tape.moveToCell(tM.tape.getHeadPosition());
                try {
                    tM.runOneStep()
                } catch (error) {
                    t.catchError(error);
                }
            })
            .text("Step");

        this.holder.append("button")
            .attr("id", "resetButton")
            .on("click", function () {
                tM.tape.setContent(tape.toArray());
                tM.reset();
            })
            .text("Reset");
    }

    catchError(error){
        let popup = new Popup();
        console.log(error);
        popup.setTitle(error.text)
    }
}