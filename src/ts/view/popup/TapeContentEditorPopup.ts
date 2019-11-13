import { Popup } from "./Popup";
import { Tape } from "../../model/Tape";

/**
 * A class to create a pop up where you can paste the content for the tape
 */
export class TapeContentEditorPopup extends Popup {
    /** Tape of where to insert content */
    private readonly tape: Tape;

    constructor(tape: Tape) {
        super();
        this.tape = tape;

        this.init();
    }

    /**
     * Inits tape content editor popup
     */
    private init(): void {
        this.setTitle("Edit the tape");
        this.holder.attr("id", "tape-content-editor-popup");

        this.addInstructions();
        this.addContentField();
        this.addActionButtons();

        this.center();
    }

    /**
     * Adds instructions on how to insert content
     */
    private addInstructions(): void {
        this.content.append("p")
            .classed("instruction", true)
            .html("Edit the content of the tape and click the Update tape below to apply your changes.");
    }

    /**
     * Adds a field where to paste the content
     */
    private addContentField(): void {
        this.content.append("textarea")
            .attr("id", "tape-content-edit-field")
            .attr("placeholder", "Content of the tape...")
            .text(this.tape.getContentAsString());
    }

    /**
     * Adds Update and Cancel buttons
     */
    private addActionButtons(): void {
        let container = this.content.append("div")
            .attr("class", "action-button-container");

        container.append("button")
            .classed("update-button", true)
            .text("Update tape")
            .on("click", () => {
                this.updateTapeContent();
            });

        container.append("button")
            .classed("cancel-button", true)
            .text("Cancel")
            .on("click", () => {
                this.close();
            });
    }

    /**
     * Updates the content of the tape based on the content field
     */
    private updateTapeContent(): void {
        let tapeContentFieldNode = this.holder.select("#tape-content-edit-field").node() as HTMLTextAreaElement;
        this.tape.setContentFromString(tapeContentFieldNode.value);
        this.close();
    }
}