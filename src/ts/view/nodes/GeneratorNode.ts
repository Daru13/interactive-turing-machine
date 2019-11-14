import { Graph } from "../Graph";
import { addGenerator } from "../custom-shapes/generator";
import * as d3 from "d3-selection";
import { Node } from "./Node";

/**
 * A class to create the generator node in a graph.
 */
export class GeneratorNode extends Node{
    /** Graph containing the generator node. */
    graph: Graph;

    constructor(graph: Graph) {
        super(graph);

        this.graph = graph;
        this.initGeneratorNode();
    }
 
    /**
     * Inits generator node. Sets the position of the generator to be 10 pixel from the left border of the graph and vertically centered in the graph.
     */
    initGeneratorNode(): void {
        super.init();

        let viewbox = this.graph.getSVG().attr("viewBox").split(",");
       
        this.translateTo(Graph.sizeNode + 10, parseInt(viewbox[3]) / 2);
        this.handleSelection.attr("id", "generator") ;

        addGenerator(this.handleSelection, Graph.sizeNode);
    }

    /**
     * Determines whether a d3 selection is a generator.
     * @param selection d3 selection to test.
     * @returns true if is a generator.
     */
    static isGenerator(selection: d3.Selection<any, any, any, any>): boolean {
        if (Node.isNode(selection)) {
            if (Node.getNode(selection) instanceof GeneratorNode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the generator node containing the selection.
     * @param selection d3 selection contained in a generator node.
     * @returns generator node containing the selection.
     */
    static getGeneratorHandle(selection: d3.Selection<any, any, any, any>): GeneratorNode {
        if (Node.isNode(selection)) {
            let node = Node.getNode(selection);
            if (node instanceof GeneratorNode) {
                return node;
            }
        }
        throw "GeneratorNode.ts (getGeneratorHandle): Selection is not part of a generatorNode";
    }
}