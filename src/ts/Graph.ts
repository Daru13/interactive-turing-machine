import * as d3 from "d3-selection";
import { distance2 } from "./helpers";

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

  addNode(x, y){
    this.svg
      .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", Graph.sizeNode)
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
        .call(this.drawEdge)
        .classed("edge", true);
    node1.datum()["edgeIn"].push(("edge-"+this.edgeId))
    node2.datum()["edgeOut"].push(("edge-"+this.edgeId))
    this.edgeId += 1;
  }

  drawEdge(edge: any){
    let x1 = edge.datum()["node1"].attr("cx");
    let y1 = edge.datum()["node1"].attr("cy");
    let x2 = edge.datum()["node2"].attr("cx");
    let y2 = edge.datum()["node2"].attr("cy");
    let len = distance2({x: x1, y: y1}, {x: x2, y: y2});
    let dx1 = Graph.sizeNode * (x1 - x2) / len;
    let dy1 = Graph.sizeNode * (y1 - y2) / len;
    let dx2 = Graph.sizeNode * (x2 - x1) / len;
    let dy2 = Graph.sizeNode * (y2 - y1) / len;
    edge.attr("d", function(d){
      return "M"+(x1 - dx1)+","+(y1 - dy1)+" L"+(x2 - dx2)+","+(y2 - dy2)
    })
  }

  getSVGElement(){
    return this.svg.node();
  }
}
