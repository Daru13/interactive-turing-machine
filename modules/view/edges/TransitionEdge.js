"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const helpers_1 = require("../../helpers");
const Tape_1 = require("../../model/Tape");
const Edge_1 = require("./Edge");
class TransitionEdge extends Edge_1.Edge {
    constructor(graph, transition, isCurved) {
        super(graph);
        this.transitionIDs = [transition.id];
        this.originNode = graph.stateIdToStateNode.get(transition.origin.id);
        this.destinationNode = graph.stateIdToStateNode.get(transition.destination.id);
        this.isCurved = isCurved;
        this.graph = graph;
        this.initTransitionEdge(transition);
    }
    initTransitionEdge(transition) {
        super.init();
        this.handleSelection.classed("transition-edge", true);
        this.redrawTransitionEdge();
        this.drawTransitionText(transition.getInputSymbol(), transition.getOutputSymbol(), transition.getHeadAction());
    }
    addTransitionToEdge(transition) {
        this.transitionIDs.push(transition.id);
        this.handleSelection.classed("bigger", true);
    }
    redrawTransitionEdge() {
        let pt1 = { x: this.originNode.x, y: this.originNode.y };
        let pt2 = { x: this.destinationNode.x, y: this.destinationNode.y };
        let dx, dy;
        if (pt1.x === pt2.x && pt1.y === pt2.y) {
            let flipped = pt1.y < this.graph.viewBox.y + this.graph.viewBox.height / 2;
            dx = 0;
            dy = (flipped) ? -Graph_1.Graph.sizeNode : Graph_1.Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt1.x + dx, y: pt1.y + dy }, false, flipped);
        }
        else {
            let angle = helpers_1.Helpers.angleToXAxis(pt1, pt2);
            dx = Math.cos(angle) * Graph_1.Graph.sizeNode;
            dy = Math.sin(angle) * Graph_1.Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, this.isCurved);
        }
    }
    deleteTransitionEdge(transitionId) {
        let index = this.transitionIDs.indexOf(transitionId);
        this.transitionIDs.splice(index, 1);
        this.handleSelection.classed("bigger", this.transitionIDs.length !== 1);
        if (this.transitionIDs.length === 0) {
            this.delete();
        }
    }
    static isTransitionEdge(selection) {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof TransitionEdge;
    }
    static getTransitionEdge(selection) {
        if (TransitionEdge.isTransitionEdge(selection)) {
            return selection.datum()["edge"];
        }
    }
    drawTransitionText(inputSymbol, outputSymbol, headAction) {
        let headActionSymbol = "";
        switch (headAction) {
            case Tape_1.HeadAction.MoveLeft:
                headActionSymbol = "←";
                break;
            case Tape_1.HeadAction.MoveRight:
                headActionSymbol = "→";
                break;
            case Tape_1.HeadAction.None:
                headActionSymbol = "∅";
                break;
        }
        let extraTransitionsSymbol = (this.transitionIDs.length > 1) ? " ..." : "";
        this.redrawText((inputSymbol === "" ? "" : ("\u{1F4D6} " + inputSymbol + " "))
            + (outputSymbol === "" ? "" : ("\u{1F4DD} " + outputSymbol + " "))
            + ("\u{1F9ED} " + headActionSymbol)
            + extraTransitionsSymbol);
    }
    setCurved(b) {
        this.isCurved = b;
    }
}
exports.TransitionEdge = TransitionEdge;
//# sourceMappingURL=TransitionEdge.js.map