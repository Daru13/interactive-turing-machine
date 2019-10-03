import * as d3 from "d3-selection";
import { Edge, EdgeHandleSelection } from "./graph/Edge";
import { Transition } from "../model/Transition";
import { HeadAction } from "../model/Tape";

export class EdgeEditor{
  holder: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
  edge: EdgeHandleSelection;
  readField: d3.Selection<HTMLInputElement, {}, HTMLElement, any>;
  writeField: d3.Selection<HTMLInputElement, {}, HTMLElement, any>;
  dirField: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;

  constructor(edge: EdgeHandleSelection){
    d3.select("body").selectAll(".EdgeEditor").remove();
    this.holder = d3.select("body").append("div").classed("EdgeEditor", true);
    this.edge = edge;
    this.edge.classed("selected", true);
    this.setupUI();
  }

  setupUI(): void{
    this.addTag("Read", "readTag");
    this.addTag("Write", "writeTag");
    this.addTag("Direction", "dirTag");

    this.readField = this.addTextField("test", "readEntry");
    this.writeField = this.addTextField("test", "writeEntry");
    this.dirField = this.addDirEntry(HeadAction.None, "dirEntry");

    this.addButton("Submit", "submitButton", this.submit);
    this.addButton("Cancel", "cancelButton", this.close);
  }

  addDirEntry(defaultDir: HeadAction, gridArea: string): d3.Selection<HTMLDivElement, {}, HTMLElement, any> {
    let holder =
      this.holder.append("div")
        .attr("id", gridArea)
        .style("grid-area", gridArea)
        .append("div")
        .classed("dirEntryButton", true);

    holder.append("div")
      .text("L")
      .attr("id", "leftSwitch")
      .datum(HeadAction.MoveLeft)
      .on("click", function(){
        holder.select(".selected").classed("selected", false);
        d3.select(this).classed("selected", true);
      });

    holder.append("div")
      .text("S")
      .attr("id", "staySwitch")
      .classed("selected", true)
      .datum(HeadAction.None)
      .on("click", function(){
        holder.select(".selected").classed("selected", false);
        d3.select(this).classed("selected", true);
      });

    holder.append("div")
    .text("R")
    .attr("id", "rightSwitch")
    .datum(HeadAction.MoveRight)
    .on("click", function(){
      holder.select(".selected").classed("selected", false);
      d3.select(this).classed("selected", true);
    });

    return holder;
  }

  addButton(text: string, gridArea: string, funct): void {
    var t = this;
    this.holder.append("div")
      .attr("id", gridArea)
      .style("grid-area", gridArea)
      .append("div")
      .classed("button", true)
      .on("click", function(){funct(t)})
      .text(text);
  }

  addTextField(defaultText: string, gridArea: string): d3.Selection<HTMLInputElement, {}, HTMLElement, any> {
    return this.holder.append("input")
              .attr("type", "text")
              .attr("id", gridArea)
              .attr("value", defaultText)
              .style("grid-area", gridArea);
  }

  addTag(text: string, gridArea: string): void{
    this.holder.append("div").style("grid-area", gridArea).text(text);
  }

  submit(edgeEditor: EdgeEditor): void{
    let onSymbol = edgeEditor.readField.node().value;
    let outputSymbol = edgeEditor.writeField.node().value;
    let headAction = edgeEditor.dirField.select(".selected").datum() as HeadAction;

    edgeEditor.edge.datum().transition.setTransition(onSymbol, outputSymbol, headAction);
    Edge.drawText(edgeEditor.edge);
    edgeEditor.close(edgeEditor);
  }

  close(edgeEditor): void{
    edgeEditor.edge.classed("selected", false);
    d3.select("body").selectAll(".EdgeEditor").remove();
  }
}
