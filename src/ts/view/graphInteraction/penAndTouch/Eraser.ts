import { Graph } from "../../graph/Graph";
import { Edge, EdgeHandleSelection } from "../../graph/Edge";
import { Node, NodeHandleSelection } from "../../graph/Node";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import * as d3 from "d3-selection";
import { DeleteEdgeAction } from "../../actions/DeleteEdgeAction";
import { DeleteNodeAction } from "../../actions/DeleteNodeAction";

export class Eraser{
  tM: TuringMachine;
  target: d3.BaseType;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.tM = turingMachine;
  }

  pointerDown(e: ModifiedPointerEvent) { 
    this.target = e.target as d3.BaseType;
  };
  pointerMove(e: ModifiedPointerEvent) { 
  };
  pointerUp(e: ModifiedPointerEvent) { 
    if (Node.isNode(d3.select(this.target))) {
      DeleteNodeAction.do(d3.select(this.target) as NodeHandleSelection, this.tM)
    } else if (Edge.isAnEdge(d3.select(this.target))) {
      DeleteEdgeAction.do(d3.select(this.target) as EdgeHandleSelection, this.tM);
    }
  };
  pointerLeave(e: ModifiedPointerEvent) { 
  };
  click(e: ModifiedPointerEvent) { }
}
