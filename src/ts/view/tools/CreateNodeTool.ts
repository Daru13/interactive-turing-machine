import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { State } from "../../model/State";
import { Tool } from "./Tool";

export class CreateNodeTool extends Tool{
  eX: number;
  eY: number;
  graph: Graph;
  turingMachine: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.eX = 0;
    this.eY = 0;
    this.graph = graph;
    this.turingMachine = turingMachine;
  }

  pointerDown(e: any){
    this.eX = e.x;
    this.eY = e.y;
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    this.turingMachine.stateMachine.addState(new State(""), this.eX, this.eY);
  }
}
