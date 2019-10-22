import { Graph, GraphDatum } from "../Graph";
import * as d3 from "d3-selection";
import { State, StateID } from "../../../model/State";
import { addLamp } from "../../CustomShape/lamps";

export interface NodeDatum {
    node: Node;
};

export type NodeSelection = d3.Selection<SVGGElement, NodeDatum, any, any>;

export abstract class Node{
    static nodeNumber = 0;
    id: string;
    handleSelection: d3.Selection<SVGGElement, any, any, any>;
    x: number;
    y: number;
   
    constructor(graph: Graph){
        this.id = "node-" + Node.nodeNumber;

        Node.nodeNumber += 1;

        this.handleSelection = 
            graph.getNodesGroup()
                .append("g")
                    .classed("node", true)
                    .datum({node: this})
                    .attr("id", this.id);
        this.x = 0;
        this.y = 0;
    }

    init(){}

    translateTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }

    translateBy(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }

    delete(): void{
        this.handleSelection.remove();
    }

    static isNode(selection: d3.Selection<any, any, any, any>): boolean{
        let element = selection.node()
        while (element.tagName != "svg" && element != undefined && element != null){
            if (d3.select(element).classed("node")) {
                    return true;
            }
            element = element.parentNode;
        }
        return false;
    }

    static getNode(selection: d3.Selection<any, any, any, any>): Node{
        let element = selection.node()
        while (element.tagName != "svg" && element != undefined && element != null) {
            if (d3.select(element).classed("node")) {
                return d3.select(element).datum()["node"];
            }
            element = element.parentNode;
        }

        throw "Graph.ts (getNodeHandle): Selection is not part of a node";
    }
}