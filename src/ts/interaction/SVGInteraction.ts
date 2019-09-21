import * as d3 from "d3-selection";
import { Graph } from "../Graph";

export class SVGInteraction {
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
    this.graph.addNode(this.eX, this.eY)
  }
}
