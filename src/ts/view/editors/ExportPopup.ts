import { Popup } from "./Popup";
import { TuringMachine } from '../../model/TuringMachine';

export class ExportPopup extends Popup {

    private turingMachine: TuringMachine;

    constructor(turingMachine: TuringMachine) {
        super();
        this.turingMachine = turingMachine;

        this.init();
    }

    private init() {
        this.setTitle("Export your Turing machine");
        this.holder.attr("id", "export-popup");

        this.addInstructions();
        this.addImportField();

        this.center();
    }

    private addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Copy the code</strong> below to <strong>share</strong> your Turing machine with other people!<br>Anyone can load it by using the Import button in the top bar.");
    }

    private addImportField() {
        this.content.append("textarea")
            .attr("id", "turing-machine-export-field")
            .property("readOnly", true) // A capital "O" is required because D3 refers to the element's key
            .text(this.turingMachine.exportToJSON());
    }
}