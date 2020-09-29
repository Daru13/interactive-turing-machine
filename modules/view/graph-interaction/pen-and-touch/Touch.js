"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeTool_1 = require("../tools/NodeTool");
class Touch {
    constructor(graph, turingMachine) {
        this.turingMachine = turingMachine;
        this.nodeTool = new NodeTool_1.NodeTool(graph, turingMachine);
    }
    pointerDown(e) {
        this.nodeTool.pointerDown(e);
    }
    pointerMove(e) {
        this.nodeTool.pointerMove(e);
    }
    pointerUp(e) {
        this.nodeTool.pointerUp(e);
    }
    pointerLeave(e) {
        this.nodeTool.pointerLeave(e);
    }
    click(e) {
        this.nodeTool.pointerClick(e);
    }
}
exports.Touch = Touch;
//# sourceMappingURL=Touch.js.map