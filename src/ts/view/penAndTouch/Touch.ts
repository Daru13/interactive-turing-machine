import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { MoveTool } from "../tools/MoveTool";
import { CreateNodeTool } from "../tools/CreateNodeTool";
import { EditTool } from "../tools/EditTool";
import { Node } from "../graph/Node";
import * as d3 from "d3-selection";
import { Edge } from "../graph/Edge";
import { Tool } from "../tools/Tool";
import { Helpers } from "../../helpers";

export class Touch{
  tool: Tool;
  pDownEvent: ModifiedPointerEvent;
  pMoveEvent: ModifiedPointerEvent;
  distance: number;
  turingMachine: TuringMachine;
  graph: Graph;
  isTargetANode: boolean;

  constructor(graph: Graph, turingMachine: TuringMachine, e: ModifiedPointerEvent){
    this.graph = graph;
    this.turingMachine = turingMachine;
    this.isTargetANode = false;
    this.distance = 0;

    let target = e.target as d3.BaseType;
    if(d3.select(target).property("tagName") === "svg") {
      this.tool = new CreateNodeTool(graph, turingMachine);;
    } else if (Node.isNode(d3.select(target))) {
      this.isTargetANode = true;
      this.tool = new MoveTool(graph, turingMachine);
    } else if (Edge.isAnEdge(d3.select(target))) {
      this.tool = new EditTool(graph, turingMachine);
    }
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
    if (this.distance < 10 && this.isTargetANode){
      this.tool.pointerUp(e);
      this.tool = new EditTool(this.graph, this.turingMachine)
      this.tool.pointerDown(this.pDownEvent)
      this.tool.pointerMove(this.pMoveEvent)
    }
    this.tool.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) {
    this.tool.pointerLeave(e);
  };
}