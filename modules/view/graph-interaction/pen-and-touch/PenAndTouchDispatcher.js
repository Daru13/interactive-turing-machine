"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pen_1 = require("./Pen");
const Eraser_1 = require("./Eraser");
const Touch_1 = require("./Touch");
const GraphEventDispatcher_1 = require("../GraphEventDispatcher");
class PenAndTouchDispatcher extends GraphEventDispatcher_1.GraphEventDispatcher {
    constructor(graph, turingMachine) {
        super(graph, turingMachine);
        this.idToPenAndTouch = {};
    }
    dispatchDownEvent(e) {
        super.dispatchDownEvent(e);
        switch (e.pointerType) {
            case "touch":
                this.idToPenAndTouch[e.pointerId] = new Touch_1.Touch(this.graph, this.turingMachine);
                break;
            case "pen":
                this.idToPenAndTouch[e.pointerId] = new Pen_1.Pen(this.graph, this.turingMachine);
                break;
            case "eraser":
                this.idToPenAndTouch[e.pointerId] = new Eraser_1.Eraser(this.graph, this.turingMachine);
                break;
            case "modify":
            default:
        }
        this.idToPenAndTouch[e.pointerId].pointerDown(e);
    }
    dispatchMoveEvent(e) {
        super.dispatchMoveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerMove(e);
        }
    }
    dispatchUpEvent(e) {
        super.dispatchUpEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerUp(e);
        }
    }
    dispatchLeaveEvent(e) {
        super.dispatchLeaveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerLeave(e);
        }
    }
    dispatchClickEvent(e) {
        super.dispatchClickEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].click(e);
        }
    }
}
exports.PenAndTouchDispatcher = PenAndTouchDispatcher;
//# sourceMappingURL=PenAndTouchDispatcher.js.map