"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const generator_1 = require("../custom-shapes/generator");
const Node_1 = require("./Node");
class GeneratorNode extends Node_1.Node {
    constructor(graph) {
        super(graph);
        this.graph = graph;
        this.initGeneratorNode();
    }
    initGeneratorNode() {
        super.init();
        let viewbox = this.graph.getSVG().attr("viewBox").split(",");
        this.translateTo(Graph_1.Graph.sizeNode + 10, parseInt(viewbox[3]) / 2);
        this.handleSelection.attr("id", "generator");
        generator_1.addGenerator(this.handleSelection, Graph_1.Graph.sizeNode);
    }
    static isGenerator(selection) {
        if (Node_1.Node.isNode(selection)) {
            if (Node_1.Node.getNode(selection) instanceof GeneratorNode) {
                return true;
            }
        }
        return false;
    }
    static getGeneratorHandle(selection) {
        if (Node_1.Node.isNode(selection)) {
            let node = Node_1.Node.getNode(selection);
            if (node instanceof GeneratorNode) {
                return node;
            }
        }
        throw "GeneratorNode.ts (getGeneratorHandle): Selection is not part of a generatorNode";
    }
}
exports.GeneratorNode = GeneratorNode;
//# sourceMappingURL=GeneratorNode.js.map