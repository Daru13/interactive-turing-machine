import * as d3 from "d3-selection";
import { TuringMachine } from "../model/TuringMachine";
import { Tape } from "./Tape";
import { Popup } from "./editors/Popup";
import { EasterEggs } from "../easterEggs/EasterEggs";
import { ErrorPopup } from "./editors/ErrorPopUp";

export class ControlPanel {
    holder: d3.Selection<HTMLDivElement, any, HTMLElement, any>;
    turingMachine: TuringMachine;
    tape: Tape;

    constructor(turingMachine: TuringMachine, tape: Tape) {
        this.turingMachine = turingMachine;
        this.tape = tape;

        this.init();
    }

    private init() {
        this.addControlButtons();
        this.addScreen();
    }

    private addControlButtons() {
        let tm = this.turingMachine;
        let tape = this.tape;
        let t = this;

        this.holder = d3.select("#control-panel");
        this.holder.append("button")
            .attr("id", "runButton")
            .on("click", function(){
                tm.tape.setContent(tape.toArray());
                tape.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.run()
                    new EasterEggs(tm.tape.getContent());
                }
                catch (error) {
                    t.catchError(error);
                }
            })
            .text("Run");

        this.holder.append("button")
            .attr("id", "runOneStepButton")
            .on("click", function () {
                tm.tape.setContent(tape.toArray());
                tape.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.runOneStep()
                }
                catch (error) {
                    t.catchError(error);
                }
            })
            .text("Step");

        this.holder.append("button")
            .attr("id", "resetButton")
            .on("click", function () {
                tm.tape.setContent(tape.toArray());
                tm.reset();
            })
            .text("Reset");
    }

    private addScreen() {
        let screen = this.holder.append("div")
            .attr("id", "control-panel-screen");

        screen.append("p")
            .classed("first-line", true);

        screen.append("p")
            .classed("second-line", true);

        this.updateScreen();
    }

    updateScreen() {
        let screen = this.holder.select("#control-panel-screen");

        // First line
        screen.select(".first-line")
            .text("Execution step: ---");

        // Second line
        screen.select(".second-line")
            .text("No error detected.");
    }

    private catchError (error) {
        let popup = new ErrorPopup(error);
        console.error(error);
    }
}