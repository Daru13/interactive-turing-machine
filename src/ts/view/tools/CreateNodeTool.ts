import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { State } from "../../model/State";
import { Tool } from "./Tool";
import { Helpers } from "../../helpers";

export class CreateNodeTool extends Tool{
  eX: number;
  eY: number;
  graph: Graph;
  turingMachine: TuringMachine;
  static nameState: number = 0;
  distance: number

  constructor(graph: Graph, turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.eX = 0;
    this.eY = 0;
    this.graph = graph;
    this.turingMachine = turingMachine;
    this.distance = 0
  }

  pointerDown(e: any){
    this.eX = e.x;
    this.eY = e.y;
    this.distance = 0
  }

  pointerMove(e: any){
    this.distance = Helpers.distance2({ x: this.eX, y: this.eY }, { x: e.x, y: e.y });
  }

  pointerUp(e: any){
    if(this.distance < 20){
      this.turingMachine.stateMachine.addState(new State(CreateNodeTool.nameState.toString()), this.eX, this.eY);
      CreateNodeTool.nameState += 1;
    }
    console.log(this.turingMachine.stateMachine.toString());
  }
}
