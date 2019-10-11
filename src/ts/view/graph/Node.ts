import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { State, StateID } from "../../model/State";

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

     node.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", Graph.sizeNode);

        //addHandDrawnCircle(node, Graph.sizeNode, "nodeCircle");

        node.append("text")
            .attr("x",0)
            .attr("y",-2)
            .attr("text-anchor", "middle")
            .text("N"+state.id);

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
        if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
            if(d3.select("#" + selection.datum()["id"]).classed("node")){
                return true;
            }
        }
        return false;
    }

    static getHandle(selection: NodeElementSelection): NodeHandleSelection{
        var node: NodeHandleSelection;
        if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
            node = d3.select("#" + selection.datum()["id"]);
            if(node.classed("node")){
                return node;
            }
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
}