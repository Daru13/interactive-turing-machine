import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import * as d3 from "d3-selection";
import { Node, NodeElementSelection } from "../../graph/Node";
import { Edge, EdgeElementSelection } from "../../graph/Edge";
import { NodeTool } from "../tools/NodeTool";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { CreateNodeAction } from "../../actions/CreateNodeAction";
import { EditEdgeAction } from "../../actions/EditEdgeAction";

export class Touch{
  nodeTool : NodeTool
  tM: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.tM = turingMachine;
    this.nodeTool = new NodeTool(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.nodeTool.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) {
    this.nodeTool.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) {
    this.nodeTool.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.nodeTool.pointerLeave(e);
  };

  click(e: ModifiedPointerEvent){
    let target = e.target as d3.BaseType;
    let targetSelection = d3.select(target);
    if (d3.select(target).property("tagName") == "svg") {
      CreateNodeAction.do(e.x, e.y, this.tM);
    } else if (Node.isNode(targetSelection)) {
      EditNodeAction.do(Node.getHandle(targetSelection as NodeElementSelection), this.tM);
    } else if (Edge.isAnEdge(targetSelection)) {
      EditEdgeAction.do(Edge.getHandle(targetSelection as EdgeElementSelection), this.tM);
    }
  }
}