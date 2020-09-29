"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class ImportPopup extends Popup_1.Popup {
    constructor(main) {
        super();
        this.main = main;
        this.init();
    }
    init() {
        this.setTitle("Import a Turing machine");
        this.holder.attr("id", "import-popup");
        this.addInstructions();
        this.addImportField();
        this.addActionButtons();
        this.center();
    }
    addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Paste the code</strong> of an exported Turing machine below and <strong>click the Import button</strong> to import the machine.");
        this.content.append("p")
            .classed("instruction", true)
            .classed("warning", true)
            .html("<strong>Be careful:</strong> importing a machine will <strong>replace your current machine</strong>!");
    }
    addImportField() {
        this.content.append("textarea")
            .attr("id", "turing-machine-import-field")
            .attr("placeholder", "Code of the Turing machine to import...");
    }
    addActionButtons() {
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
    importTuringMachine() {
        let importFieldNode = this.holder.select("#turing-machine-import-field").node();
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
exports.ImportPopup = ImportPopup;
//# sourceMappingURL=ImportPopup.js.map