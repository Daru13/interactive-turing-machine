import * as d3 from "d3-selection";
import { Graph } from "../Graph";

export class DeleteTool{
  graph: Graph;
  node: d3.Selection<any, unknown, null, undefined>;
  edge: any;

  constructor(graph: Graph){
    this.graph = graph
  }

  pointerDown(e: any){
    let target = d3.select(e.target as any);
    this.edge = undefined;
    this.node = undefined;
    if(this.graph.isANode(d3.select(e.target as any))){
      this.node = this.graph.getNodeHandle(d3.select(e.target as any));
    }else if(this.graph.isAnEdge(d3.select(e.target as any))){
      this.edge = this.graph.getEdgeHandle(d3.select(e.target as any));
    }
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    if(this.node !== undefined){
      this.graph.deleteNode(this.node);
      this.node = undefined;
    }
    if(this.edge !== undefined){
      this.graph.deleteEdge(this.edge);
      this.edge = undefined;
    }
  }
}
