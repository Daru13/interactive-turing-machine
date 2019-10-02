import * as d3 from "d3-selection";
import { distance2, angleToXAxis } from "../../helpers";

export interface GraphDatum {};
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, {}>;

export class Graph {
  svg: GraphSelection;
  nodeId: number;
  edgeId: number;
  static sizeNode: number = 30;

  constructor(){
    this.svg = d3.select("#graph").append("svg");
    this.nodeId = 0;
    this.edgeId = 0;
  }

  getSVGElement(): SVGElement{
    return this.svg.node();
  }

  getSVG(): GraphSelection{
    return this.svg;
  }
}
