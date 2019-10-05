import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";

export class Tool{
  constructor(graph: Graph, turingMachine: TuringMachine){}
  pointerDown(e: ModifiedPointerEvent){ };
  pointerMove(e: ModifiedPointerEvent){ };
  pointerUp(e: ModifiedPointerEvent){};
  pointerLeave(e: ModifiedPointerEvent){};
}