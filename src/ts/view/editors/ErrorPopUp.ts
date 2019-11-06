import { Popup } from "./Popup";
import * as d3 from "d3-selection";
import { TMError } from "../../errors/TMError";

export class ErrorPopup extends Popup {
    error: TMError;

    constructor(error: TMError) {
        super();
        this.error = error;
        
        this.init();
    }

    private init() {
        this.setTitle(this.error.getName());
        this.holder.classed("error-popup", true);

        this.createProblemDescription();
        this.createSolutionDescription();

        this.maskBackground.remove();
        this.center();
    }

    private createProblemDescription() {
        this.content.append("h3")
            .text("Problem");

        this.content.append("p")
            .html(this.error.getProblem());
    }

    private createSolutionDescription() {
        this.content.append("h3")
            .text("Solution");

        this.content.append("p")
            .html(this.error.getSolution());
    }
}