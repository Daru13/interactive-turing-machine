"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
class GraphEventDispatcher {
    constructor(graph, turingMachine) {
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isActivated = false;
        this.setInteraction();
    }
    setInteraction() {
        let timeDown = {};
        this.graph.getSVGElement()
            .addEventListener("pointerdown", (e) => {
            if (this.isActivated) {
                timeDown[e.pointerId] = new Date().getTime();
                this.dispatchDownEvent(helpers_1.Helpers.transformEvent(e));
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointermove", (e) => {
            if (this.isActivated) {
                this.dispatchMoveEvent(helpers_1.Helpers.transformEvent(e));
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointerup", (e) => {
            if (this.isActivated) {
                this.dispatchUpEvent(helpers_1.Helpers.transformEvent(e));
                if (Math.abs(new Date().getTime() - timeDown[e.pointerId]) < 200) {
                    this.dispatchClickEvent(helpers_1.Helpers.transformEvent(e));
                }
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointerleave", (e) => {
            if (this.isActivated) {
                this.dispatchLeaveEvent(helpers_1.Helpers.transformEvent(e));
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointercancel", (e) => {
            if (this.isActivated) {
                console.log("cancel");
            }
        });
    }
    dispatchDownEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchMoveEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchUpEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchLeaveEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchClickEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    activate() {
        this.isActivated = true;
    }
    deactivate() {
        this.isActivated = false;
    }
}
exports.GraphEventDispatcher = GraphEventDispatcher;
//# sourceMappingURL=GraphEventDispatcher.js.map