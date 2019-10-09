import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { CreateEdgeAction } from "../actions/CreateEdgeAction";
import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";

export class Pen {
  createEdgeTool: CreateEdgeAction;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.createEdgeTool = new CreateEdgeAction(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.createEdgeTool.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) {
    this.createEdgeTool.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) {
    this.createEdgeTool.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.createEdgeTool.pointerLeave(e);
  };
}