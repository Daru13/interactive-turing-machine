import { Graph } from "./Graph";
import { Edge } from "./Edge";
import * as d3 from "d3-selection";

export const nodeTypes = {
  STANDARD: "standard",
  START: "start",
  FINAL: "final"
}

let nodeId = 0;

export class Node{
  constructor(){}

  static add(graph, x, y){
    let node =
      graph.getSVG()
        .append("g")
          .classed("node", true)
          .datum({x:0, y:0, id:("node-"+nodeId), edgeIn:[], edgeOut:[]})
          .attr("id", "node-"+nodeId)

    node.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", Graph.sizeNode);

    node.append("text")
      .attr("x",0)
      .attr("y",-2)
      .attr("text-anchor", "middle")
      .text("N"+nodeId);

    Node.translate(node, x, y);
    nodeId += 1;
  }

  static translate(node, dx, dy){
    node.datum()["x"] += dx;
    node.datum()["y"] += dy;
    node.attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
  }

  static delete(node){
    node.datum()["edgeIn"].forEach(function(edge){
      d3.select("#"+edge).call(Edge.delete)
    })

    node.datum()["edgeOut"].forEach(function(edge){
      d3.select("#"+edge).call(Edge.delete)
    })
    node.remove();
  }

  static isANode(selection){
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      if(d3.select("#" + selection.datum()["id"]).classed("node")){
        return true;
      }
    }
    return false;
  }

  static getHandle(selection){
    var node;
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      node = d3.select("#" + selection.datum()["id"])
      if(node.classed("node")){
        return node
      }
    }
    throw "Graph.ts (getNodeHandle): Selection is not part of a node"
  }

  static changeType(node, type){
    switch(type){
      case nodeTypes.START:
        node.classed("start", true)
        node.classed("final", false)
        break;
      case nodeTypes.STANDARD:
        node.classed("start", false)
        node.classed("final", false)
        break;
      case nodeTypes.FINAL:
        node.classed("start", false)
        node.classed("final", true)
        break;
      default:
        throw "Graph.ts (changeTypeNode) type not recognised: "+type
    }
  }
}
