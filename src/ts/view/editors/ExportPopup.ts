import { Popup } from "./Popup";
import { TuringMachine } from '../../model/TuringMachine';

/**
 * A class to create a pop up to export the turing machine as a JSON
 */
export class ExportPopup extends Popup {
    /**
     * Turing machine of export popup
     */
    private turingMachine: TuringMachine;

    constructor(turingMachine: TuringMachine) {
        super();
        this.turingMachine = turingMachine;

        this.init();
    }

    /**
     * Inits export popup
     */
    private init(): void {
        this.setTitle("Export your Turing machine");
        this.holder.attr("id", "export-popup");

        this.addInstructions();
        this.addExportField();

        this.center();
    }

    /**
     * Adds instructions on how to export the turing machine
     */
    private addInstructions(): void {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Copy the code</strong> below to <strong>share</strong> your Turing machine with other people!<br>Anyone can load it by using the Import button in the top bar.");
    }

    /**
     * Adds Export field are where the JSON will be displayed
     */
    private addExportField(): void {
        this.content.append("textarea")
            .attr("id", "turing-machine-export-field")
            .property("readOnly", true) // A capital "O" is required because D3 refers to the element's key
            .text(this.turingMachine.exportToJSON());
    }
}