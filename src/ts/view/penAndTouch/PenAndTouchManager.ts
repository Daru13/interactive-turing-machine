import { Helpers } from "../../helpers";
import { TuringMachine } from "../../model/TuringMachine";
import { Graph } from "../graph/Graph";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { toolName } from "../tools/ToolManager";
import { Pen } from "./Pen";
import { Eraser } from "./Eraser";
import { Touch } from "./Touch";

export class PenAndTouchManager {
  readonly idToPenAndTouch: Record<string, any>;
  readonly graph: Graph;
  readonly turingMachine: TuringMachine;
  isActivated: boolean;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.idToPenAndTouch = {} as Record<string, any>;
    this.graph = graph;
    this.turingMachine = turingMachine;
    this.isActivated = false;
    this.setInteraction();
  }

  setInteraction() {
    var t = this;
    t.graph.getSVGElement().addEventListener("pointerdown",
      function (e) {
        if (t.isActivated) {
          t.dispatchDownEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointermove",
      function (e) {
        if (t.isActivated) {
          t.dispatchMoveEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointerup",
      function (e) {
        if (t.isActivated) {
          t.dispatchUpEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointerleave",
      function (e) {
        if (t.isActivated) {
          t.dispatchLeaveEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointercancel",
      function (e) {
        if (t.isActivated) {
          console.log("cancel");
        }
      });
  }

  dispatchDownEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
    switch(e.pointerType){
      case  "touch":
        this.idToPenAndTouch[e.pointerId] = new Touch(this.graph, this.turingMachine, e);
        break;
      case  "pen":
        this.idToPenAndTouch[e.pointerId] = new Pen(this.graph, this.turingMachine);
        break;
      case "eraser":
        this.idToPenAndTouch[e.pointerId] = new Eraser(this.graph, this.turingMachine);
        break;
      case "modify":
      default:
    }
    this.idToPenAndTouch[e.pointerId].pointerDown(e);
  }

  dispatchMoveEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
    if (this.idToPenAndTouch[e.pointerId] !== undefined){
      this.idToPenAndTouch[e.pointerId].pointerMove(e);
    }
  }

  dispatchUpEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].pointerUp(e);
    }
  }

  dispatchLeaveEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].pointerLeave(e);
    }
  }

  activate() {
    this.isActivated = true;
  }

  deactivate() {
    this.isActivated = false;
  }
}
