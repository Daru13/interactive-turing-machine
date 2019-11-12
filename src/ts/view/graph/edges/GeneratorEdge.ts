import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { Helpers } from "../../../helpers";
import { Edge } from "./Edge";
import { GeneratorNode } from "../nodes/GeneratorNode";
import { StateNode } from "../nodes/StateNode";

export class GeneratorEdge extends Edge {
    generatorNode: GeneratorNode;
    stateNode: StateNode;

    constructor(graph: Graph, generatorNode: GeneratorNode, stateNode: StateNode) {
        super(graph);
        this.generatorNode = generatorNode;
        this.stateNode = stateNode;
        this.initGeneratorEdge();
    }

    initGeneratorEdge(): void {
        super.init();

        this.handleSelection.classed("generator-edge", true);

        this.redrawGeneratorEdge();
    }

    redrawGeneratorEdge(): void {
        let pt1 = { x: this.generatorNode.x, y: this.generatorNode.y };
        let pt2 = { x: this.stateNode.x, y: this.stateNode.y };
        let dx, dy;

        let angle = Helpers.angleToXAxis(pt1, pt2);
        dx = Math.cos(angle) * Graph.sizeNode;
        dy = Math.sin(angle) * Graph.sizeNode;
        this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, false);
    }

    static isGeneratorEdge(selection: d3.Selection<any, any, any, any>): boolean {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof GeneratorEdge;
    }

    static getGeneratorEdge(selection: d3.Selection<any, any, any, any>): GeneratorEdge {
        if (GeneratorEdge.isGeneratorEdge(selection)) {
            return selection.datum()["edge"];
        }
    }
}
