import * as d3 from "d3-selection";
import { Graph } from '../Graph';
import { distance2 } from "../helpers";

export class NodeInteraction {
  previousX: number;
  previousY: number;
  node: d3.Selection<any, unknown, null, undefined>;
  graph: Graph;

  constructor(graph){
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph;
  }

  pointerDown(e: any){
    this.previousX = e.x;
    this.previousY = e.y;

    this.node = d3.select(e.target as any);

    if(e.pointerType == "pen"){
      this.node.classed("selected", true)
      this.graph.svg
        .append("path")
          .attr("d", "M"+this.node.attr("cx")+","+this.node.attr("cy")+" L"+this.previousX+","+this.previousY)
          .classed("edgeInCreation", true)
    }
  }

  pointerMove(e: any){

    if(e.pointerType == "touch"){
      console.log(parseFloat(this.node.attr("cx")) + e.x - this.previousX, parseFloat(this.node.attr("cx")), e.x, this.previousX)
      this.node.attr("cx", parseFloat(this.node.attr("cx")) + e.x - this.previousX);
      this.node.attr("cy", parseFloat(this.node.attr("cy")) + e.y - this.previousY);
    }

    if(e.pointerType == "pen"){
      this.graph.svg
        .select(".edgeInCreation")
          .attr("d", "M"+this.node.attr("cx")+","+this.node.attr("cy")+" L"+this.previousX+","+this.previousY)
    }

    this.previousX = e.x;
    this.previousY = e.y;
  }

  pointerUp(e: any){
    if(e.pointerType == "pen"){
      this.graph.svg
        .select(".edgeInCreation")
        .remove()
      let closestNode;
      let closestDistance = Infinity;
      let t = this;
      d3.selectAll(".node:not(.selected)").each(function(){
        if(distance2({x: t.previousX, y: t.previousY},
                     {x: parseFloat(d3.select(this).attr("cx")), y: parseFloat(d3.select(this).attr("cy"))}) < closestDistance){
          closestDistance =distance2({x: t.previousX, y: t.previousY},
                       {x: parseFloat(d3.select(this).attr("cx")), y: parseFloat(d3.select(this).attr("cy"))})
          closestNode = d3.select(this)
        }
      })
      d3.selectAll(".node.selected").classed("selected", false);
      this.graph.addEdge(this.node, closestNode);
    }
  }
}
