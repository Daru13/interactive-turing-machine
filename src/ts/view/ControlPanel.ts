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
        this.easterEggManager = new EasterEggManager(turingMachine.tape);

        this.init();
    }

    private init(): void {
        this.addControlButtons();
        this.addScreen();
    }

    private addControlButtons(): void {
        let tm = this.turingMachine;
        let tape = this.tape;

        d3.select("#control-panel").selectAll("*").remove();
        this.holder = d3.select("#control-panel");
        this.holder.append("button")
            .attr("id", "runButton")
            .on("click", () => {
                tape.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.reset();
                    tm.run();
                    this.updateScreen();
                    
                    this.easterEggManager.launch(tm.tape.getContent());
                }
                catch (error) {
                    this.catchError(error);
                }
            })
            .text("Run");

        this.holder.append("button")
            .attr("id", "runOneStepButton")
            .on("click", () => {
                tape.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.runOneStep();
                    this.updateScreen();

                    this.easterEggManager.launch(tm.tape.getContent());
                }
                catch (error) {
                    this.catchError(error);
                }
            })
            .text("Step");

        this.holder.append("button")
            .attr("id", "resetButton")
            .on("click", () => {
                tm.reset();
                this.updateScreen();
            })
            .text("Reset");
    }

    private addScreen(): void {
        let screen = this.holder.append("div")
            .attr("id", "control-panel-screen");

        screen.append("p")
            .classed("first-line", true);

        screen.append("p")
            .classed("second-line", true);

        this.updateScreen();
    }

    updateScreen(error?: TMError): void {
        let screen = this.holder.select("#control-panel-screen");
        screen.classed("error", error !== undefined);

        // First line
        screen.select(".first-line")
            .text(`${this.turingMachine.getState()} (step: ${this.turingMachine.getCurrentStep()})`);

        // Second line
        screen.select(".second-line")
            .text(error !== undefined ? error.getShortName() : "");
    }

    private catchError(error: TMError): void {
        this.updateScreen(error);
        new ErrorPopup(error);
    }
}