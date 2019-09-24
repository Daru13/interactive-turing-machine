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
    if(target.classed("node")){
      this.node = target;
    }else{

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
