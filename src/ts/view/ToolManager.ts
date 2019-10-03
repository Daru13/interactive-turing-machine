import { CreateNodeTool } from "./tools/CreateNodeTool";
import { CreateEdgeTool } from "./tools/CreateEdgeTool";
import { DeleteTool } from "./tools/DeleteTool";
import { EditTool } from "./tools/EditTool";
import { Helpers } from "../helpers";
import { MoveTool } from "./tools/MoveTool";
import { TuringMachine } from "../model/TuringMachine";
import { Graph } from "./graph/Graph";
import { Tool } from "./tools/Tool";
import { ModifiedPointerEvent } from "../events/ModifiedPointerEvent";


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

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.toolToInteraction = {} as Record<toolName, Tool>;
    this.graph = graph;
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
        t.dispatchDownEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointermove",
      function(e){
        t.dispatchMoveEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointerup",
      function(e){
        t.dispatchUpEvent(Helpers.transformEvent(e))
      });
    t.graph.getSVGElement().addEventListener("pointercancel",
      (e: PointerEvent) => console.log("cancel"));
  }

  selectTool(tool: toolName): void{
    this.selectedTool = tool;
  }

  getTool(): toolName{
    return this.selectedTool;
  }

  dispatchDownEvent(e: ModifiedPointerEvent){
    this.updateXYSVG(e);
    this.toolToInteraction[this.selectedTool].pointerDown(e);
  }

  dispatchMoveEvent(e: ModifiedPointerEvent){
    this.updateXYSVG(e);
    this.toolToInteraction[this.selectedTool].pointerMove(e);
  }

  dispatchUpEvent(e: ModifiedPointerEvent){
    this.updateXYSVG(e);
    this.toolToInteraction[this.selectedTool].pointerUp(e);
  }

  updateXYSVG(e: ModifiedPointerEvent){
    var pt = this.graph.getSVGElement().createSVGPoint(), svgP;

    pt.x = e.x;
    pt.y = e.y;
    svgP = pt.matrixTransform(this.graph.getSVGElement().getScreenCTM().inverse());
    e.x = svgP.x;
    e.y = svgP.y;
  }
}
