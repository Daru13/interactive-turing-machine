import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { Helpers } from "../../helpers";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";

export class GraphInteraction {
  readonly graph: Graph;
  readonly tM: TuringMachine;
  isActivated: boolean;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.graph = graph;
    this.tM = turingMachine;
    this.isActivated = false;
    this.setInteraction();
  }

  setInteraction() {
    var t = this;
    let ptDown = { x: 0, y: 0 };
    let distPDown = 0;
    t.graph.getSVGElement().addEventListener("pointerdown",
      function (e) {
        if (t.isActivated) {
          ptDown.x = e.x;
          ptDown.y = e.y;
          distPDown = 0;
          t.dispatchDownEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointermove",
      function (e) {
        if (t.isActivated) {
          distPDown = Helpers.distance2(ptDown, { x: e.x, y: e.y });
          t.dispatchMoveEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointerup",
      function (e) {
        if (t.isActivated) {
          t.dispatchUpEvent(Helpers.transformEvent(e));
          if (distPDown < Graph.sizeNode / 2) {
            t.dispatchClickEvent(Helpers.transformEvent(e));
          }
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
  }

  dispatchMoveEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
  }

  dispatchUpEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
  }

  dispatchLeaveEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
  }

  dispatchClickEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
  }

  activate() {
    this.isActivated = true;
  }

  deactivate() {
    this.isActivated = false;
  }
}