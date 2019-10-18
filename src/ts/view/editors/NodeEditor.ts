import * as d3 from "d3-selection";
import { NodeHandleSelection } from "../graph/Node/Node";
import { DeleteNodeAction } from "../actions/DeleteNodeAction";
import { TuringMachine } from "../../model/TuringMachine";
import { Editor } from "./Editor";

export class NodeEditor extends Editor{
    node: NodeHandleSelection;
    tm: TuringMachine;

    constructor(node: NodeHandleSelection, tm: TuringMachine){
        super(node);
        this.node = node;
        this.tm = tm;

        this.holder.classed("node-editor", true);

        this.initContent();
        super.setOnClose(() => {
            let label = (this.content.select("#node-set-label-field").node() as HTMLInputElement).value;
            tm.stateMachine.getState(node.datum().stateID).setLabel(label);
        })
    }

    initContent(){
        this.addButton("Initial", () => {
            this.tm.stateMachine.setInitialState(this.node.datum().stateID);
            console.log(this.tm.stateMachine.toString());
        }, "node-set-intial-button")

        this.addButton("Final",  () => {
            let state = this.tm.stateMachine.getState(this.node.datum().stateID);
            state.setFinal(!state.isFinal());
            console.log(this.tm.stateMachine.toString());
        }, "node-set-final-button")

        this.addTextField(this.tm.stateMachine.getState(this.node.datum().stateID).getLabel(),  "node-set-label-field");

        this.addButton("DeleteNode", () => {this.deleteNode()}, "node-delete-button");
    }

    deleteNode(){
        DeleteNodeAction.do(this.node, this.tm);
        super.close();
    }
}
