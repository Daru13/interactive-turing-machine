"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateTransitionAction_1 = require("../../actions/CreateTransitionAction");
const Graph_1 = require("../../Graph");
const Node_1 = require("../../nodes/Node");
const d3 = require("d3-selection");
const helpers_1 = require("../../../helpers");
const SetInitialStateAction_1 = require("../../actions/SetInitialStateAction");
const TransitionEdge_1 = require("../../edges/TransitionEdge");
const StateNode_1 = require("../../nodes/StateNode");
const GeneratorEdge_1 = require("../../edges/GeneratorEdge");
const GeneratorNode_1 = require("../../nodes/GeneratorNode");
const NodeEditorPopup_1 = require("../../popups/NodeEditorPopup");
const TransitionEdgeEditorPopup_1 = require("../../popups/TransitionEdgeEditorPopup");
const GeneratorEdgeEditorPopup_1 = require("../../popups/GeneratorEdgeEditorPopup");
class EdgeTool {
    constructor(graph, turingMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.graph = graph;
        this.isDown = false;
        this.turingMachine = turingMachine;
    }
    pointerDown(e) {
        this.previousX = e.x;
        this.previousY = e.y;
        this.node = undefined;
        let targetSelection = d3.select(e.target);
        this.isDown = true;
        if (Node_1.Node.isNode(targetSelection)) {
            this.node = Node_1.Node.getNode(targetSelection);
            this.edgeInCreation =
                this.graph.getSVG()
                    .append("path")
                    .classed("edge-in-creation", true);
            this.drawEdgeInCreation();
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
                this.drawEdgeInCreation();
                d3.selectAll(".node.closest-node").classed("closest-node", false);
                let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph_1.Graph.sizeNode, Graph_1.Graph.sizeNode * 3);
                if (closestNode !== undefined) {
                    closestNode.handleSelection.classed("closest-node", true);
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
        this.isDown = false;
        if (this.node !== undefined) {
            this.edgeInCreation.remove();
            d3.selectAll(".node.closest-node").classed("closest-node", false);
            let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph_1.Graph.sizeNode, Graph_1.Graph.sizeNode * 3);
            if (closestNode !== undefined) {
                if (this.node instanceof StateNode_1.StateNode && closestNode instanceof StateNode_1.StateNode) {
                    CreateTransitionAction_1.CreateTransitionAction.do(this.node, closestNode, this.turingMachine);
                }
                else if (this.node instanceof GeneratorNode_1.GeneratorNode && closestNode instanceof StateNode_1.StateNode) {
                    SetInitialStateAction_1.SetInitialStateAction.do(closestNode, this.turingMachine);
                }
                else if (this.node instanceof StateNode_1.StateNode && closestNode instanceof GeneratorNode_1.GeneratorNode) {
                    SetInitialStateAction_1.SetInitialStateAction.do(this.node, this.turingMachine);
                }
            }
        }
    }
    pointerLeave(e) {
        if (this.isDown) {
            if (this.node !== undefined) {
                this.edgeInCreation.remove();
                d3.selectAll(".node.closest-node").classed("closest-node", false);
                this.isDown = false;
            }
        }
    }
    pointerClick(e) {
        let target = e.target;
        let targetSelection = d3.select(target);
        if (this.node !== undefined && this.node instanceof StateNode_1.StateNode) {
            new NodeEditorPopup_1.NodeEditor(this.node, this.turingMachine);
        }
        else if (TransitionEdge_1.TransitionEdge.isTransitionEdge(targetSelection)) {
            new TransitionEdgeEditorPopup_1.TransitionEdgeEditor(TransitionEdge_1.TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
        else if (GeneratorEdge_1.GeneratorEdge.isGeneratorEdge(targetSelection)) {
            new GeneratorEdgeEditorPopup_1.GeneratorEdgeEditor(GeneratorEdge_1.GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine.stateMachine);
        }
    }
    drawEdgeInCreation() {
        this.edgeInCreation
            .attr("d", "M" + this.node.x + "," + this.node.y +
            " L" + this.previousX + "," + this.previousY);
    }
    closestNode(beginEdge, endEdge, minLength, distFromEnd) {
        let closestNode;
        let minDistance = distFromEnd;
        d3.selectAll(".node").each(function () {
            let node = Node_1.Node.getNode(d3.select(this));
            let point2 = {
                x: node.x, y: node.y
            };
            if (helpers_1.Helpers.distance2(endEdge, point2) < minDistance) {
                minDistance = helpers_1.Helpers.distance2(endEdge, point2);
                closestNode = node;
            }
        });
        if (helpers_1.Helpers.distance2(beginEdge, endEdge) < minLength) {
            return undefined;
        }
        return closestNode;
    }
}
exports.EdgeTool = EdgeTool;
//# sourceMappingURL=EdgeTool.js.map