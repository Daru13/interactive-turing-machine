"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const ErrorPopup_1 = require("./popups/ErrorPopup");
const EasterEggManager_1 = require("../easter-eggs/EasterEggManager");
class ControlPanel {
    constructor(turingMachine, roll) {
        this.turingMachine = turingMachine;
        this.roll = roll;
        this.easterEggManager = new EasterEggManager_1.EasterEggManager();
        this.init();
    }
    init() {
        this.addControlButtons();
        this.addScreen();
    }
    addControlButtons() {
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
    addScreen() {
        let screen = this.holder.append("div")
            .attr("id", "control-panel-screen");
        screen.append("p")
            .classed("first-line", true);
        screen.append("p")
            .classed("second-line", true);
        this.updateScreen();
    }
    updateScreen(error) {
        let screen = this.holder.select("#control-panel-screen");
        screen.classed("error", error !== undefined);
        screen.select(".first-line")
            .text(`${this.turingMachine.getState()} (step: ${this.turingMachine.getCurrentStep()})`);
        screen.select(".second-line")
            .text(error !== undefined ? error.getShortName() : "");
    }
    catchError(error) {
        this.updateScreen(error);
        new ErrorPopup_1.ErrorPopup(error);
    }
}
exports.ControlPanel = ControlPanel;
//# sourceMappingURL=ControlPanel.js.map