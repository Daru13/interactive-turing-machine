"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class ErrorPopup extends Popup_1.Popup {
    constructor(error) {
        super();
        this.error = error;
        this.init();
    }
    init() {
        this.setTitle(this.error.getName());
        this.holder.classed("error-popup", true);
        this.createProblemDescription();
        this.createSolutionDescription();
        this.center();
    }
    createProblemDescription() {
        this.content.append("h3")
            .text("Problem");
        this.content.append("p")
            .html(this.error.getProblem());
    }
    createSolutionDescription() {
        this.content.append("h3")
            .text("Solution");
        this.content.append("p")
            .html(this.error.getSolution());
    }
}
exports.ErrorPopup = ErrorPopup;
//# sourceMappingURL=ErrorPopup.js.map