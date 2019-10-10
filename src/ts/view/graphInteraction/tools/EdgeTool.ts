import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { CreateEdgeAction } from "../../actions/CreateEdgeAction";
import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";

export class EdgeTool {
  createEdgeAction: CreateEdgeAction;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.createEdgeAction = new CreateEdgeAction(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.createEdgeAction.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) {
    this.createEdgeAction.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) {
    this.createEdgeAction.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.createEdgeAction.pointerLeave(e);
  };
}