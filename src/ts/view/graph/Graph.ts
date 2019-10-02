import * as d3 from "d3-selection";
import { EventManager } from "../../events/EventManager";
import { Node } from "./Node"
import { NewStateEvent } from "../../events/NewStateEvent";
import { DeleteStateEvent } from "../../events/DeleteStateEvent";
import { NewTransitionEvent } from "../../events/NewTransitionEvent";
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
