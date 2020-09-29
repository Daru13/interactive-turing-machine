"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteStateAction_1 = require("../actions/DeleteStateAction");
const EditorPopup_1 = require("./EditorPopup");
class NodeEditor extends EditorPopup_1.Editor {
    constructor(node, turingMachine) {
        super(node);
        this.node = node;
        this.turingMachine = turingMachine;
        this.init();
    }
    init() {
        this.holder.classed("node-editor", true);
        this.setTitle("Edit state");
        this.initContent();
        super.setOnClose(() => {
            let label = this.content.select("#node-set-label-field").node().value;
            this.turingMachine.stateMachine.getState(this.node.stateID).setLabel(label);
        });
        this.initPosition();
    }
    initContent() {
        let self = this;
        this.addLabel("Label", "node-set-label-field");
        this.addTextField(this.turingMachine.stateMachine.getState(this.node.stateID).getLabel(), {
            id: "node-set-label-field",
            placeholder: "Label of the node"
        });
        this.addLabel("Final state", "node-set-final-button");
        this.addButton("", () => {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            let newFinalState = !state.isFinal();
            state.setFinal(newFinalState);
            this.updateFinalButton(newFinalState);
        }, "node-set-final-button");
        this.updateFinalButton();
        this.addLabel("Delete", "node-delete-button");
        this.addButton("Delete", () => { this.deleteNode(); }, "node-delete-button");
    }
    updateFinalButton(stateIsFinal) {
        if (stateIsFinal === undefined) {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            stateIsFinal = state.isFinal();
        }
        this.content.select("#node-set-final-button")
            .text(stateIsFinal ? "Turn off" : "Turn on");
    }
    deleteNode() {
        DeleteStateAction_1.DeleteStateAction.do(this.node, this.turingMachine);
        this.setOnClose(() => { });
        super.close();
    }
}
exports.NodeEditor = NodeEditor;
//# sourceMappingURL=NodeEditorPopup.js.map