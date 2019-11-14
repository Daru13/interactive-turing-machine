import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { Helpers } from "../../helpers";
import { Edge } from "./Edge";
import { GeneratorNode } from "../nodes/GeneratorNode";
import { StateNode } from "../nodes/StateNode";

/**
 * A class to represent the edge comming out of the generator.
 */
export class GeneratorEdge extends Edge {
    /** Generator node where the generator edge is comming from. */
    generatorNode: GeneratorNode;
    /**  State node where the generator edge is going to. */
    stateNode: StateNode;

    constructor(graph: Graph, generatorNode: GeneratorNode, stateNode: StateNode) {
        super(graph);
        this.generatorNode = generatorNode;
        this.stateNode = stateNode;
        this.initGeneratorEdge();
    }

    /**
     * Inits generator edge.
     */
    initGeneratorEdge(): void {
        super.init();

        this.handleSelection.classed("generator-edge", true);

        this.redrawGeneratorEdge();
    }

    /**
     * Redraws the generator edge between the generator and the node.
     */
    redrawGeneratorEdge(): void {
        let pt1 = { x: this.generatorNode.x, y: this.generatorNode.y };
        let pt2 = { x: this.stateNode.x, y: this.stateNode.y };
        let dx, dy;

        let angle = Helpers.angleToXAxis(pt1, pt2);
        dx = Math.cos(angle) * Graph.sizeNode;
        dy = Math.sin(angle) * Graph.sizeNode;
        this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, false);
    }

    /**
     * Determines whether d3 selection is a generator edge.
     * @param selection d3 selection to test.
     * @returns true if is a generator edge.
     */
    static isGeneratorEdge(selection: d3.Selection<any, any, any, any>): boolean {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof GeneratorEdge;
    }

    /**
     * Gets the generator edge containing the selection.
     * @param selection selection of an element of a generator edge.
     * @returns the generator edge containing the selection.
     */
    static getGeneratorEdge(selection: d3.Selection<any, any, any, any>): GeneratorEdge {
        if (GeneratorEdge.isGeneratorEdge(selection)) {
            return selection.datum()["edge"];
        }
    }
}
