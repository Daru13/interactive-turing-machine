import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { distance2, angleToXAxis } from "../../helpers";
import { Transition } from "../../model/Transition";

export type EdgeId = String;

export interface EdgeDatum {
  id: string;
  transition: Transition
};

export type EdgeElementSelection = d3.Selection<SVGElement, EdgeDatum, SVGElement, EdgeDatum>;
export type EdgeHandleSelection = d3.Selection<SVGElement, EdgeDatum, HTMLElement, GraphDatum>;

export class Edge{

  constructor(){}

  static add(graph, transition: Transition){
    let id = "edge-" + transition.id;
    var edgeHandle =
      graph.getSVG()
        .append("g")
        .datum({id: id, transition: transition})
        .attr("id", id)
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
      .text("click to set");

    Edge.move(edgeHandle);
  }

  static move(edge){
    let x1 = edge.datum()["node1"].datum()["x"];
    let y1 = edge.datum()["node1"].datum()["y"];
    let x2 = edge.datum()["node2"].datum()["x"];
    let y2 = edge.datum()["node2"].datum()["y"];
    let len = distance2({x: x1, y: y1}, {x: x2, y: y2}) - Graph.sizeNode;
    let angle = 180 * angleToXAxis({x: x1, y: y1}, {x: x2, y: y2}) / Math.PI;
    console.log(angle)

    edge.select("path").attr("d", "M" + Graph.sizeNode + ",0 L" + (len) + ",0");
    edge.select("rect").attr("width", len-Graph.sizeNode);
    edge.select("text")
      .attr("x", (len)/2);
    if(angle > 90 || angle < -90){
      edge.select("text").attr("transform", "rotate(180," + (len/2) + ",0)")
    }else{
      edge.select("text").attr("transform", "")
    }

    edge.attr("transform", "rotate(" + angle + "," + (x1) + "," + (y1) + ")" + " translate(" + (x1) + "," + (y1) + ")")
  }

  static delete(edge){
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

  static isAnEdge(selection){
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      if(d3.select("#" + selection.datum()["id"]).classed("edge")){
        return true;
      }
    }
    return false;
  }

  static getHandle(selection){
    var edge;
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      edge = d3.select("#" + selection.datum()["id"])
      if(edge.classed("edge")){
        return edge
      }
    }
    throw "Graph.ts (getEdgeHandle): Selection is not part of a edge"
  }

  static setTransition(edge){
    edge.select("text")
    .text(function(d){return "R:" + d.transition.onSymbol + "/W:" + d.transition.outputSymbol + "/D:" + d.transition.headAction})
  }
}
