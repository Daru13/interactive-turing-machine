import * as d3 from "d3-selection";
import { MouseDispatcher, toolName } from "./graphInteraction/tools/MouseDispatcher";

export class ToolBar {
    nodeToolButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
    edgeToolButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
    toolManager: MouseDispatcher;

    constructor(toolManager: MouseDispatcher) {
        this.toolManager = toolManager;
        this.setupUI();
    }

    setupUI(){
        this.nodeToolButton = this.addButton("nodeButton");
        this.edgeToolButton = this.addButton("edgeButton");

        this.setInteraction();
        this.selectTool(toolName.NODE_TOOL, this.nodeToolButton);
    }

    setInteraction(){
        let t = this;
        this.nodeToolButton.on("click", function () { t.selectTool(toolName.NODE_TOOL,t.nodeToolButton)});
        this.edgeToolButton.on("click", function () { t.selectTool(toolName.EDGE_TOOL, t.edgeToolButton)});
    }

    addButton(id: string){
        return d3.select("#toolBar")
            .append("button").attr("id", id);
    }

    selectTool(id: toolName, buttonToSelect: d3.Selection<HTMLButtonElement, any, any, any>){
        d3.select("#toolBar").selectAll("button").classed("selected", false);
        buttonToSelect.classed("selected", true);
        this.toolManager.selectTool(id);
    }
}
