import { DeleteNodeAction } from "../actions/DeleteNodeAction";
import { TuringMachine } from "../../model/TuringMachine";
import { Editor } from "./Editor";
import { StateNode } from "../graph/Node/StateNode";

export class NodeEditor extends Editor{
    node: StateNode;
    turingMachine: TuringMachine;

    constructor(node: StateNode, turingMachine: TuringMachine){
        super(node);

        this.node = node;
        this.turingMachine = turingMachine;

        this.init();
    }

    init() {
        // Editor-specific class
        this.holder.classed("node-editor", true);

        // Popup title
        this.setTitle("Edit state");

        this.initContent();
        super.setOnClose(() => {
            let label = (this.content.select("#node-set-label-field").node() as HTMLInputElement).value;
            this.turingMachine.stateMachine.getState(this.node.stateID).setLabel(label);
        });
        this.initPosition();
    }

    initContent(){
        this.addLabel("Label", "node-set-label-field");
        this.addTextField(this.turingMachine.stateMachine.getState(this.node.stateID).getLabel(), {
            id: "node-set-label-field",
            placeholder:  "Label of the node"
        });

        this.addLabel("Final state", "node-set-final-button");
        this.addButton("Final",  () => {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            state.setFinal(!state.isFinal());
        }, "node-set-final-button");

        this.addLabel("Delete", "node-delete-button");
        this.addButton("Delete", () => {this.deleteNode()}, "node-delete-button");
    }

    deleteNode(){
        DeleteNodeAction.do(this.node, this.turingMachine);
        this.setOnClose(() => {});
        super.close();
    }
}
