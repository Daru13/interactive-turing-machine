import * as d3 from "d3-selection";
import { Graph } from "../Graph";

export class DeleteTool{
  graph: Graph;
  node: d3.Selection<any, unknown, null, undefined>;

  constructor(graph: Graph){
    this.graph = graph
  }

  pointerDown(e: any){
    let target = d3.select(e.target as any);
    if(this.graph.isANode(d3.select(e.target as any))){
      this.node = this.graph.getNodeHandle(d3.select(e.target as any))
    }else{
      this.node = undefined
    }
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    if(this.node !== undefined){
      this.graph.deleteNode(this.node);
      this.node = undefined;
    }
  }
}
