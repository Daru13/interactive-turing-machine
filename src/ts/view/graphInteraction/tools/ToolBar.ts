import * as d3 from "d3-selection";
import { MouseDispatcher, toolName } from "./MouseDispatcher";

export class ToolBar {
    nodeToolButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
    edgeToolButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
    toolManager: MouseDispatcher;

    constructor(toolManager: MouseDispatcher) {
        this.toolManager = toolManager;
        d3.select("#toolbar").selectAll("*").remove();
        this.setupUI();
    }

    setupUI(): void {
        this.nodeToolButton = this.addButton("nodeButton", "State tool");
        this.edgeToolButton = this.addButton("edgeButton", "Transition tool");

        this.setInteraction();
        this.selectTool(toolName.NODE_TOOL, this.nodeToolButton);
    }

    setInteraction(): void {
        this.nodeToolButton.on("click", () =>  { 
            this.selectTool(toolName.NODE_TOOL, this.nodeToolButton); 
        });
        this.edgeToolButton.on("click", () => { 
            this.selectTool(toolName.EDGE_TOOL, this.edgeToolButton);
        });
    }
    
    addButton(id: string, description: string): d3.Selection<HTMLButtonElement, any, any, any> {
        return d3.select("#toolbar")
            .append("button")
                .attr("id", id)
                .attr("title", description);
    }

    selectTool(id: toolName, buttonToSelect: d3.Selection<HTMLButtonElement, any, any, any>): void {
        d3.select("#toolbar").selectAll("button").classed("selected", false);
        buttonToSelect.classed("selected", true);
        this.toolManager.selectTool(id);
    }

    display(): void {
        d3.select("#toolbar").classed("hidden", false);
    }

    hide(): void {
        d3.select("#toolbar").classed("hidden", true);
    }
}
