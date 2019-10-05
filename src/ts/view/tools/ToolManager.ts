import { CreateNodeTool } from "./CreateNodeTool";
import { CreateEdgeTool } from "./CreateEdgeTool";
import { DeleteTool } from "./DeleteTool";
import { EditTool } from "./EditTool";
import { Helpers } from "../../helpers";
import { MoveTool } from "./MoveTool";
import { TuringMachine } from "../../model/TuringMachine";
import { Graph } from "../graph/Graph";
import { Tool } from "./Tool";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { ToolBar } from "../ToolBar";


export enum toolName {
    MOVE = "move",
    CREATE_NODE = "create_node",
    CREATE_EDGE = "create_edge",
    DELETE = 'delete',
    EDIT = "edit"
}

export class ToolManager{
  selectedTool: toolName;
  readonly toolToInteraction: Record<toolName, Tool>;
  readonly graph: Graph;
  toolBar: ToolBar;
  isActivated: boolean;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.toolToInteraction = {} as Record<toolName, Tool>;
    this.graph = graph;
    this.toolBar = new ToolBar(this);
    this.isActivated = false;
    this.setTool(graph, turingMachine);
    this.setInteraction();
  }

  setTool(graph: Graph, turingMachine: TuringMachine): void{
    this.toolToInteraction[toolName.MOVE] = new MoveTool(graph, turingMachine);
    this.toolToInteraction[toolName.CREATE_NODE] = new CreateNodeTool(graph, turingMachine);
    this.toolToInteraction[toolName.CREATE_EDGE] = new CreateEdgeTool(graph, turingMachine);
    this.toolToInteraction[toolName.DELETE] = new DeleteTool(graph, turingMachine);
    this.toolToInteraction[toolName.EDIT] = new EditTool(graph, turingMachine);
  }

  setInteraction(){
    var t = this;
    t.graph.getSVGElement().addEventListener("pointerdown",
      function(e){
        if(t.isActivated){
          t.dispatchDownEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointermove",
      function(e){
        if (t.isActivated) {
          t.dispatchMoveEvent(Helpers.transformEvent(e));
        }
      });
    t.graph.getSVGElement().addEventListener("pointerup",
      function(e){
        if (t.isActivated) {
          t.dispatchUpEvent(Helpers.transformEvent(e));
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

  activate(){
    this.isActivated = true;
  }

  deactivate(){
    this.isActivated = false;
  }
}
