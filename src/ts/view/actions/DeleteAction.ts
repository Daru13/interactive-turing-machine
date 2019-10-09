import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Edge, EdgeHandleSelection } from "../graph/Edge";
import { Node, NodeHandleSelection } from "../graph/Node";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateMachine } from "../../model/StateMachine";

export class DeleteAction extends Action{
  graph: Graph;
  node: NodeHandleSelection;
  edge: EdgeHandleSelection;
  stateMachine: StateMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.graph = graph;
    this.stateMachine = turingMachine.stateMachine;
  }

  pointerDown(e: any){
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
      this.stateMachine.removeState(this.node.datum().stateID);
      console.log(this.stateMachine.toString());
      this.node = undefined;
    }
    if(this.edge !== undefined){
      this.stateMachine.removeTransition(this.edge.datum().transitionID);
      console.log(this.stateMachine.toString());
      this.edge = undefined;
    }
  }
}
