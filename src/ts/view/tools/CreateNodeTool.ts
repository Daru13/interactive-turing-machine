import { Graph } from "../graph/Graph";
import { Node } from "../graph/Node";

export class CreateNodeTool{
  eX: number;
  eY: number;
  graph: Graph;

  constructor(graph: Graph){
    this.eX = 0;
    this.eY = 0;
    this.graph = graph

  }

  pointerDown(e: any){
    this.eX = e.x;
    this.eY = e.y;
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    Node.add(this.graph, this.eX, this.eY)
  }
}
