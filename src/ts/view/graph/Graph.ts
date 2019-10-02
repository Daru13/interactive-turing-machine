import * as d3 from "d3-selection";
import { distance2, angleToXAxis } from "../../helpers";
import { EventManager } from "../../events/EventManager";
import { Node } from "./Node"
import { NewStateEvent } from "../../events/newStateEvent";
import { DeleteStateEvent } from "../../events/deleteStateEvent";
import { State } from "../../model/State";
import { Transition } from "../../model/Transition";
import { NewTransitionEvent } from "../../events/newTransitionEvent";
import { DeleteTransitionEvent } from "../../events/DeleteTransitionEvent";
import { Edge } from "./Edge";

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

  getSVGElement(): SVGElement{
    return this.svg.node();
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
      Node.delete(d3.select("#node-"+e.state.id));
    })

    EventManager.registerHandler("newTransition", function(e: NewTransitionEvent) {
      Edge.add(t, e.transition);
    })

    EventManager.registerHandler("deleteTransition", function(e: DeleteTransitionEvent) {
      Edge.delete(d3.select("#node-"+e.transition.id));
    })
  }
}
