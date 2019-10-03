import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";

export class Tool{
  constructor(graph: Graph, turingMachine: TuringMachine){}
  pointerDown(e: any){ };
  pointerMove(e: any){ };
  pointerUp(e: any){};
}