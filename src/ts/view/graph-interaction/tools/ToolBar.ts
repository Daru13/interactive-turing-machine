import * as d3 from "d3-selection";
import { MouseDispatcher, toolName } from "./MouseDispatcher";

/** A class to display a tool bar in the application */
export class ToolBar {
    /** button to select the node tool */
    nodeToolButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
    /** button to select the edge tool */
    edgeToolButton: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
    /** MouseDispatcher we want to change the current tool */
    toolManager: MouseDispatcher;

    constructor(toolManager: MouseDispatcher) {
        this.toolManager = toolManager;
        d3.select("#toolbar").selectAll("*").remove();
        this.setupUI();
    }

    /**
     * Setups the ui by setting the buttons
     */
    setupUI(): void {
        this.nodeToolButton = this.addButton("node-button", "State tool");
        this.edgeToolButton = this.addButton("edge-button", "Transition tool");

        this.setInteraction();
        this.selectTool(toolName.NODE_TOOL, this.nodeToolButton);
    }

    /**
     * Sets interaction for when you click on a button
     */
    setInteraction(): void {
        this.nodeToolButton.on("click", () =>  { 
            this.selectTool(toolName.NODE_TOOL, this.nodeToolButton); 
        });
        this.edgeToolButton.on("click", () => { 
            this.selectTool(toolName.EDGE_TOOL, this.edgeToolButton);
        });
    }

    /**
     * Adds a button to the tool bar
     * @param id id of the button
     * @param description title of the button
     * @returns the d3 selection of the added button 
     */
    addButton(id: string, description: string): d3.Selection<HTMLButtonElement, any, any, any> {
        return d3.select("#toolbar")
            .append("button")
                .attr("id", id)
                .attr("title", description);
    }

    /**
     * Set the current tool of the associated mouse dispatcher
     * @param tool name of the tool to select
     * @param buttonToSelect button clicked
     */
    selectTool(tool: toolName, buttonToSelect: d3.Selection<HTMLButtonElement, any, any, any>): void {
        d3.select("#toolbar").selectAll("button").classed("selected", false);
        buttonToSelect.classed("selected", true);
        this.toolManager.selectTool(tool);
    }

    /**
     * Displays the tool bar
     */
    display(): void {
        d3.select("#toolbar").classed("hidden", false);
    }

    /**
     * Hides the tool bar
     */
    hide(): void {
        d3.select("#toolbar").classed("hidden", true);
    }
}
