"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Graph_1 = require("../../Graph");
const CreateStateAction_1 = require("../../actions/CreateStateAction");
const TransitionEdge_1 = require("../../edges/TransitionEdge");
const StateNode_1 = require("../../nodes/StateNode");
const Node_1 = require("../../nodes/Node");
const GeneratorEdge_1 = require("../../edges/GeneratorEdge");
const helpers_1 = require("../../../helpers");
const MoveStateAction_1 = require("../../actions/MoveStateAction");
const NodeEditorPopup_1 = require("../../popups/NodeEditorPopup");
const TransitionEdgeEditorPopup_1 = require("../../popups/TransitionEdgeEditorPopup");
const GeneratorEdgeEditorPopup_1 = require("../../popups/GeneratorEdgeEditorPopup");
class NodeTool {
    constructor(graph, turingMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.bestPos = { x: 0, y: 0 };
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isDown = false;
    }
    pointerDown(e) {
        this.previousX = e.x;
        this.previousY = e.y;
        this.isDown = true;
        if (StateNode_1.StateNode.isStateNode(d3.select(e.target))) {
            this.node = StateNode_1.StateNode.getStateNode(d3.select(e.target));
            this.node.handleSelection.classed("move", true);
            this.node.handleSelection.raise();
            this.bestPos = { x: this.node.x, y: this.node.y };
            return;
        }
        if (d3.select(e.target).node().tagName === "svg") {
            this.node = undefined;
            this.previousX = e.pageX;
            this.previousY = e.pageY;
            return;
        }
        this.isDown = false;
    }
    pointerMove(e) {
        if (this.isDown) {
            if (this.node !== undefined) {
                this.node.translateBy(e.x - this.previousX, e.y - this.previousY);
                this.turingMachine
                    .stateMachine.getState(this.node.stateID)
                    .getInTransitions()
                    .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id).redrawTransitionEdge());
                this.turingMachine
                    .stateMachine.getState(this.node.stateID)
                    .getOutTransitions()
                    .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id).redrawTransitionEdge());
                if (this.node.isInitialNode()) {
                    this.graph.generatorEdge.redrawGeneratorEdge();
                }
                if (this.isThisBestPosForNode()) {
                    this.bestPos.x = this.node.x;
                    this.bestPos.y = this.node.y;
                    this.node.handleSelection.classed("bad-position", false);
                }
                else {
                    this.node.handleSelection.classed("bad-position", true);
                }
                this.previousX = e.x;
                this.previousY = e.y;
            }
            else {
                this.graph.translateViewBoxBy(e.pageX - this.previousX, e.pageY - this.previousY);
                this.previousX = e.pageX;
                this.previousY = e.pageY;
            }
        }
    }
    pointerUp(e) {
        if (this.node !== undefined) {
            this.node.handleSelection.classed("move", false);
            this.node.handleSelection.classed("bad-position", false);
            MoveStateAction_1.MoveStateAction.do(this.node, this.bestPos.x, this.bestPos.y, this.turingMachine);
            this.node = undefined;
        }
        this.isDown = false;
    }
    pointerLeave(e) {
        this.pointerUp(e);
    }
    pointerClick(e) {
        let target = e.target;
        let targetSelection = d3.select(target);
        if (d3.select(target).property("tagName") === "svg") {
            CreateStateAction_1.CreateStateAction.do(e.x, e.y, this.turingMachine);
        }
        else if (StateNode_1.StateNode.isStateNode(targetSelection)) {
            new NodeEditorPopup_1.NodeEditor(StateNode_1.StateNode.getStateNode(targetSelection), this.turingMachine);
        }
        else if (TransitionEdge_1.TransitionEdge.isTransitionEdge(targetSelection)) {
            new TransitionEdgeEditorPopup_1.TransitionEdgeEditor(TransitionEdge_1.TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
        else if (GeneratorEdge_1.GeneratorEdge.isGeneratorEdge(targetSelection)) {
            new GeneratorEdgeEditorPopup_1.GeneratorEdgeEditor(GeneratorEdge_1.GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine.stateMachine);
        }
    }
    isThisBestPosForNode() {
        let isBestPos = true;
        let node = this.node;
        d3.selectAll(".node").each(function () {
            let thisNode = Node_1.Node.getNode(d3.select(this));
            if (thisNode.id !== node.id && isBestPos) {
                isBestPos = helpers_1.Helpers.distance2({ x: node.x, y: node.y }, { x: thisNode.x, y: thisNode.y }) >= Graph_1.Graph.sizeNode * 2;
            }
        });
        return isBestPos;
    }
}
exports.NodeTool = NodeTool;
//# sourceMappingURL=NodeTool.js.map