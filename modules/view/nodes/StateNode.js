"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const d3 = require("d3-selection");
const lamps_1 = require("../custom-shapes/lamps");
const Node_1 = require("./Node");
var StateNodeType;
(function (StateNodeType) {
    StateNodeType["STANDARD"] = "standard";
    StateNodeType["START"] = "start";
    StateNodeType["FINAL"] = "final";
})(StateNodeType = exports.StateNodeType || (exports.StateNodeType = {}));
class StateNode extends Node_1.Node {
    constructor(graph, state) {
        super(graph);
        this.stateID = state.id;
        this.initStateNode(state);
    }
    initStateNode(state) {
        super.init();
        let position = state.getPosition();
        this.handleSelection.classed("state-node", true);
        this.handleSelection.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", Graph_1.Graph.sizeNode + 2)
            .classed("shadow", true);
        lamps_1.addLamp(this.handleSelection, "nodeCircle");
        this.handleSelection.on("animationend", () => {
            this.handleSelection.classed("created", false);
            this.handleSelection.select(".shadow").remove();
        });
        this.handleSelection.classed("created", true);
        this.setLabel(state.getLabel());
        this.translateTo(position.x, position.y);
    }
    static isStateNode(selection) {
        if (Node_1.Node.isNode(selection)) {
            if (Node_1.Node.getNode(selection) instanceof StateNode) {
                return true;
            }
        }
        return false;
    }
    static getStateNode(selection) {
        if (Node_1.Node.isNode(selection)) {
            let node = Node_1.Node.getNode(selection);
            if (node instanceof StateNode) {
                return node;
            }
        }
        throw "StateNode.ts (getStateNode): Selection is not part of a stateNode";
    }
    isInitialNode() {
        return this.handleSelection.classed("start");
    }
    setInitialNode(isInital) {
        this.handleSelection.classed("start", isInital);
    }
    setFinalNode(isFinal) {
        this.handleSelection.classed("final", isFinal);
    }
    static resetCurrentNode() {
        d3.selectAll(".current").classed("current", false);
    }
    setCurrentNode() {
        StateNode.resetCurrentNode();
        this.handleSelection.classed("current", true);
    }
    setLabel(label) {
        let textToDisplay = label;
        if (textToDisplay.length > 10) {
            textToDisplay = textToDisplay.substring(0, 7) + "...";
        }
        this.handleSelection.select("#label-text").text(textToDisplay);
    }
    invalidate() {
        super.invalidate();
        let transitions = this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions();
        let edge;
        if (transitions !== undefined && transitions !== null) {
            transitions.forEach((t) => {
                edge = this.graph.transitionIdToTransitionEdge.get(t.id);
                if (edge !== undefined && edge !== null) {
                    edge.invalidate();
                }
            });
        }
    }
    validate() {
        super.validate();
        let transitions = this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions();
        let edge;
        if (transitions !== undefined && transitions !== null) {
            transitions.forEach((t) => {
                edge = this.graph.transitionIdToTransitionEdge.get(t.id);
                if (edge !== undefined && edge !== null) {
                    edge.validate();
                }
            });
        }
    }
    updateValidateProperty() {
        if (this.graph.turingMachine.stateMachine.getState(this.stateID).isDeterministic()) {
            this.validate();
        }
        else {
            this.invalidate();
        }
    }
}
exports.StateNode = StateNode;
//# sourceMappingURL=StateNode.js.map