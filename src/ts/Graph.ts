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
      .append("g")
        .classed("node", true)
        .datum({x:0, y:0, id:("node-"+this.nodeId), edgeIn:[], edgeOut:[]})
        .attr("id", "node-"+this.nodeId)
        .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", Graph.sizeNode);
    this.moveNodeByD(d3.select("#node-"+this.nodeId), x, y);
    this.nodeId += 1;
  }

  moveNodeByD(node, dx, dy){
    node.datum()["x"] += dx;
    node.datum()["y"] += dy;
    node.attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
  }

  deleteNode(node){
    let t = this;
    node.datum()["edgeIn"].forEach(function(edge){
      d3.select("#"+edge).call(t.deleteEdge)
    })

    node.datum()["edgeOut"].forEach(function(edge){
      d3.select("#"+edge).call(t.deleteEdge)
    })
    node.remove();
  }

  isANode(selection){
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      if(d3.select("#" + selection.datum()["id"]).classed("node")){
        return true;
      }
    }
    return false;
  }

  getNodeHandle(selection){
    var node;
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      node = d3.select("#" + selection.datum()["id"])
      if(node.classed("node")){
        return node
      }
    }
    throw "Graph.ts (getNodeHandle): Selection is not part of a node"
  }

  addEdge(node1: any, node2: any){
    this.svg
      .append("path")
        .datum({"id": ("edge-"+this.edgeId), node1:node1, node2:node2})
        .attr("id", "edge-"+this.edgeId)
        .call(this.drawEdge)
        .classed("edge", true);
    node1.datum()["edgeOut"].push(("edge-"+this.edgeId))
    node2.datum()["edgeIn"].push(("edge-"+this.edgeId))
    this.edgeId += 1;
  }

  drawEdge(edge: any){
    let x1 = edge.datum()["node1"].datum()["x"];
    let y1 = edge.datum()["node1"].datum()["y"];
    let x2 = edge.datum()["node2"].datum()["x"];
    let y2 = edge.datum()["node2"].datum()["y"];
    let len = distance2({x: x1, y: y1}, {x: x2, y: y2});
    let dx1 = Graph.sizeNode * (x1 - x2) / len;
    let dy1 = Graph.sizeNode * (y1 - y2) / len;
    let dx2 = Graph.sizeNode * (x2 - x1) / len;
    let dy2 = Graph.sizeNode * (y2 - y1) / len;
    edge.attr("d", function(d){
      return "M"+(x1 - dx1)+","+(y1 - dy1)+" L"+(x2 - dx2)+","+(y2 - dy2)
    })
  }

  deleteEdge(edge){
    console.log(edge);
    let id = edge.datum()["id"];
    var index = edge.datum()["node1"].datum()["edgeOut"].indexOf(id);
    while(index !== -1){
      edge.datum()["node1"].datum()["edgeOut"].splice(index, 1);
      index = edge.datum()["node1"].datum()["edgeOut"].indexOf(id);
    }
    index = edge.datum()["node2"].datum()["edgeIn"].indexOf(id);
    while(index !== -1){
      edge.datum()["node2"].datum()["edgeIn"].splice(index, 1);
      index = edge.datum()["node2"].datum()["edgeIn"].indexOf(id);
    }
    edge.remove();
  }

  getSVGElement(){
    return this.svg.node();
  }
}
