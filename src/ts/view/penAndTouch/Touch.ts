import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { MoveAction } from "../actions/MoveAction";
import { CreateNodeAction } from "../actions/CreateNodeAction";
import { Node, NodeHandleSelection } from "../graph/Node";
import * as d3 from "d3-selection";
import { Edge, EdgeHandleSelection } from "../graph/Edge";
import { Action } from "../actions/Action";
import { Helpers } from "../../helpers";
import { EditEdgeAction } from "../actions/EditEdgeAction";
import { EditNodeAction } from "../actions/EditNodeAction";

export class Touch{
  tool: Action;
  pDownEvent: ModifiedPointerEvent;
  pMoveEvent: ModifiedPointerEvent;
  distance: number;
  turingMachine: TuringMachine;
  graph: Graph;
  isTargetANode: boolean;
  target: d3.BaseType;

  constructor(graph: Graph, turingMachine: TuringMachine, e: ModifiedPointerEvent){
    this.graph = graph;
    this.turingMachine = turingMachine;
    this.isTargetANode = false;
    this.distance = 0;

    this.target = e.target as d3.BaseType;
    this.tool = new MoveAction(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.pDownEvent = e;
    this.tool.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) {
    this.pMoveEvent = e;
    this.distance = Helpers.distance2({ x: this.pDownEvent.x, y: this.pDownEvent.y}, { x: e.x, y: e.y})
    this.tool.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) {
    if (this.distance < 10){
      if (d3.select(this.target).property("tagName") === "svg") {
        CreateNodeAction.do(e.x, e.y, this.turingMachine);
      } else if (Node.isNode(d3.select(this.target))) {
        EditNodeAction.do(d3.select(this.target) as NodeHandleSelection, this.turingMachine)
      } else if (Edge.isAnEdge(d3.select(this.target))) {
        EditEdgeAction.do(d3.select(this.target) as EdgeHandleSelection, this.turingMachine);
      }
    }
    this.tool.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.tool.pointerLeave(e);
  };
}