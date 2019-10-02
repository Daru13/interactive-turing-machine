import { CreateNodeTool } from "./tools/CreateNodeTool";
import { CreateEdgeTool } from "./tools/CreateEdgeTool";
import { DeleteTool } from "./tools/DeleteTool";
import { EditTool } from "./tools/EditTool";
import { transformEvent } from "../helpers";
import { MoveTool } from "./tools/MoveTool";


export const tools = {
    MOVE: "move",
    CREATE_NODE: "create_node",
    CREATE_EDGE: "create_edge",
    DELETE: 'delete',
    EDIT: "edit"
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
    this.toolToInteraction[tools.DELETE] = new DeleteTool(graph);
    this.toolToInteraction[tools.EDIT] = new EditTool(graph);
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
  }

  getTool(){
    return this.selectTool
  }

  dispatchDownEvent(e:any){
    this.updateXYSVG(e);
    this.toolToInteraction[this.selectedTool].pointerDown(e);
  }

  dispatchMoveEvent(e:any){
    this.updateXYSVG(e);
    this.toolToInteraction[this.selectedTool].pointerMove(e);
  }

  dispatchUpEvent(e:any){
    this.updateXYSVG(e);
    this.toolToInteraction[this.selectedTool].pointerUp(e);
  }

  updateXYSVG(e:any){
    var pt = this.graph.getSVGElement().createSVGPoint(), svgP

    pt.x = e.x;
    pt.y = e.y;
    svgP = pt.matrixTransform(this.graph.getSVGElement().getScreenCTM().inverse());
    e.x = svgP.x
    e.y = svgP.y
  }
}
