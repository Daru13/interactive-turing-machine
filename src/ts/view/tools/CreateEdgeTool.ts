import { Helpers } from "../../helpers";
import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Node, NodeHandleSelection } from "../graph/Node";
import {  TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";
import { HeadAction } from "../../model/Tape";
import { Tool } from "./Tool";
import { StateMachine } from "../../model/StateMachine";

export class CreateEdgeTool extends Tool{
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
      this.node.classed("selected", true)
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

      this.previousX = e.x;
      this.previousY = e.y;
    }
  }

  pointerUp(e: any){
    if(this.isDown){
      this.isDown = false;

      this.node.classed("selected", false);

      this.graph.getSVG().select(".edgeInCreation").remove()

      let closestNode: NodeHandleSelection;
      let closestDistance = Infinity;
      let t = this;
      d3.selectAll(".node:not(.selected)").each(function(){
        if(Helpers.distance2({x: t.previousX, y: t.previousY},
                     {x: parseFloat(d3.select(this).datum()["x"]), y: parseFloat(d3.select(this).datum()["y"])}) < closestDistance){
          closestDistance = Helpers.distance2({x: t.previousX, y: t.previousY},
                       {x: parseFloat(d3.select(this).datum()["x"]), y: parseFloat(d3.select(this).datum()["y"])})
          closestNode = d3.select(this) as NodeHandleSelection;
        }
      })
      d3.selectAll(".node.selected").classed("selected", false);
      this.stateMachine
        .addTransition(new Transition(
          this.stateMachine.getState(this.node.datum().stateID),
          this.stateMachine.getState(closestNode.datum().stateID), 
          "unknown", 
          "unknown", 
          HeadAction.None));
    }
  }
}
