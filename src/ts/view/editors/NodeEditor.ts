import * as d3 from "d3-selection";
import { NodeType, Node, NodeHandleSelection } from "../graph/Node";
import { StateMachine } from "../../model/StateMachine";

export class NodeEditor{
  holder: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
  node: NodeHandleSelection;
  stateMachine: StateMachine;

  constructor(node: NodeHandleSelection, stateMachine: StateMachine){
    d3.select("body").selectAll(".NodeEditor").remove();
    this.holder = d3.select("body").append("div").classed("NodeEditor", true);
    this.node = node;
    this.node.classed("selected", true);
    this.stateMachine = stateMachine;
    this.setupUI();
  }

  setupUI(){
    var t = this;
    this.addButton("Start", NodeType.START);
    this.addButton("Standard", NodeType.STANDARD);
    this.addButton("Final", NodeType.FINAL);
  }

  addButton(text: string, type) {
    var t = this;
    this.holder.append("div")
      .on("click", function(){
        Node.changeType(t.node, type);
        t.close();
      })
      .text(text);
  }

  close(){
    this.node.classed("selected", false);
    d3.select("body").selectAll(".NodeEditor").remove();
  }
}