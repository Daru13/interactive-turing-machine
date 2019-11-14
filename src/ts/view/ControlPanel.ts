import * as d3 from "d3-selection";
import { TuringMachine } from "../model/TuringMachine";
import { InfiniteRoll } from "./InfiniteRoll";
import { ErrorPopup } from "./popups/ErrorPopup";
import { TMError } from "../errors/TMError";
import { EasterEggManager } from "../easter-eggs/EasterEggManager";

/** A class to display a panel with buttons to control the turing machine. */
export class ControlPanel {
    /** Main div of the panel. */
    holder: d3.Selection<HTMLDivElement, any, HTMLElement, any>;
    /** Turing machine to control. */
    turingMachine: TuringMachine;
    /** Tape in the view to move */
    roll: InfiniteRoll;
    /** Manage easter eggs based on the tape content */
    easterEggManager: EasterEggManager;

    constructor(turingMachine: TuringMachine, roll: InfiniteRoll) {
        this.turingMachine = turingMachine;
        this.roll = roll;
        this.easterEggManager = new EasterEggManager();

        this.init();
    }

    /**
     * Inits control panel
     */
    private init(): void {
        this.addControlButtons();
        this.addScreen();
    }

    /**
     * Adds control buttons: run, run on step and reset
     */
    private addControlButtons(): void {
        let tm = this.turingMachine;
        let roll = this.roll;

        d3.select("#control-panel").selectAll("*").remove();
        this.holder = d3.select("#control-panel");
        this.holder.append("button")
            .attr("id", "run-turing-machine-button")
            .attr("title", "Simulate the machine")
            .on("click", () => {
                roll.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.reset();
                    tm.run();
                    this.updateScreen();
                    
                    this.easterEggManager.launch(tm.tape);
                }
                catch (error) {
                    this.catchError(error);
                }
            })
            .text("Run");

        this.holder.append("button")
            .attr("id", "step-turing-machine-button")
            .attr("title", "Simulate one computation step")
            .on("click", () => {
                roll.moveToCell(tm.tape.getHeadPosition());

                try {
                    tm.runOneStep();
                    this.updateScreen();

                    this.easterEggManager.launch(tm.tape);
                }
                catch (error) {
                    this.catchError(error);
                }
            })
            .text("Step");

        this.holder.append("button")
            .attr("id", "reset-turing-machine-button")
            .attr("title", "Reset the machine and rewind the tape")
            .on("click", () => {
                tm.reset();
                this.updateScreen();
            })
            .text("Reset");
    }

    /**
     * Adds a screen to display the Turing machine status
     */
    private addScreen(): void {
        let screen = this.holder.append("div")
            .attr("id", "control-panel-screen");

        screen.append("p")
            .classed("first-line", true);

        screen.append("p")
            .classed("second-line", true);

        this.updateScreen();
    }

    /**
     * Updates the screen screen with an error
     * @param [error] 
     */
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

    /**
     * Open a popup to explain the error launched by the Turing machine
     * @param error 
     */
    private catchError(error: TMError): void {
        this.updateScreen(error);
        new ErrorPopup(error);
    }
}