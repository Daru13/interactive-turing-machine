import * as d3 from "d3-selection";
import { distance2, angleToXAxis } from "./helpers";

export class Graph {
  svg: any;
  nodeId: number;
  edgeId: number;
  static sizeNode: number = 30;

  constructor() {
    this.svg = d3.select("#graph").append("svg");
    this.nodeId = 0;
    this.edgeId = 0;
  }

  getSVGElement(){
    return this.svg.node();
  }

  getSVG(){
    return this.svg;
  }
}
