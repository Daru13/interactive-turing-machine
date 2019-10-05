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

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.idToPenAndTouch = {} as Record<string, any>;
    this.graph = graph;
    this.turingMachine = turingMachine;
    this.setInteraction();
  }

  setInteraction() {
    var t = this;
    t.graph.getSVGElement().addEventListener("pointerdown",
      function (e) {
        t.dispatchDownEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointermove",
      function (e) {
        t.dispatchMoveEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointerup",
      function (e) {
        t.dispatchUpEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointerleave",
      function (e) {
        t.dispatchLeaveEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointercancel",
      (e: PointerEvent) => console.log("cancel"));
  }

  dispatchDownEvent(e: ModifiedPointerEvent) {
    this.updateXYSVG(e);
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
    this.updateXYSVG(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined){
      this.idToPenAndTouch[e.pointerId].pointerMove(e);
    }
  }

  dispatchUpEvent(e: ModifiedPointerEvent) {
    this.updateXYSVG(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].pointerUp(e);
    }
  }

  dispatchLeaveEvent(e: ModifiedPointerEvent) {
    this.updateXYSVG(e);
    if (this.idToPenAndTouch[e.pointerId] !== undefined) {
      this.idToPenAndTouch[e.pointerId].pointerLeave(e);
    }
  }

  updateXYSVG(e: ModifiedPointerEvent) {
    var pt = this.graph.getSVGElement().createSVGPoint(), svgP;

    pt.x = e.x;
    pt.y = e.y;
    svgP = pt.matrixTransform(this.graph.getSVGElement().getScreenCTM().inverse());
    e.x = svgP.x;
    e.y = svgP.y;
  }
}
