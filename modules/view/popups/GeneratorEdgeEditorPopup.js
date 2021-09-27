"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EditorPopup_1 = require("./EditorPopup");
class GeneratorEdgeEditor extends EditorPopup_1.Editor {
    constructor(edge, stateMachine) {
        super(edge);
        this.edge = edge;
        this.stateMachine = stateMachine;
        this.init();
    }
    init() {
        this.setTitle("Edge from the generator");
        this.holder.attr("id", "generator-edge-editor");
        this.addButtons();
        this.initPosition();
    }
    addButtons() {
        let container = this.content.append("div")
            .classed("action-button-container", true);
        this.addButton("Delete", () => {
            this.stateMachine.resetInitialState();
            this.close();
        }, "", "delete", container);
        this.addButton("Cancel", () => {
            this.close();
        }, "", "cancel", container);
    }
}
exports.GeneratorEdgeEditor = GeneratorEdgeEditor;
//# sourceMappingURL=GeneratorEdgeEditorPopup.js.map