import { CreateNodeAction } from "../actions/CreateNodeAction";
import { EditNodeAction } from "../actions/EditNodeAction";
import { Helpers } from "../../helpers";
import { MoveAction } from "../actions/MoveAction";
import { TuringMachine } from "../../model/TuringMachine";
import { Graph } from "../graph/Graph";
import * as d3 from "d3-selection";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { ToolBar } from "../ToolBar";
import { EdgeTool } from "./EdgeTool";
import { NodeTool } from "./NodeTool";
import { TuringMachineButton } from "../TuringMachineButton";
import { Edge, EdgeElementSelection } from "../graph/Edge";
import { Node, NodeElementSelection } from "../graph/Node";
import { EditEdgeAction } from "../actions/EditEdgeAction";


export enum toolName {
    NODE_TOOL = "nodeTool",
    EDGE_TOOL = "edgeTool"
}

type Tool = NodeTool | EdgeTool;

export class ToolManager{
  selectedTool: toolName;
  readonly toolToInteraction: Record<toolName, Tool>;
  readonly graph: Graph;
  readonly tM: TuringMachine;
  toolBar: ToolBar;
  isActivated: boolean;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.toolToInteraction = {} as Record<toolName, Tool>;
    this.graph = graph;
    this.tM = turingMachine;
    this.toolBar = new ToolBar(this);
    this.isActivated = false;
    this.setTool(graph, turingMachine);
    this.setInteraction();
  }

  setTool(graph: Graph, turingMachine: TuringMachine): void{
    this.toolToInteraction[toolName.NODE_TOOL] = new NodeTool(graph, turingMachine);
    this.toolToInteraction[toolName.EDGE_TOOL] = new EdgeTool(graph, turingMachine);
  }

  setInteraction(){
    var t = this;
    let ptDown = {x: 0, y:0};
    let distPDown = 0;
    t.graph.getSVGElement().addEventListener("pointerdown",
      function(e){
        if(t.isActivated){
          ptDown.x = e.x;
          ptDown.y = e.y;
          distPDown = 0;
          t.dispatchDownEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointermove",
      function(e){
        if (t.isActivated) {
          distPDown = Helpers.distance2(ptDown, {x: e.x, y: e.y});
          t.dispatchMoveEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointerup",
      function(e){
        if (t.isActivated) {
          t.dispatchUpEvent(Helpers.transformEvent(e));
          if(distPDown < Graph.sizeNode/2){
            t.dispatchClickEvent(Helpers.transformEvent(e));
          }
        }
      });
    t.graph.getSVGElement().addEventListener("pointerleave",
      function (e) {
        if (t.isActivated) {
          t.dispatchLeaveEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointercancel",
      function (e) {
        if (t.isActivated) {
          console.log("cancel");
        }
      });
  }

  selectTool(tool: toolName): void{
    this.selectedTool = tool;
  }

  getTool(): toolName{
    return this.selectedTool;
  }

  dispatchDownEvent(e: ModifiedPointerEvent){
    Helpers.updateXYSVG(e, this.graph);
    this.toolToInteraction[this.selectedTool].pointerDown(e);
  }

  dispatchMoveEvent(e: ModifiedPointerEvent){
    Helpers.updateXYSVG(e, this.graph);
    this.toolToInteraction[this.selectedTool].pointerMove(e);
  }

  dispatchUpEvent(e: ModifiedPointerEvent){
    Helpers.updateXYSVG(e, this.graph);
    this.toolToInteraction[this.selectedTool].pointerUp(e);
  }

  dispatchLeaveEvent(e: ModifiedPointerEvent) {
    Helpers.updateXYSVG(e, this.graph);
    this.toolToInteraction[this.selectedTool].pointerLeave(e);
  }

  dispatchClickEvent(e: ModifiedPointerEvent){
    Helpers.updateXYSVG(e, this.graph);
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

  activate(){
    this.isActivated = true;
  }

  deactivate(){
    this.isActivated = false;
  }
}
