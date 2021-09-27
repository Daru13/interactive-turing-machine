"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const DeleteTransitionAction_1 = require("../../actions/DeleteTransitionAction");
const DeleteStateAction_1 = require("../../actions/DeleteStateAction");
const TransitionEdge_1 = require("../../edges/TransitionEdge");
const StateNode_1 = require("../../nodes/StateNode");
class Eraser {
    constructor(graph, turingMachine) {
        this.turingMachine = turingMachine;
    }
    pointerDown(e) {
        this.target = e.target;
    }
    pointerMove(e) {
    }
    pointerUp(e) {
        let targetSelection = d3.select(this.target);
        if (StateNode_1.StateNode.isStateNode(targetSelection)) {
            DeleteStateAction_1.DeleteStateAction.do(StateNode_1.StateNode.getStateNode(targetSelection), this.turingMachine);
        }
        else if (TransitionEdge_1.TransitionEdge.isTransitionEdge(targetSelection)) {
            DeleteTransitionAction_1.DeleteTransitionAction.do(TransitionEdge_1.TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
    }
    pointerLeave(e) {
    }
    click(e) { }
}
exports.Eraser = Eraser;
//# sourceMappingURL=Eraser.js.map