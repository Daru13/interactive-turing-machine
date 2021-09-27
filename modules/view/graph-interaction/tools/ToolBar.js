"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const MouseDispatcher_1 = require("./MouseDispatcher");
class ToolBar {
    constructor(toolManager) {
        this.toolManager = toolManager;
        d3.select("#toolbar").selectAll("*").remove();
        this.setupUI();
    }
    setupUI() {
        this.nodeToolButton = this.addButton("node-button", "State tool");
        this.edgeToolButton = this.addButton("edge-button", "Transition tool");
        this.setInteraction();
        this.selectTool(MouseDispatcher_1.toolName.NODE_TOOL, this.nodeToolButton);
    }
    setInteraction() {
        this.nodeToolButton.on("click", () => {
            this.selectTool(MouseDispatcher_1.toolName.NODE_TOOL, this.nodeToolButton);
        });
        this.edgeToolButton.on("click", () => {
            this.selectTool(MouseDispatcher_1.toolName.EDGE_TOOL, this.edgeToolButton);
        });
    }
    addButton(id, description) {
        return d3.select("#toolbar")
            .append("button")
            .attr("id", id)
            .attr("title", description);
    }
    selectTool(tool, buttonToSelect) {
        d3.select("#toolbar").selectAll("button").classed("selected", false);
        buttonToSelect.classed("selected", true);
        this.toolManager.selectTool(tool);
    }
    display() {
        d3.select("#toolbar").classed("hidden", false);
    }
    hide() {
        d3.select("#toolbar").classed("hidden", true);
    }
}
exports.ToolBar = ToolBar;
//# sourceMappingURL=ToolBar.js.map