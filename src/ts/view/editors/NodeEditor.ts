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

        this.holder.classed("node-editor", true);

        this.initContent();
        super.setOnClose(() => {
            let label = (this.content.select("#node-set-label-field").node() as HTMLInputElement).value;
            tm.stateMachine.getState(node.stateID).setLabel(label);
        })
    }

    initContent(){
        this.addButton("Initial", () => {
            this.tm.stateMachine.setInitialState(this.node.stateID);
            console.log(this.tm.stateMachine.toString());
        }, "node-set-initial-button")

        this.addButton("Final",  () => {
            let state = this.tm.stateMachine.getState(this.node.stateID);
            state.setFinal(!state.isFinal());
            console.log(this.tm.stateMachine.toString());
        }, "node-set-final-button")

        this.addTextField(this.tm.stateMachine.getState(this.node.stateID).getLabel(),  "node-set-label-field");

        this.addButton("DeleteNode", () => {this.deleteNode()}, "node-delete-button");
    }

    deleteNode(){
        DeleteNodeAction.do(this.node, this.tm);
        super.close();
    }
}
