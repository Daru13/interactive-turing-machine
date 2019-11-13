import { Popup } from "./Popup";
import { Main } from "../../main";

/**
 * A class to create a pop up to import the turing machine from a JSON
 */
export class ImportPopup extends Popup {
    /**
     * Main of the application
     */
    private main: Main;

    constructor(main: Main) {
        super();
        this.main = main;

        this.init();
    }

    /**
     * Inits import popup
     */
    private init(): void {
        this.setTitle("Import a Turing machine");
        this.holder.attr("id", "import-popup");

        this.addInstructions();
        this.addImportField();
        this.addActionButtons();

        this.center();
    }

    /**
     * Adds instructions on how to import a Turing machine
     */
    private addInstructions(): void {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Paste the code</strong> of an exported Turing machine below and <strong>click the Import button</strong> to import the machine.");

        this.content.append("p")
            .classed("instruction", true)
            .classed("warning", true)
            .html("<strong>Be careful:</strong> importing a machine will <strong>replace your current machine</strong>!");
    }

    /**
     * Adds an import field where to paste the Turing machine
     */
    private addImportField(): void {
        this.content.append("textarea")
            .attr("id", "turing-machine-import-field")
            .attr("placeholder", "Code of the Turing machine to import...");
    }

    /**
     * Adds buttons import and cancel to the pop up
     */
    private addActionButtons(): void {
        let container = this.content.append("div")
            .attr("class", "action-button-container");

        container.append("button")
            .classed("import-button", true)
            .text("Import")
            .on("click", () => {
                this.importTuringMachine();
            });

        container.append("button")
            .classed("cancel-button", true)
            .text("Cancel")
            .on("click", () => {
                this.close();
            });
    }

    /**
     * Imports the Turing machine pasted in the pop up
     */
    private importTuringMachine(): void {
        let importFieldNode = this.holder.select("#turing-machine-import-field").node() as HTMLTextAreaElement;
        let json = importFieldNode.value;

        if (json.length === 0) {
            return;
        }

        try {
            this.main.setTuringMachineFromImport(json);
            this.close();
        }
        catch (exception) {
            console.error("The Turing machine could not be imported: import from JSON failed.");
            console.log(exception);
        }
    }
}