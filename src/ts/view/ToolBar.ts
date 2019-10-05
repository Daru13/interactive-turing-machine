import * as d3 from "d3-selection";
import { ToolManager, toolName } from "./tools/ToolManager";

export class ToolBar {
  moveButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  nodeButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  edgeButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  deleteButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  editButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  toolManager: ToolManager;

  constructor(toolManager: ToolManager) {
    this.toolManager = toolManager;
    this.setupUI();
  }

  setupUI(){
    this.moveButton = this.addButton(toolName.MOVE, "url(./icons/moveButton.png)");
    this.nodeButton = this.addButton(toolName.CREATE_NODE, "url(./icons/nodeButton.png)");
    this.edgeButton = this.addButton(toolName.CREATE_EDGE, "url(./icons/edgeButton.png)");
    this.deleteButton = this.addButton(toolName.DELETE, "url(./icons/deleteButton.png)");
    this.editButton = this.addButton(toolName.EDIT, "url(./icons/editButton.png)");

    this.setInteraction()
    this.selectTool(toolName.CREATE_NODE)
  }

  setInteraction(){
    let t = this;
    this.moveButton.on("click", function () { t.selectTool(toolName.MOVE)});
    this.nodeButton.on("click", function () { t.selectTool(toolName.CREATE_NODE)});
    this.edgeButton.on("click", function () { t.selectTool(toolName.CREATE_EDGE)});
    this.deleteButton.on("click", function () { t.selectTool(toolName.DELETE)});
    this.editButton.on("click", function () { t.selectTool(toolName.EDIT)});
  }

  addButton(id: toolName, image: string){
    return d3.select("#toolBar")
      .append("div").attr("id", id).style("background-image", image);
  }

  selectTool(id: toolName){
    d3.select("#toolBar").selectAll("div").classed("selected", false);
    d3.select("#"+id).classed("selected", true);
    this.toolManager.selectTool(id);
  }
}
