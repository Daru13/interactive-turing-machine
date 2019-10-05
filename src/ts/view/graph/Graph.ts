import * as d3 from "d3-selection";
import { EventManager } from "../../events/EventManager";
import { Node } from "./Node"
import { NewStateEvent } from "../../events/NewStateEvent";
import { DeleteStateEvent } from "../../events/DeleteStateEvent";
import { NewTransitionEvent } from "../../events/NewTransitionEvent";
import { DeleteTransitionEvent } from "../../events/DeleteTransitionEvent";
import { Edge } from "./Edge";
import { EditTransitionEvent } from "../../events/EditTransitionEvent";
import { transition } from "d3";

export interface GraphDatum {};
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, {}>;

export class Graph {
  svg: GraphSelection;
  nodeId: number;
  edgeId: number;
  static sizeNode: number = 30;

  constructor(){
    this.svg = d3.select("#graph").append("svg");
    this.nodeId = 0;
    this.edgeId = 0;
    this.setupListeners()
  }

  getSVGElement(): SVGSVGElement{
    return this.svg.node() as SVGSVGElement;
  }

  getSVG(): GraphSelection{
    return this.svg;
  }

  setupListeners(){
    var t = this;
    EventManager.registerHandler("newState", function(e: NewStateEvent) {
      Node.add(t, e.state, e.x, e.y);
    })

    EventManager.registerHandler("deleteState", function(e: DeleteStateEvent) {
      Node.delete(Node.getHandleByStateId(e.state.id));
    })

    EventManager.registerHandler("newTransition", function(e: NewTransitionEvent) {
      Edge.add(t, e.transition);
    })

    EventManager.registerHandler("deleteTransition", function(e: DeleteTransitionEvent) {
      Edge.delete(Edge.getHandleByTransitionId(e.transition.id));
    })

    EventManager.registerHandler("editTransition", function (e: EditTransitionEvent) {
      Edge.drawText(Edge.getHandleByTransitionId(e.transition.id),
                    e.transition.getOnSymbol(),
                    e.transition.getOutputSymbol(),
                    e.transition.getHeadAction());
    })
  }
}
