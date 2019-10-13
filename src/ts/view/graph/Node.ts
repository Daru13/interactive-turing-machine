import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { State, StateID } from "../../model/State";
import { addLamp } from "../CustomShape/lamps";

export enum NodeType {
    STANDARD = "standard",
    START = "start",
    FINAL = "final"
}

export interface NodeDatum {
    x: number;
    y: number;
    id: string;
    stateID: StateID;
};

export type NodeElementSelection = d3.Selection<SVGElement, NodeDatum, SVGElement, NodeDatum>;
export type NodeHandleSelection = d3.Selection<SVGGElement, NodeDatum, HTMLElement, GraphDatum>;

export class Node{
    constructor(){}

    static add(graph: Graph, state: State): void{
        let position = state.getPosition();
        let datum: NodeDatum = {x: 0, y: 0, id: "node-" + state.id, stateID: state.id};
        let node: NodeHandleSelection =
            graph.getSVG()
                .append("g")
                    .classed("node", true)
                    .datum(datum)
                    .attr("id", "node-"+state.id);

        addLamp(node, Graph.sizeNode, "nodeCircle");

        Node.translate(node, position.x, position.y);
    }

    static translate(node: NodeHandleSelection, dx: number, dy: number): void{
        node.datum()["x"] += dx;
        node.datum()["y"] += dy;
        node.attr("transform", function(d){return "translate("+d.x+","+d.y+")"});
    }

    static delete(node: NodeHandleSelection): void{
        node.remove();
    }

    static isNode(selection: d3.Selection<any, any, any, any>): boolean{
        let child = selection.node();
        let security = 100;
        let i = 0;
        while(child.parentElement.tagName != "BODY" && i < security){
            if (d3.select(child).classed("node")) {
                return true;
            }
            child = child.parentElement;
            i += 1;
        }
        return false;
    }

    static getHandle(selection: NodeElementSelection): NodeHandleSelection{
        var node: NodeHandleSelection;
        let child = selection.node() as Element;
        let security = 100;
        let i = 0;
        while (child.parentElement.tagName != "BODY" && i < security) {
            if (d3.select(child).classed("node")) {
                node = d3.select(child) as NodeHandleSelection;
                return node;
            }
            child = child.parentElement;
            i += 1;
        }
        throw "Graph.ts (getNodeHandle): Selection is not part of a node";
    }

    static getHandleByStateId(stateId: StateID): NodeHandleSelection{
        return d3.select("#node-"+stateId);
    }

    static setInitialState(node: NodeHandleSelection, isInital: boolean) {
        node.classed("start", isInital);
    }

    static setFinalState(node: NodeHandleSelection, isFinal: boolean) {
        node.classed("final", isFinal);
    }

    static setCurrentNode(node: NodeHandleSelection) {
        d3.selectAll(".current").classed("current", false);
        node.classed("current", true);
    }
}