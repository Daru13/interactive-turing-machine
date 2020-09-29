"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class ExportPopup extends Popup_1.Popup {
    constructor(turingMachine) {
        super();
        this.turingMachine = turingMachine;
        this.init();
    }
    init() {
        this.setTitle("Export your Turing machine");
        this.holder.attr("id", "export-popup");
        this.addInstructions();
        this.addExportField();
        this.center();
    }
    addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Copy the code</strong> below to <strong>share</strong> your Turing machine with other people!<br>Anyone can load it by using the Import button in the top bar.");
    }
    addExportField() {
        this.content.append("textarea")
            .attr("id", "turing-machine-export-field")
            .property("readOnly", true)
            .text(this.turingMachine.exportToJSON());
    }
}
exports.ExportPopup = ExportPopup;
//# sourceMappingURL=ExportPopup.js.map