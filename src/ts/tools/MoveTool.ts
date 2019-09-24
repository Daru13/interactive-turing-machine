import * as d3 from "d3-selection";
import { distance2 } from "../helpers";
import { Graph } from "../Graph";

export class MoveTool{
  previousX: number;
  previousY: number;
  node: d3.Selection<any, unknown, null, undefined>;
  graph: Graph;

  constructor(graph: Graph){
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph
  }

  pointerDown(e: any){
    this.previousX = e.x;
    this.previousY = e.y;

    this.node = d3.select(e.target as any);
    if(!this.node.classed("node")){
      this.node = undefined
    }
  }

  pointerMove(e: any){
    if(this.node !== undefined){
      this.node.attr("cx", parseFloat(this.node.attr("cx")) + e.x - this.previousX);
      this.node.attr("cy", parseFloat(this.node.attr("cy")) + e.y - this.previousY);

      var t = this

      this.node.datum()["edgeIn"].forEach(function(edge){
        console.log(edge, t.node.datum()["edgeIn"])
        d3.select("#"+edge).call(t.graph.drawEdge)
      })

      this.node.datum()["edgeOut"].forEach(function(edge){
        d3.select("#"+edge).call(t.graph.drawEdge)
      })
    }

    this.previousX = e.x;
    this.previousY = e.y;
  }

  pointerUp(e: any){
    if(this.node !== undefined){
      this.node = undefined;
    }
  }
}
