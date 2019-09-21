import * as d3 from "d3-selection";
import { EventManager } from "./EventManager";
import { NodeInteraction } from "./interaction/nodeInteraction";
import { SVGInteraction } from "./interaction/SVGInteraction";

export class Graph {
  svg: any;
  nodeId: number;
  edgeId: number;
  eventManager: EventManager;

  constructor(eventManager: EventManager) {
    this.svg = d3.select("#graph").append("svg");
    this.nodeId = 0;
    this.edgeId = 0;
    this.eventManager = eventManager;
    eventManager.addEventForTag("svg", new SVGInteraction(this))
    eventManager.addEventForClass("node", new NodeInteraction(this))
  }

  addNode(x, y){
    this.svg
      .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 30)
        .classed("node", true)
        .attr("id", "node-"+this.nodeId)
        .datum({id:("node-"+this.nodeId), edgeIn:[], edgeOut:[]});
    this.nodeId += 1;
  }

  addEdge(node1: any, node2: any){
    this.svg
      .append("path")
        .datum({"id": ("edge-"+this.edgeId), node1:node1, node2:node2})
        .attr("id", "edge-"+this.edgeId)
        .attr("d", function(d){
          return "M"+d["node1"].attr("cx")+","+d["node1"].attr("cy")+" L"+d["node2"].attr("cx")+","+d["node2"].attr("cy")
        })
        .classed("edge", true)
    node1.datum()["edgeIn"].push(("edge-"+this.edgeId))
    node2.datum()["edgeOut"].push(("edge-"+this.edgeId))
    this.edgeId += 1;
  }
}
