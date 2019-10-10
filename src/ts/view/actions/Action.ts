import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";

export class Action{
  constructor(graph: Graph, turingMachine: TuringMachine){}
  do(){};
}