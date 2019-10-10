import { CreateNodeAction } from "../../actions/CreateNodeAction";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { Helpers } from "../../../helpers";
import { MoveNodeAction } from "../../actions/MoveNodeAction";
import { TuringMachine } from "../../../model/TuringMachine";
import { Graph } from "../../graph/Graph";
import * as d3 from "d3-selection";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { ToolBar } from "../../ToolBar";
import { EdgeTool } from "./EdgeTool";
import { NodeTool } from "./NodeTool";
import { Edge, EdgeElementSelection } from "../../graph/Edge";
import { Node, NodeElementSelection } from "../../graph/Node";
import { EditEdgeAction } from "../../actions/EditEdgeAction";
import { GraphInteraction } from "../GraphInteraction";


export enum toolName {
    NODE_TOOL = "nodeTool",
    EDGE_TOOL = "edgeTool"
}

type Tool = NodeTool | EdgeTool;

export class ToolManager extends GraphInteraction{
  selectedTool: toolName;
  readonly toolToInteraction: Record<toolName, Tool>;
  toolBar: ToolBar;

  constructor(graph: Graph, turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.toolToInteraction = {} as Record<toolName, Tool>;
    this.toolBar = new ToolBar(this);
    this.setTool(graph, turingMachine);
  }

  setTool(graph: Graph, turingMachine: TuringMachine): void{
    this.toolToInteraction[toolName.NODE_TOOL] = new NodeTool(graph, turingMachine);
    this.toolToInteraction[toolName.EDGE_TOOL] = new EdgeTool(graph, turingMachine);
  }

  selectTool(tool: toolName): void{
    this.selectedTool = tool;
  }

  getTool(): toolName{
    return this.selectedTool;
  }

  dispatchDownEvent(e: ModifiedPointerEvent){
    super.dispatchDownEvent(e);
    this.toolToInteraction[this.selectedTool].pointerDown(e);
  }

  dispatchMoveEvent(e: ModifiedPointerEvent){
    super.dispatchMoveEvent(e);    
    this.toolToInteraction[this.selectedTool].pointerMove(e);
  }

  dispatchUpEvent(e: ModifiedPointerEvent){
    super.dispatchUpEvent(e);
    this.toolToInteraction[this.selectedTool].pointerUp(e);
  }

  dispatchLeaveEvent(e: ModifiedPointerEvent) {
    super.dispatchLeaveEvent(e);
    this.toolToInteraction[this.selectedTool].pointerLeave(e);
  }

  dispatchClickEvent(e: ModifiedPointerEvent){
    super.dispatchClickEvent(e);
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
