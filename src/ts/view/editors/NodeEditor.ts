import { DeleteNodeAction } from "../actions/DeleteNodeAction";
import { TuringMachine } from "../../model/TuringMachine";
import { Editor } from "./Editor";
import { StateNode } from "../graph/Node/StateNode";

export class NodeEditor extends Editor{
    node: StateNode;
    tm: TuringMachine;

    constructor(node: StateNode, tm: TuringMachine){
        super(node);

        this.node = node;
        this.tm = tm;

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
            this.tm.stateMachine.getState(this.node.stateID).setLabel(label);
        });
        this.initPosition();
    }

    initContent(){
        this.addLabel("Label", "node-set-label-field");
        this.addTextField(this.tm.stateMachine.getState(this.node.stateID).getLabel(), {
            id: "node-set-label-field",
            placeholder:  "Label of the node"
        });

        this.addLabel("Final state", "node-set-final-button");
        this.addButton("Final",  () => {
            let state = this.tm.stateMachine.getState(this.node.stateID);
            state.setFinal(!state.isFinal());
        }, "node-set-final-button");

        this.addLabel("Delete", "node-delete-button");
        this.addButton("Delete", () => {this.deleteNode()}, "node-delete-button");
    }

    deleteNode(){
        DeleteNodeAction.do(this.node, this.tm);
        this.setOnClose(() => {});
        super.close();
    }
}
