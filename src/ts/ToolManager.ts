import { MoveTool } from "./tools/MoveTool";
import { CreateNodeTool } from "./tools/CreateNodeTool";
import { transformEvent } from "./helpers";
import { CreateEdgeTool } from "./tools/CreateEdgeTool";

export const tools = {
    MOVE: "move",
    CREATE_NODE: "create_node",
    CREATE_EDGE: "create_edge",
    DELETE: 'delete'
}

export class ToolManager{
  selectedTool: any;
  toolToInteraction: Object;
  graph: any;

  constructor(graph){
    this.toolToInteraction = {};
    this.toolToInteraction[tools.MOVE] = new MoveTool(graph);
    this.toolToInteraction[tools.CREATE_NODE] = new CreateNodeTool(graph);
    this.toolToInteraction[tools.CREATE_EDGE] = new CreateEdgeTool(graph);
    this.graph = graph;
    this.setInteraction()
  }

  setInteraction(){
    var t = this
    t.graph.getSVGElement().addEventListener("pointerdown",
      function(e){t.dispatchDownEvent(transformEvent(e))})
    t.graph.getSVGElement().addEventListener("pointermove",
      function(e){t.dispatchMoveEvent(transformEvent(e))})
    t.graph.getSVGElement().addEventListener("pointerup",
      function(e){t.dispatchUpEvent(transformEvent(e))})
    t.graph.getSVGElement().addEventListener("pointercancel",
      (e: PointerEvent) => console.log("cancel"))
  }

  selectTool(tool) {
    this.selectedTool = tool;
    console.log(this.selectedTool);
  }

  getTool(){
    return this.selectTool
  }

  dispatchDownEvent(e:any){
    this.toolToInteraction[this.selectedTool].pointerDown(e);
  }

  dispatchMoveEvent(e:any){
    this.toolToInteraction[this.selectedTool].pointerMove(e);
  }

  dispatchUpEvent(e:any){
    this.toolToInteraction[this.selectedTool].pointerUp(e);
  }
}
