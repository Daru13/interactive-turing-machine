import * as d3 from "d3-selection";
import { TuringMachine } from "../model/TuringMachine";
import { Tape } from "./Tape";
import { ErrorPopup } from "./editors/ErrorPopUp";
import { TMError } from "../errors/TMError";
import { EasterEggManager } from "../easterEggs/EasterEggManager";

export class ControlPanel {
    holder: d3.Selection<HTMLDivElement, any, HTMLElement, any>;
    turingMachine: TuringMachine;
    tape: Tape;
    easterEggManager: EasterEggManager;

    constructor(turingMachine: TuringMachine, tape: Tape) {
        this.turingMachine = turingMachine;
        this.tape = tape;
        this.easterEggManager = new EasterEggManager();

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

        d3.select("#control-panel").selectAll("*").remove();
        this.holder = d3.select("#control-panel");
        this.holder.append("button")
            .attr("id", "runButton")
            .on("click", function(){
                tape.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.reset();
                    tm.run();
                    t.updateScreen();
                    
                    t.easterEggManager.launch(tm.tape.getContent());
                }
                catch (error) {
                    t.catchError(error);
                }
            })
            .text("Run");

        this.holder.append("button")
            .attr("id", "runOneStepButton")
            .on("click", function () {
                tape.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.runOneStep();
                    t.updateScreen();

                    t.easterEggManager.launch(tm.tape.getContent());
                }
                catch (error) {
                    t.catchError(error);
                }
            })
            .text("Step");

        this.holder.append("button")
            .attr("id", "resetButton")
            .on("click", function () {
                tm.reset();
                t.updateScreen();
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

    updateScreen(error?: TMError) {
        let screen = this.holder.select("#control-panel-screen");
        screen.classed("error", error !== undefined);

        // First line
        screen.select(".first-line")
            .text(`${this.turingMachine.getState()} (step: ${this.turingMachine.getCurrentStep()})`);

        // Second line
        screen.select(".second-line")
            .text(error !== undefined ? error.getShortName() : "");
    }

    private catchError (error: TMError) {
        this.updateScreen(error);
        new ErrorPopup(error);
    }
}