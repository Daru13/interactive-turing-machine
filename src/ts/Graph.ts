import * as d3 from "d3-selection";
import { distance2, angleToXAxis } from "./helpers";

export class Graph {
  svg: any;
  nodeId: number;
  edgeId: number;
  static sizeNode: number = 30;

  constructor() {
    this.svg = d3.select("#graph").append("svg");
    this.svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", Graph.sizeNode);
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
    var edgeHandle =
      this.svg
        .append("g")
        .datum({"id": ("edge-"+this.edgeId), node1:node1, node2:node2})
        .attr("id", "edge-"+this.edgeId)
        .classed("edge", true);
    edgeHandle
      .append("rect")
        .attr("x", Graph.sizeNode)
        .attr("y", -20)
        .attr("width", 1)
        .attr("height", 40);
    edgeHandle.append("path").attr("d", "M0,0 L0,1");
    edgeHandle.append("text")
      .attr("x",0)
      .attr("y",15)
      .attr("text-anchor", "middle")
      .text("R:0/W:0/M:L")

    this.moveEdge(edgeHandle);

    node1.datum()["edgeOut"].push(("edge-"+this.edgeId));
    node2.datum()["edgeIn"].push(("edge-"+this.edgeId));
    this.edgeId += 1;
  }

  moveEdge(edge){
    let x1 = edge.datum()["node1"].datum()["x"];
    let y1 = edge.datum()["node1"].datum()["y"];
    let x2 = edge.datum()["node2"].datum()["x"];
    let y2 = edge.datum()["node2"].datum()["y"];
    let len = distance2({x: x1, y: y1}, {x: x2, y: y2}) - Graph.sizeNode;
    let angle = 180 * angleToXAxis({x: x1, y: y1}, {x: x2, y: y2}) / Math.PI;
    console.log(angle)

    edge.select("path").attr("d", "M" + Graph.sizeNode + ",0 L" + (len) + ",0");
    edge.select("rect").attr("width", len-Graph.sizeNode);
    edge.select("text").attr("x", (len)/2);
    if(angle > 90 || angle < -90){
      edge.select("text").attr("transform", "rotate(180," + (len/2) + ",0)")
    }else{
      edge.select("text").attr("transform", "")
    }

    edge.attr("transform", "rotate(" + angle + "," + (x1) + "," + (y1) + ")" + " translate(" + (x1) + "," + (y1) + ")")
  }

  deleteEdge(edge){
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

  isAnEdge(selection){
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      if(d3.select("#" + selection.datum()["id"]).classed("edge")){
        return true;
      }
    }
    return false;
  }

  getEdgeHandle(selection){
    var edge;
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      edge = d3.select("#" + selection.datum()["id"])
      if(edge.classed("edge")){
        return edge
      }
    }
    throw "Graph.ts (getEdgeHandle): Selection is not part of a edge"
  }

  getSVGElement(){
    return this.svg.node();
  }
}
