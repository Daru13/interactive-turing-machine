"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToolBar_1 = require("./ToolBar");
const EdgeTool_1 = require("./EdgeTool");
const NodeTool_1 = require("./NodeTool");
const GraphEventDispatcher_1 = require("../GraphEventDispatcher");
var toolName;
(function (toolName) {
    toolName["NODE_TOOL"] = "nodeTool";
    toolName["EDGE_TOOL"] = "edgeTool";
})(toolName = exports.toolName || (exports.toolName = {}));
class MouseDispatcher extends GraphEventDispatcher_1.GraphEventDispatcher {
    constructor(graph, turingMachine) {
        super(graph, turingMachine);
        this.toolToInteraction = {};
        this.toolBar = new ToolBar_1.ToolBar(this);
        this.setTool(graph, turingMachine);
    }
    setTool(graph, turingMachine) {
        this.toolToInteraction[toolName.NODE_TOOL] = new NodeTool_1.NodeTool(graph, turingMachine);
        this.toolToInteraction[toolName.EDGE_TOOL] = new EdgeTool_1.EdgeTool(graph, turingMachine);
    }
    selectTool(tool) {
        this.selectedTool = tool;
    }
    getTool() {
        return this.selectedTool;
    }
    dispatchDownEvent(e) {
        super.dispatchDownEvent(e);
        this.toolToInteraction[this.selectedTool].pointerDown(e);
    }
    dispatchMoveEvent(e) {
        super.dispatchMoveEvent(e);
        this.toolToInteraction[this.selectedTool].pointerMove(e);
    }
    dispatchUpEvent(e) {
        super.dispatchUpEvent(e);
        this.toolToInteraction[this.selectedTool].pointerUp(e);
    }
    dispatchLeaveEvent(e) {
        super.dispatchLeaveEvent(e);
        this.toolToInteraction[this.selectedTool].pointerLeave(e);
    }
    dispatchClickEvent(e) {
        super.dispatchClickEvent(e);
        this.toolToInteraction[this.selectedTool].pointerClick(e);
    }
    activate() {
        super.activate();
        this.toolBar.display();
    }
    deactivate() {
        super.deactivate();
        this.toolBar.hide();
    }
}
exports.MouseDispatcher = MouseDispatcher;
//# sourceMappingURL=MouseDispatcher.js.map