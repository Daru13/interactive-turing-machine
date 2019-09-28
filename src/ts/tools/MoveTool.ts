import * as d3 from "d3-selection";
import { Graph } from "../Graph";

export class MoveTool{
  previousX: number;
  previousY: number;
  node: any;
  graph: Graph;

  constructor(graph: Graph){
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph
  }

  pointerDown(e: any){
    this.previousX = e.x;
    this.previousY = e.y;
    if(this.graph.isANode(d3.select(e.target as any))){
      this.node = this.graph.getNodeHandle(d3.select(e.target as any))
    }else{
      this.node = undefined
    }
  }

  pointerMove(e: any){
    if(this.node !== undefined){
      this.graph.moveNodeByD(this.node, e.x - this.previousX, e.y - this.previousY);

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
