import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { Node, NodeHandleSelection } from "./Node";
import { Transition } from "../../model/Transition";
import { Helpers } from "../../helpers";

export type EdgeId = String;

export interface EdgeDatum {
  id: string;
  transition: Transition
};

export type EdgeElementSelection = d3.Selection<SVGElement, EdgeDatum, SVGElement, EdgeDatum>;
export type EdgeHandleSelection = d3.Selection<SVGGElement, EdgeDatum, HTMLElement, GraphDatum>;

export class Edge{

  constructor(){}

  static add(graph, transition: Transition): void{
    let id = "edge-" + transition.id;
    let datum: EdgeDatum = { id: id, transition: transition };
    var edgeHandle :EdgeHandleSelection =
      graph.getSVG()
        .append("g")
        .datum(datum)
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

  static move(edge: EdgeHandleSelection){
    let fromState = edge.datum().transition.fromState;
    let toState = edge.datum().transition.toState;

    let x1 = Node.getHandleByStateId(fromState.id).datum()["x"];
    let y1 = Node.getHandleByStateId(fromState.id).datum()["y"];
    let x2 = Node.getHandleByStateId(toState.id).datum()["x"];
    let y2 = Node.getHandleByStateId(toState.id).datum()["y"];
    
    let len = Helpers.distance2({x: x1, y: y1}, {x: x2, y: y2}) - Graph.sizeNode;
    let angle = 180 * Helpers.angleToXAxis({x: x1, y: y1}, {x: x2, y: y2}) / Math.PI;

    edge.select("path").attr("d", "M" + Graph.sizeNode + ",0 L" + (len) + ",0");
    edge.select("rect").attr("width", len-Graph.sizeNode);
    
    edge.select("text").attr("x", (len)/2);
    if(angle > 90 || angle < -90){
      edge.select("text").attr("transform", "rotate(180," + (len/2) + ",0)")
    }else{
      edge.select("text").attr("transform", "")
    }

    edge.attr("transform", "rotate(" + angle + "," + (x1) + "," + (y1) + ")" + " translate(" + (x1) + "," + (y1) + ")");
  }

  static delete(edge: EdgeHandleSelection): void{
    edge.remove();
  }

  static isAnEdge(selection: d3.Selection<any, any, any, any>): boolean{
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      if(d3.select("#" + selection.datum()["id"]).classed("edge")){
        return true;
      }
    }
    return false;
  }

  static getHandle(selection: EdgeElementSelection): EdgeHandleSelection{
    var edge: EdgeHandleSelection;
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      edge = d3.select("#" + selection.datum()["id"])
      if(edge.classed("edge")){
        return edge
      }
    }
    throw "Graph.ts (getEdgeHandle): Selection is not part of a edge"
  }

  static drawText(edge: EdgeHandleSelection): void{
    edge.select("text")
      .text(function(d){return "R:" + d.transition.onSymbol + "/W:" + d.transition.outputSymbol + "/D:" + d.transition.headAction});
  }
}
