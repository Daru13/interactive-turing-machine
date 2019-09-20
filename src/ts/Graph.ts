import * as d3 from "d3-selection";
import { EventManager } from "./EventManager";
import { NodeInteraction } from "./interaction/nodeInteraction";
import { SVGInteraction } from "./interaction/SVGInteraction";

export class Graph {
  svg: any;
  nodeId: number;
  nodeSelected: any;
  eventManager: EventManager;

  constructor(eventManager: EventManager) {
    this.svg = d3.select("#graph").append("svg");
    this.nodeId = 0;
    this.nodeSelected = null;
    this.eventManager = eventManager;
    eventManager.addEventForTag("svg", new SVGInteraction(this.svg))
    eventManager.addEventForClass("node", new NodeInteraction(this))
  }

  addEdge(pt1: any, pt2: any){
    this.svg
      .append("path")
        .attr("d", "M"+pt1.attr("cx")+","+pt1.attr("cy")+" L"+pt2.attr("cx")+","+pt2.attr("cy"))
        .classed("edge", true)
  }
}
