import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { StateID, State } from "../../model/State";

export enum NodeType {
  STANDARD = "standard",
  START = "start",
  FINAL = "final"
}

export interface NodeDatum {
  x: number;
  y: number;
  id: string;
  state: State;
};

export type NodeElementSelection = d3.Selection<SVGElement, NodeDatum, SVGElement, NodeDatum>;
export type NodeHandleSelection = d3.Selection<SVGElement, NodeDatum, HTMLElement, GraphDatum>;

export class Node{
  constructor(){}

  static add(graph: Graph, state: State, x: number, y: number): void{
    let datum: NodeDatum = {x: 0, y: 0, id: "node-" + state.id, state};
    let node: NodeHandleSelection =
      graph.getSVG()
        .append("g")
          .classed("node", true)
          .datum(datum)
          .attr("id", "node-"+state.id)

    node.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", Graph.sizeNode);

    node.append("text")
      .attr("x",0)
      .attr("y",-2)
      .attr("text-anchor", "middle")
      .text("N"+state.id);

    Node.translate(node, x, y);
  }

  static translate(node: NodeHandleSelection, dx: number, dy: number): void{
    node.datum()["x"] += dx;
    node.datum()["y"] += dy;
    node.attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
  }

  static delete(node){
    node.remove();
  }

  static isNode(selection: d3.Selection<any, any, any, any>): boolean{
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      if(d3.select("#" + selection.datum()["id"]).classed("node")){
        return true;
      }
    }
    return false;
  }

  static getHandle(selection: NodeElementSelection): NodeHandleSelection{
    var node: NodeHandleSelection;
    if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
      node = d3.select("#" + selection.datum()["id"])
      if(node.classed("node")){
        return node
      }
    }
    throw "Graph.ts (getNodeHandle): Selection is not part of a node"
  }

  static getHandleByStateId(stateId: StateID): NodeHandleSelection{
    return d3.select("#node-"+stateId);
  }

  static changeType(node: NodeHandleSelection, type: NodeType): void{
    switch(type){
      case NodeType.START:
        node.classed("start", true)
        node.classed("final", false)
        break;
      case NodeType.STANDARD:
        node.classed("start", false)
        node.classed("final", false)
        break;
      case NodeType.FINAL:
        node.classed("start", false)
        node.classed("final", true)
        break;
      default:
        throw "Node.ts (changeType) type not recognised: "+type
    }
  }
}
