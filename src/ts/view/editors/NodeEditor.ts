import * as d3 from "d3-selection";
import { NodeHandleSelection } from "../graph/Node";
import { DeleteNodeAction } from "../actions/DeleteNodeAction";
import { TuringMachine } from "../../model/TuringMachine";

export class NodeEditor{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
    node: NodeHandleSelection;
    tm: TuringMachine;

    constructor(node: NodeHandleSelection, tm: TuringMachine){
        d3.select("body").selectAll(".NodeEditor").remove();
        d3.selectAll(".node.selected").classed("selected", false);
        this.holder = d3.select("body").append("div").classed("NodeEditor", true);
        this.node = node;
        this.node.classed("selected", true);
        this.tm = tm;
        this.setupUI();
    }

    setupUI(){
        let t = this;
        
        this.holder.append("div")
            .on("click", function () {
                t.tm.stateMachine.setInitialState(t.node.datum().stateID);
                console.log(t.tm.stateMachine.toString());
                t.close(t);
            })
            .text("Initial");

        this.holder.append("div")
            .on("click", function () {
                let state = t.tm.stateMachine.getState(t.node.datum().stateID);
                console.log(!state.isFinal());
                state.setFinal(!state.isFinal());
                console.log(t.tm.stateMachine.toString());
                t.close(t);
            })
            .text("Final");

        this.addButton("Cancel", this.close);
        this.addButton("DeleteNode", this.deleteNode);
    }

    addButton(text: string, funct): void {
        var t = this;
        this.holder.append("div")
            .append("div")
            .classed("button", true)
            .on("click", function () { funct(t) })
            .text(text);
    }

    close(nodeEditor:    NodeEditor){
        nodeEditor.node.classed("selected", false);
        d3.select("body").selectAll(".NodeEditor").remove();
    }

    deleteNode(nodeEditor: NodeEditor){
        DeleteNodeAction.do(nodeEditor.node, nodeEditor.tm);
        nodeEditor.close(nodeEditor);
    }
}
