import { Popup } from "./Popup";
import { ViewController } from '../ViewController';
import { TuringMachine } from "../../model/TuringMachine";

export class ImportPopup extends Popup {

    private viewController: ViewController;

    constructor(viewController: ViewController) {
        super();
        this.viewController = viewController;

        this.init();
    }

    private init() {
        this.setTitle("Import a Turing machine")
        this.holder.attr("id", "import-popup");

        this.addInstructions();
        this.addImportField();
        this.addActionButtons();

        this.center();
    }

    private addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .text("Paste the code of an exported Turing machine below and click the Import button to import the machine.");

        this.content.append("p")
            .classed("instruction", true)
            .classed("warning", true)
            .html("Be careful: importing a machine will <strong>replace your current machine</strong>!");
    }

    private addImportField() {
        this.content.append("textarea")
            .attr("id", "turing-machine-import-field")
            .attr("placeholder", "Code of the Turing machine to import...");
    }

    private addActionButtons() {
        let container = this.content.append("div")
            .attr("class", "action-button-container");

        container.append("button")
            .text("Import")
            .on("click", () => {
                this.importTuringMachine();
            });

        container.append("button")
            .text("Cancel")
            .on("click", () => {
                this.close();
            });
    }

    private importTuringMachine() {
        let importFieldNode = this.holder.select("#turing-machine-import-field").node() as HTMLTextAreaElement;
        let json = importFieldNode.value;

        console.log(json)
        if (json.length === 0) {
            return;
        }

        // TODO: clean up this part and avoid using the view controller!

        try {
            this.viewController.turingMachine.empty();
            this.viewController.turingMachine = TuringMachine.fromJSONExport(json);
        }
        catch (exception) {
            console.error("The Turing machine could not be imported: import from JSON failed.");
            console.log(exception);
        }
    }
}