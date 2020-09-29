"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EdgeTool_1 = require("../tools/EdgeTool");
class Pen {
    constructor(graph, turingMachine) {
        this.edgeTool = new EdgeTool_1.EdgeTool(graph, turingMachine);
    }
    pointerDown(e) {
        this.edgeTool.pointerDown(e);
    }
    pointerMove(e) {
        this.edgeTool.pointerMove(e);
    }
    pointerUp(e) {
        this.edgeTool.pointerUp(e);
    }
    pointerLeave(e) {
        this.edgeTool.pointerLeave(e);
    }
    click(e) {
        this.edgeTool.pointerClick(e);
    }
}
exports.Pen = Pen;
//# sourceMappingURL=Pen.js.map