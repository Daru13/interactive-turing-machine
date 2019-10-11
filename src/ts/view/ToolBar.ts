import * as d3 from "d3-selection";
import { MouseDispatcher, toolName } from "./graphInteraction/tools/MouseDispatcher";

export class ToolBar {
    nodeToolButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    edgeToolButton: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    toolManager: MouseDispatcher;

    constructor(toolManager: MouseDispatcher) {
        this.toolManager = toolManager;
        this.setupUI();
    }

    setupUI(){
        this.nodeToolButton = this.addButton(toolName.NODE_TOOL, "url(./icons/nodeButton.png)");
        this.edgeToolButton = this.addButton(toolName.EDGE_TOOL, "url(./icons/edgeButton.png)");

        this.setInteraction()
        this.selectTool(toolName.NODE_TOOL)
    }

    setInteraction(){
        let t = this;
        this.nodeToolButton.on("click", function () { t.selectTool(toolName.NODE_TOOL)});
        this.edgeToolButton.on("click", function () { t.selectTool(toolName.EDGE_TOOL)});
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
