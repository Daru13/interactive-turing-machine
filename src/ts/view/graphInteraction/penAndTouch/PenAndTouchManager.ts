import { Helpers } from "../../../helpers";
import { TuringMachine } from "../../../model/TuringMachine";
import { Graph } from "../../graph/Graph";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { Pen } from "./Pen";
import { Eraser } from "./Eraser";
import { Touch } from "./Touch";
import { GraphInteraction } from "../GraphInteraction";

export class PenAndTouchManager extends GraphInteraction{
  readonly idToPenAndTouch: Record<string, any>;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    super(graph, turingMachine)
    this.idToPenAndTouch = {} as Record<string, any>;
  }

  dispatchDownEvent(e: ModifiedPointerEvent) {
    super.dispatchDownEvent(e);
    switch(e.pointerType){
      case  "touch":
        this.idToPenAndTouch[e.pointerId] = new Touch(this.graph, this.tM);
        break;
      case  "pen":
        this.idToPenAndTouch[e.pointerId] = new Pen(this.graph, this.tM);
        break;
      case "eraser":
        this.idToPenAndTouch[e.pointerId] = new Eraser(this.graph, this.tM);
        break;
      case "modify":
      default:
    }
    this.idToPenAndTouch[e.pointerId].pointerDown(e);
  }

  dispatchMoveEvent(e: ModifiedPointerEvent) {
    super.dispatchMoveEvent(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined){
      this.idToPenAndTouch[e.pointerId].pointerMove(e);
    }
  }

  dispatchUpEvent(e: ModifiedPointerEvent) {
    super.dispatchUpEvent(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].pointerUp(e);
    }
  }

  dispatchLeaveEvent(e: ModifiedPointerEvent) {
    super.dispatchLeaveEvent(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].pointerLeave(e);
    }
  }

  dispatchClickEvent(e: ModifiedPointerEvent) {
    super.dispatchClickEvent(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].click(e);
    }
  }
}
