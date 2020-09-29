"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class TapeContentEditorPopup extends Popup_1.Popup {
    constructor(tape) {
        super();
        this.tape = tape;
        this.init();
    }
    init() {
        this.setTitle("Edit the tape");
        this.holder.attr("id", "tape-content-editor-popup");
        this.addInstructions();
        this.addContentField();
        this.addActionButtons();
        this.center();
    }
    addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("Edit the content of the tape and click the Update tape below to apply your changes.");
    }
    addContentField() {
        this.content.append("textarea")
            .attr("id", "tape-content-edit-field")
            .attr("placeholder", "Content of the tape...")
            .text(this.tape.getContentAsString());
    }
    addActionButtons() {
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
    updateTapeContent() {
        let tapeContentFieldNode = this.holder.select("#tape-content-edit-field").node();
        this.tape.setContentFromString(tapeContentFieldNode.value);
        this.close();
    }
}
exports.TapeContentEditorPopup = TapeContentEditorPopup;
//# sourceMappingURL=TapeContentEditorPopup.js.map