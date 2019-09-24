import * as d3 from "d3-selection";
import { EventManager } from "./EventManager";

export class ToolBar {
  moveButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  nodeButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  edgeButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  deleteButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor(eventManager: EventManager) {
    this.setupUI();
  }

  setupUI(){
    this.moveButton = this.addButton("moveButton", "url(./icons/moveButton.png)");
    this.nodeButton = this.addButton("nodeButton", "url(./icons/nodeButton.png)");
    this.edgeButton = this.addButton("edgeButton", "url(./icons/edgeButton.png)");
    this.deleteButton = this.addButton("deleteButton", "url(./icons/deleteButton.png)");

    this.nodeButton.classed("selected", true);
  }

  addButton(id: string, image: string){
    return d3.select("#toolBar").append("div").attr("id", id).style("background-image", image);
  }

}
