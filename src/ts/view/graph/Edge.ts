import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { Node, NodeHandleSelection } from "./Node";
import { Transition, TransitionID } from "../../model/Transition";
import { Helpers } from "../../helpers";
import { HeadAction, TapeSymbol } from "../../model/Tape";

export type EdgeId = String;

export interface EdgeDatum {
  id: string;
  transitionID: TransitionID
};

export type EdgeElementSelection = d3.Selection<SVGElement, EdgeDatum, SVGElement, EdgeDatum>;
export type EdgeHandleSelection = d3.Selection<SVGGElement, EdgeDatum, HTMLElement, GraphDatum>;

export class Edge{

  constructor(){}

  static add(graph, transition: Transition): void{
    let id = "edge-" + transition.id;
    let datum: EdgeDatum = { id: id, transitionID: transition.id };
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

    Edge.move(edgeHandle, Node.getHandleByStateId(transition.fromState.id), Node.getHandleByStateId(transition.toState.id));
  }
  
  static move(edge: EdgeHandleSelection, fromNode: NodeHandleSelection, toNode: NodeHandleSelection){
    let x1 = fromNode.datum().x;
    let y1 = fromNode.datum().y;
    let x2 = toNode.datum().x;
    let y2 = toNode.datum().y;
    
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

  static getHandleByTransitionId(transitionID: TransitionID): EdgeHandleSelection {
    return d3.select("#edge-" + transitionID);
  }

  static drawText(edge: EdgeHandleSelection, onSymbol: TapeSymbol, outputSymbol: TapeSymbol, headAction:HeadAction): void{
    edge.select("text")
      .text(function(d){return "R:" + onSymbol + "/W:" + outputSymbol + "/D:" + headAction});
  }
}
