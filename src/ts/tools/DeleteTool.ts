import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Node } from "../graph/Node";
import { Edge } from "../graph/Edge";

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
    if(Node.isANode(d3.select(e.target as any))){
      this.node = Node.getHandle(d3.select(e.target as any));
    }else if(Edge.isAnEdge(d3.select(e.target as any))){
      this.edge = Edge.getHandle(d3.select(e.target as any));
    }
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    if(this.node !== undefined){
      Node.delete(this.node);
      this.node = undefined;
    }
    if(this.edge !== undefined){
      Edge.delete(this.edge);
      this.edge = undefined;
    }
  }
}
