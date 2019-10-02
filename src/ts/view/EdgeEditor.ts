import * as d3 from "d3-selection";
import { Edge } from "./graph/Edge";
import { Direction } from "./graph/Transition";

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
    this.edge.classed("selected", true)
    this.setupUI();
  }

  setupUI(){
    this.addTag("Read", "readTag")
    this.addTag("Write", "writeTag")
    this.addTag("Direction", "dirTag")

    this.readField = this.addTextField("test", "readEntry")
    this.writeField = this.addTextField("test", "writeEntry")
    this.dirField = this.addDirEntry(Direction.STAY, "dirEntry")

    this.addButton("Submit", "submitButton", this.submit)
    this.addButton("Cancel", "cancelButton", this.close)
  }

  addDirEntry(defaultDir: string, gridArea: string): any {
    let holder =
      this.holder.append("div")
        .attr("id", gridArea)
        .style("grid-area", gridArea)
        .append("div")
        .classed("dirEntryButton", true);

    holder.append("div")
      .text("L")
      .attr("id", "leftSwitch")
      .datum(Direction.LEFT)
      .on("click", function(){
        holder.select(".selected").classed("selected", false);
        d3.select(this).classed("selected", true);
      })

    holder.append("div")
      .text("S")
      .attr("id", "staySwitch")
      .classed("selected", true)
      .datum(Direction.STAY)
      .on("click", function(){
        holder.select(".selected").classed("selected", false);
        d3.select(this).classed("selected", true);
      })
    holder.append("div")
    .text("R")
    .attr("id", "rightSwitch")
    .datum(Direction.RIGHT)
    .on("click", function(){
      holder.select(".selected").classed("selected", false);
      d3.select(this).classed("selected", true);
    })
    return holder;
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
    Edge.setTransition(edgeEditor.edge, edgeEditor.readField.node().value, edgeEditor.writeField.node().value, edgeEditor.dirField.select(".selected").datum())
    edgeEditor.close(edgeEditor);
  }

  close(edgeEditor){
    edgeEditor.edge.classed("selected", false)
    d3.select("body").selectAll(".EdgeEditor").remove();
  }
}
