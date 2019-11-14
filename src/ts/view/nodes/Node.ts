import { Graph } from "../Graph";
import * as d3 from "d3-selection";

/**
 * Data in the DOM link to the Element Node.
 */
export interface NodeDatum {
    node: Node;
}

export type NodeSelection = d3.Selection<SVGGElement, NodeDatum, any, any>;

/**
 * an abstract class to define an edge.
 */
export abstract class Node{
    /** number of node created. */
    static nodeNumber: number = 0;
    /** id of the node. */
    id: string;
    /** d3 selection of the svg group classed as a node. */
    handleSelection: d3.Selection<SVGGElement, any, any, any>;
    /** x position of the node. */
    x: number;
    /** y position of the node. */
    y: number;
    /** graph containing the node. */
    graph: Graph;
   
    constructor(graph: Graph) {
        this.id = "node-" + Node.nodeNumber;
        this.graph = graph;

        Node.nodeNumber += 1;

        this.handleSelection = 
            graph.getNodesGroup()
                .append("g")
                    .classed("node", true)
                    .datum({ node: this})
                    .attr("id", this.id);
        this.x = 0;
        this.y = 0;
    }

    /**
     * Inits node.
     */
    init(): void { }

    /**
     * Translates the node to x and y.
     * @param x new x position.
     * @param y new y position.
     */
    translateTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }

    /**
     * Translates the node by dx and dy.
     * @param dx How much to move on the x axis.
     * @param dy How much to move on the y axis.
     */
    translateBy(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }

    /**
     * Deletes the node.
     */
    delete(): void {
        this.handleSelection.remove();
    }

    /**
     * Classs the node as valid, i.e. the state represented by this node is deterministic.
     */
    validate(): void {
        this.handleSelection.classed("not-valid", false);
    }

    /**
     * Classs the node as invalid, i.e. the state represented by this node is non deterministic.
     */
    invalidate(): void {
        this.handleSelection.classed("not-valid", true);
    }

    /**
     * Determines whether a d3 selection is a node.
     * @param selection d3 selection to test.
     * @returns true if is a node.
     */
    static isNode(selection: d3.Selection<any, any, any, any>): boolean {
        let element = selection.node();
        while (element.tagName !== "svg" && element !== undefined && element !== null) {
            if (d3.select(element).classed("node")) {
                    return true;
            }
            element = element.parentNode;
        }
        return false;
    }

    /**
     * Gets the node containing the selection.
     * @param selection d3 selection of a part of a node.
     * @returns the node containing the selection.
     */
    static getNode(selection: d3.Selection<any, any, any, any>): Node {
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