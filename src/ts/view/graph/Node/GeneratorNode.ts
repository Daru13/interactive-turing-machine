import { Graph, GraphDatum } from "../Graph";
import { addGenerator } from "../../CustomShape/generator";
import * as d3 from "d3-selection";
import { Node } from "./Node";

export class GeneratorNode extends Node{
    graph: Graph;

    constructor(graph: Graph){
        super(graph);

        this.graph = graph;
        this.initGeneratorNode();
    }

    initGeneratorNode(): void{
        super.init();

        let bbox = this.graph.getSVGElement().getBoundingClientRect();
       
        this.translateTo(Graph.sizeNode, bbox.height / 2);
        this.handleSelection.attr("id", "generator") 

        addGenerator(this.handleSelection, Graph.sizeNode);
    }

    static isGenerator(selection: d3.Selection<any, any, any, any>): boolean {
        if (Node.isNode(selection)) {
            if (Node.getNode(selection) instanceof GeneratorNode) {
                return true
            }
        }
        return false;
    }

    static getGeneratorHandle(selection: d3.Selection<any, any, any, any>): GeneratorNode {
        if (Node.isNode(selection)) {
            let node = Node.getNode(selection)
            if (node instanceof GeneratorNode) {
                return node
            }
        }
        throw "GeneratorNode.ts (getGeneratorHandle): Selection is not part of a generatorNode";
    }
}