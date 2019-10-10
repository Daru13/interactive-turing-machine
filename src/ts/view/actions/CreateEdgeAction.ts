import { Helpers } from "../../helpers";
import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Node, NodeHandleSelection } from "../graph/Node";
import {  TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";
import { HeadAction } from "../../model/Tape";
import { Action } from "./Action";
import { StateMachine } from "../../model/StateMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";

export class CreateEdgeAction extends Action{
  previousX: number;
  previousY: number;
  graph: Graph;
  node: NodeHandleSelection;
  isDown: boolean;
  stateMachine: StateMachine;

  constructor(graph: Graph,  turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph
    this.isDown = false;
    this.stateMachine = turingMachine.stateMachine;
  }

  pointerDown(e: any){
    this.previousX = e.x;
    this.previousY = e.y;
    this.node = undefined;

    if(Node.isNode(d3.select(e.target as any))){
      this.node = Node.getHandle(d3.select(e.target as any))
      this.isDown = true;
      this.graph.getSVG()
        .append("path")
          .attr("d", "M"+this.node.datum()["x"]+","+this.node.datum()["y"]+" L"+this.previousX+","+this.previousY)
          .classed("edgeInCreation", true)
    }else{
      this.node = undefined
      return;
    }
  }

  pointerMove(e: any){
    if(this.isDown){
      this.graph.getSVG()
        .select(".edgeInCreation")
          .attr("d", "M"+this.node.datum()["x"]+","+this.node.datum()["y"]+" L"+this.previousX+","+this.previousY)
      
      d3.selectAll(".node.closestNode").classed("closestNode", false);
      let closestNode = this.closestNode({ x: this.previousX, y: this.previousY }, Graph.sizeNode * 3);
      if (closestNode !== undefined) {
        closestNode.classed("closestNode", true);
      }

      this.previousX = e.x;
      this.previousY = e.y;
    }
  }

  pointerUp(e: any){
    if(this.isDown){
      this.isDown = false;

      this.graph.getSVG().selectAll(".edgeInCreation").remove()

      d3.selectAll(".node.closestNode").classed("closestNode", false);
      let closestNode = this.closestNode({x: this.previousX, y: this.previousY}, Graph.sizeNode * 3);

      if (closestNode !== undefined){
        this.stateMachine
          .addTransition(new Transition(
            this.stateMachine.getState(this.node.datum().stateID),
            this.stateMachine.getState(closestNode.datum().stateID), 
            "unknown", 
            "unknown", 
            HeadAction.None));
        console.log(this.stateMachine.toString());
      }
    }
  }

  pointerLeave(e: ModifiedPointerEvent){
    if (this.isDown) {
      this.isDown = false;

      this.graph.getSVG().selectAll(".edgeInCreation").remove()

      d3.selectAll(".node.closestNode").classed("closestNode", false);
      console.log(this.stateMachine.toString());
    }
  }

  closestNode(point: {x, y}, closestDistance: number): NodeHandleSelection{
    let closestNode: NodeHandleSelection;
    let t = this;
    d3.selectAll(".node").each(function () {
      let point2 = { x: d3.select(this).datum()["x"], y: d3.select(this).datum()["y"] };
      if (Helpers.distance2(point, point2) < closestDistance) {
        closestDistance = Helpers.distance2(point, point2)
        closestNode = d3.select(this) as NodeHandleSelection;
      }
    })
    if(closestDistance < Graph.sizeNode){
      return undefined;
    }
    return closestNode;
  }
}
