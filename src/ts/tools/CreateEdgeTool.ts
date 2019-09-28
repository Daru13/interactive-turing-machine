import { distance2 } from "../helpers";
import * as d3 from "d3-selection";
import { Graph } from "../Graph";

export class CreateEdgeTool{
  previousX: number;
  previousY: number;
  graph: Graph;
  node: d3.Selection<any, unknown, null, undefined>;
  isDown: boolean;

  constructor(graph: Graph){
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph
    this.isDown = false;

  }

  pointerDown(e: any){
    this.previousX = e.x;
    this.previousY = e.y;
    this.node = d3.select(e.target as any);
    this.isDown = true;

    this.node.classed("selected", true)
    this.graph.svg
      .append("path")
        .attr("d", "M"+this.node.datum()["x"]+","+this.node.datum()["y"]+" L"+this.previousX+","+this.previousY)
        .classed("edgeInCreation", true)
  }

  pointerMove(e: any){
    if(this.isDown){
      this.graph.svg
        .select(".edgeInCreation")
          .attr("d", "M"+this.node.datum()["x"]+","+this.node.datum()["y"]+" L"+this.previousX+","+this.previousY)

      this.previousX = e.x;
      this.previousY = e.y;
    }
  }

  pointerUp(e: any){
    this.isDown = false;

    this.graph.svg
      .select(".edgeInCreation")
      .remove()
    let closestNode: d3.Selection<d3.BaseType, unknown, null, undefined>;
    let closestDistance = Infinity;
    let t = this;
    d3.selectAll(".node:not(.selected)").each(function(){
      if(distance2({x: t.previousX, y: t.previousY},
                   {x: parseFloat(d3.select(this).datum()["x"]), y: parseFloat(d3.select(this).datum()["y"])}) < closestDistance){
        closestDistance =distance2({x: t.previousX, y: t.previousY},
                     {x: parseFloat(d3.select(this).datum()["x"]), y: parseFloat(d3.select(this).datum()["y"])})
        closestNode = d3.select(this)
      }
    })
    d3.selectAll(".node.selected").classed("selected", false);
    this.graph.addEdge(this.node, closestNode);
  }
}
