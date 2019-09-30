import * as d3 from "d3-selection";
import { nodeTypes, Node } from "./Node";

export class NodeEditor{
  holder: any;
  node: any;

  constructor(node){
    d3.select("body").selectAll(".NodeEditor").remove();
    this.holder = d3.select("body").append("div").classed("NodeEditor", true);
    this.node = node;
    this.setupUI();
  }

  setupUI(){
    var t = this;
    this.addButton("Start", nodeTypes.START)
    this.addButton("Standard", nodeTypes.STANDARD)
    this.addButton("Final", nodeTypes.FINAL)
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
    d3.select("body").selectAll(".NodeEditor").remove();
  }
}
