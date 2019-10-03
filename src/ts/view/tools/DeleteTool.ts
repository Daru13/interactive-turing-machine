import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Edge } from "../graph/Edge";
import { Node } from "../graph/Node";
import { TuringMachine } from "../../model/TuringMachine";
import { Tool } from "./Tool";

export class DeleteTool extends Tool{
  graph: Graph;
  node: d3.Selection<SVGElement, any, any, any>;
  edge: any;
  turingMachine: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.graph = graph
    this.turingMachine = turingMachine
  }

  pointerDown(e: any){
    let target = d3.select(e.target as any);
    this.edge = undefined;
    this.node = undefined;
    if(Node.isNode(d3.select(e.target as any))){
      this.node = Node.getHandle(d3.select(e.target as any));
    }else if(Edge.isAnEdge(d3.select(e.target as any))){
      this.edge = Edge.getHandle(d3.select(e.target as any));
    }
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    if(this.node !== undefined){
      this.turingMachine.stateMachine.removeState(this.node.datum()["state"]);
      this.node = undefined;
    }
    if(this.edge !== undefined){
      this.turingMachine.stateMachine.removeTransition(this.edge.datum()["transition"]);
      this.edge = undefined;
    }
  }
}
