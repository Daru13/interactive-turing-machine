import * as d3 from "d3-selection";
import { Graph } from "../../graph/Graph";
import { Node } from "../../graph/Node";
import { Edge } from "../../graph/Edge";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { MoveNodeAction } from "../../actions/MoveNodeAction";
import { NodeHandleSelection } from "../../graph/Node";

export class NodeTool{
  previousX: number;
  previousY: number;
  node: NodeHandleSelection;
  graph: Graph;
  turingMachine: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph;
    this.turingMachine = turingMachine;
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.previousX = e.x;
    this.previousY = e.y;

    if (Node.isNode(d3.select(e.target as any))) {
      this.node = Node.getHandle(d3.select(e.target as any));
      this.node.classed("move", true);
      this.node.raise();
    } else {
      this.node = undefined;
    }
  };
  pointerMove(e: ModifiedPointerEvent) {
    if (this.node !== undefined) {
      Node.translate(this.node, e.x - this.previousX, e.y - this.previousY);
      this.turingMachine
        .stateMachine.getState(this.node.datum().stateID)
        .getInTransitions()
        .forEach((t) => Edge.move(Edge.getHandleByTransitionId(t.id),
          Node.getHandleByStateId(t.fromState.id),
          Node.getHandleByStateId(t.toState.id)));
      this.turingMachine
        .stateMachine.getState(this.node.datum().stateID)
        .getOutTransitions()
        .forEach((t) => Edge.move(Edge.getHandleByTransitionId(t.id),
          Node.getHandleByStateId(t.fromState.id),
          Node.getHandleByStateId(t.toState.id)));
    }

    this.previousX = e.x;
    this.previousY = e.y;
  };
  pointerUp(e: ModifiedPointerEvent) {
    if (this.node !== undefined) {
      this.node.classed("move", false);
      this.node = undefined;
    }
  };
  pointerLeave(e: ModifiedPointerEvent) {
  };
}