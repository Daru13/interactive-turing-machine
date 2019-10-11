import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { CreateEdgeAction } from "../../actions/CreateEdgeAction";
import { Graph } from "../../graph/Graph";
import { Node } from "../../graph/Node"; 
import * as d3 from "d3-selection";
import { TuringMachine } from "../../../model/TuringMachine";
import { NodeHandleSelection } from "../../graph/Node";
import { Helpers } from "../../../helpers";

export class EdgeTool {
  previousX: number;
  previousY: number;
  graph: Graph;
  node: NodeHandleSelection;
  isDown: boolean;
  tM: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine) {
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph
    this.isDown = false;
    this.tM = turingMachine;
  }

  pointerDown(e: ModifiedPointerEvent) {
    this.previousX = e.x;
    this.previousY = e.y;
    this.node = undefined;

    if (Node.isNode(d3.select(e.target as any))) {
      this.node = Node.getHandle(d3.select(e.target as any))
      this.isDown = true;
      this.graph.getSVG()
        .append("path")
        .attr("d", "M" + this.node.datum()["x"] + "," + this.node.datum()["y"] + " L" + this.previousX + "," + this.previousY)
        .classed("edgeInCreation", true)
    } else {
      this.node = undefined
      return;
    }
  };
  pointerMove(e: ModifiedPointerEvent) {
    if (this.isDown) {
      this.graph.getSVG()
        .select(".edgeInCreation")
        .attr("d", "M" + this.node.datum()["x"] + "," + this.node.datum()["y"] + " L" + this.previousX + "," + this.previousY)

      d3.selectAll(".node.closestNode").classed("closestNode", false);
      let closestNode = this.closestNode({ x: this.node.datum().x, y: this.node.datum().y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);
      if (closestNode !== undefined) {
        closestNode.classed("closestNode", true);
      }

      this.previousX = e.x;
      this.previousY = e.y;
    }
  };
  pointerUp(e: ModifiedPointerEvent) {
    if (this.isDown) {
      this.isDown = false;

      this.graph.getSVG().selectAll(".edgeInCreation").remove()

      d3.selectAll(".node.closestNode").classed("closestNode", false);
      let closestNode = this.closestNode({ x: this.node.datum().x, y: this.node.datum().y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

      if (closestNode !== undefined) {
       CreateEdgeAction.do(this.node, closestNode, this.tM);
      }
    }
  };
  pointerLeave(e: ModifiedPointerEvent) {
    if (this.isDown) {
      this.isDown = false;

      this.graph.getSVG().selectAll(".edgeInCreation").remove()

      d3.selectAll(".node.closestNode").classed("closestNode", false);
      console.log(this.tM.stateMachine.toString());
    }
  }

  closestNode(beginEdge: { x, y }, endEdge: { x, y }, minLength: number, distFromEnd: number): NodeHandleSelection {
    let closestNode: NodeHandleSelection;
    let minDistance = distFromEnd; 
    let t = this;
    d3.selectAll(".node").each(function () {
      let point2 = { x: d3.select(this).datum()["x"], y: d3.select(this).datum()["y"] };
      if (Helpers.distance2(endEdge, point2) < minDistance) {
        minDistance = Helpers.distance2(endEdge, point2)
        closestNode = d3.select(this) as NodeHandleSelection;
      }
    })
    if (Helpers.distance2(beginEdge, endEdge) < minLength){
      return undefined;
    }
    return closestNode;
  }
}