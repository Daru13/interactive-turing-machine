import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { MoveAction } from "../actions/MoveAction";
import { Action } from "../actions/Action";

export class NodeTool{
  action: Action;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.action = new MoveAction(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.action.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) {
    this.action.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) {
    this.action.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.action.pointerLeave(e);
  };
}