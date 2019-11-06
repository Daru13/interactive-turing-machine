import { Graph, GraphDatum } from "../Graph";
import { addGenerator } from "../../CustomShape/generator";
import * as d3 from "d3-selection";
import { Node } from "./Node";
import { ErrorPopup } from "../../editors/ErrorPopUp";
import { NoInitialStateError } from "../../../errors/NoInitialStateError";

export class GeneratorNode extends Node{
    graph: Graph;

    constructor(graph: Graph){
        super(graph);

        this.graph = graph;
        this.initGeneratorNode();
        this.addHoverInteraction();
    }

    initGeneratorNode(): void{
        super.init();

        let viewbox = this.graph.getSVG().attr("viewBox").split(",");
       
        this.translateTo(Graph.sizeNode, parseInt(viewbox[3]) / 2);
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

    addHoverInteraction() {
        /*let popup = null;
        this.handleSelection.on("mouseover", () => {
            if (this.handleSelection.classed("not-valid") && popup === null) {
                let tM = this.graph.turingMachine;
                popup = new ErrorPopup(new NoInitialStateError(tM));
            }
        })

        this.handleSelection.on("mouseleave", () => {
            if (popup !== null) {
                popup.close();
                popup = null;
            }
        })*/
    }
}