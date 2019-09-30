import * as d3 from "d3-selection";
import { Edge } from "./Edge";

export class EdgeEditor{
  holder: any;
  edge: any;
  readField: any;
  writeField: any;
  dirField: any;

  constructor(edge){
    d3.select("body").selectAll(".EdgeEditor").remove();
    this.holder = d3.select("body").append("div").classed("EdgeEditor", true);
    this.edge = edge;
    this.setupUI();
  }

  setupUI(){
    this.addTag("Read", "readTag")
    this.addTag("Write", "writeTag")
    this.addTag("Direction", "dirTag")

    this.readField = this.addTextField("test", "readEntry")
    this.writeField = this.addTextField("test", "writeEntry")
    this.dirField = this.addTextField("test", "dirEntry")

    var t = this;
    this.addButton("Submit", "submitButton", this.submit)
    this.addButton("Cancel", "cancelButton", this.close)
  }

  addButton(text: string, gridArea: string, funct) {
    var t = this;
    this.holder.append("div")
      .attr("id", gridArea)
      .style("grid-area", gridArea)
      .append("div")
      .classed("button", true)
      .on("click", function(){funct(t)})
      .text(text);
  }

  addTextField(defaultText: string, gridArea: string) {
    return this.holder.append("input")
              .attr("type", "text")
              .attr("id", gridArea)
              .attr("value", defaultText)
              .style("grid-area", gridArea);
  }

  addTag(text, gridArea){
    this.holder.append("div").style("grid-area", gridArea).text(text);
  }

  submit(edgeEditor){
    Edge.setTransition(edgeEditor.edge, edgeEditor.readField.node().value, edgeEditor.writeField.node().value, edgeEditor.dirField.node().value)
    edgeEditor.close();
  }

  close(edgeEditor){
    d3.select("body").selectAll(".EdgeEditor").remove();
  }
}
