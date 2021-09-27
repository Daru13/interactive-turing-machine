"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const helpers_1 = require("../../helpers");
const Edge_1 = require("./Edge");
class GeneratorEdge extends Edge_1.Edge {
    constructor(graph, generatorNode, stateNode) {
        super(graph);
        this.generatorNode = generatorNode;
        this.stateNode = stateNode;
        this.initGeneratorEdge();
    }
    initGeneratorEdge() {
        super.init();
        this.handleSelection.classed("generator-edge", true);
        this.redrawGeneratorEdge();
    }
    redrawGeneratorEdge() {
        let pt1 = { x: this.generatorNode.x, y: this.generatorNode.y };
        let pt2 = { x: this.stateNode.x, y: this.stateNode.y };
        let dx, dy;
        let angle = helpers_1.Helpers.angleToXAxis(pt1, pt2);
        dx = Math.cos(angle) * Graph_1.Graph.sizeNode;
        dy = Math.sin(angle) * Graph_1.Graph.sizeNode;
        this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, false);
    }
    static isGeneratorEdge(selection) {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof GeneratorEdge;
    }
    static getGeneratorEdge(selection) {
        if (GeneratorEdge.isGeneratorEdge(selection)) {
            return selection.datum()["edge"];
        }
    }
}
exports.GeneratorEdge = GeneratorEdge;
//# sourceMappingURL=GeneratorEdge.js.map