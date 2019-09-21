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
      this.node.attr("cx", parseFloat(this.node.attr("cx")) + e.x - this.previousX);
      this.node.attr("cy", parseFloat(this.node.attr("cy")) + e.y - this.previousY);

      var t = this

      this.node.datum()["edgeIn"].forEach(function(edge){
        console.log(edge, t.node.datum()["edgeIn"])
        d3.select("#"+edge).datum()["node1"] = t.node;
        d3.select("#"+edge).attr("d", function(d){
          return "M"+d["node1"].attr("cx")+","+d["node1"].attr("cy")+" L"+d["node2"].attr("cx")+","+d["node2"].attr("cy")
        })
      })

      this.node.datum()["edgeOut"].forEach(function(edge){
        d3.select("#"+edge).datum()["node2"] = t.node;
        d3.select("#"+edge).attr("d", function(d){
          return "M"+d["node1"].attr("cx")+","+d["node1"].attr("cy")+" L"+d["node2"].attr("cx")+","+d["node2"].attr("cy")
        })
      })
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
