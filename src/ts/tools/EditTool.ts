import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { EdgeEditor } from "../EdgeEditor";
import { NodeEditor } from "../NodeEditor";

export class EditTool{
  graph: Graph;
  edge: any;
  node: any;

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
      new NodeEditor(this.graph, this.node);
    }
    if(this.edge !== undefined){
      new EdgeEditor(this.graph, this.edge);
    }
  }
}
