import { Popup } from "./Popup";
import { TMError } from "../../errors/TMError";

/**
 * A class to display a pop up explaining an error from the Turing machine
 */
export class ErrorPopup extends Popup {
    /** Error of error popup */
    error: TMError;

    constructor(error: TMError) {
        super();
        this.error = error;
        
        this.init();
    }

    /**
     * Inits error popup
     */
    private init(): void {
        this.setTitle(this.error.getName());
        this.holder.classed("error-popup", true);

        this.createProblemDescription();
        this.createSolutionDescription();

        this.center();
    }

    /**
     * Creates a description of the problem
     */
    private createProblemDescription(): void {
        this.content.append("h3")
            .text("Problem");

        this.content.append("p")
            .html(this.error.getProblem());
    }

    /**
     * Creates a description of a solution to the problem
     */
    private createSolutionDescription(): void {
        this.content.append("h3")
            .text("Solution");

        this.content.append("p")
            .html(this.error.getSolution());
    }
}