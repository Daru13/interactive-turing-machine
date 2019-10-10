import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { EdgeTool } from "../tools/EdgeTool";
import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";

export class Pen {
  edgeTool: EdgeTool;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.edgeTool = new EdgeTool(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.edgeTool.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) {
    this.edgeTool.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) {
    this.edgeTool.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.edgeTool.pointerLeave(e);
  };
  click(e: ModifiedPointerEvent){}
}