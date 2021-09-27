"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
class Node {
    constructor(graph) {
        this.id = "node-" + Node.nodeNumber;
        this.graph = graph;
        Node.nodeNumber += 1;
        this.handleSelection =
            graph.getNodesGroup()
                .append("g")
                .classed("node", true)
                .datum({ node: this })
                .attr("id", this.id);
        this.x = 0;
        this.y = 0;
    }
    init() { }
    translateTo(x, y) {
        this.x = x;
        this.y = y;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }
    translateBy(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }
    delete() {
        this.handleSelection.remove();
    }
    validate() {
        this.handleSelection.classed("not-valid", false);
    }
    invalidate() {
        this.handleSelection.classed("not-valid", true);
    }
    static isNode(selection) {
        let element = selection.node();
        while (element.tagName !== "svg" && element !== undefined && element !== null) {
            if (d3.select(element).classed("node")) {
                return true;
            }
            element = element.parentNode;
        }
        return false;
    }
    static getNode(selection) {
        let element = selection.node();
        while (element.tagName !== "svg" && element !== undefined && element !== null) {
            if (d3.select(element).classed("node")) {
                return d3.select(element).datum()["node"];
            }
            element = element.parentNode;
        }
        throw "Graph.ts (getNodeHandle): Selection is not part of a node";
    }
}
exports.Node = Node;
Node.nodeNumber = 0;
//# sourceMappingURL=Node.js.map