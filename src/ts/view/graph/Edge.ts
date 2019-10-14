import { Graph, GraphDatum } from "./Graph";
import * as d3 from "d3-selection";
import { Node, NodeHandleSelection } from "./Node";
import { Transition, TransitionID } from "../../model/Transition";
import { Helpers } from "../../helpers";
import { HeadAction, TapeSymbol } from "../../model/Tape";

export type EdgeId = String;

export interface EdgeDatum {
    id: string;
    transitionID: TransitionID[]
};

export type EdgeElementSelection = d3.Selection<SVGElement, EdgeDatum, SVGElement, EdgeDatum>;
export type EdgeHandleSelection = d3.Selection<SVGGElement, EdgeDatum, HTMLElement, GraphDatum>;

export class Edge{
    static transitionIdToEdgeId = {} as Record<TransitionID, EdgeId>
    constructor(){}

    static addNewEdge(graph:Graph, transition: Transition): void{
        let id = "edge-" + transition.id;
        Edge.transitionIdToEdgeId[transition.id] = id;

        let datum: EdgeDatum = { id: id, transitionID: [transition.id ]};
        var edgeHandle :EdgeHandleSelection =
            graph.getSVG()
                .append("g")
                .datum(datum)
                .attr("id", id)
                .classed("edge", true);

        edgeHandle
            .append("rect")
                .attr("x", Graph.sizeNode)
                .attr("y", -25)
                .attr("width", 1)
                .attr("height", 50);

        edgeHandle.append("path").attr("d", "M0,0 L0,1");

        edgeHandle.append("text")
            .attr("x",0)
            .attr("y",15)
            .text("click to set");

        Edge.move(edgeHandle, Node.getHandleByStateId(transition.fromState.id), Node.getHandleByStateId(transition.toState.id));
    }

    static addToEdge(edge: EdgeHandleSelection, transition: Transition){
        Edge.transitionIdToEdgeId[transition.id] = edge.datum().id;
        edge.datum().transitionID.push(transition.id);
        edge.classed("bigger", true);
    }
    
    static move(edge: EdgeHandleSelection, fromNode: NodeHandleSelection, toNode: NodeHandleSelection){
        let x1 = fromNode.datum().x;
        let y1 = fromNode.datum().y;
        let x2 = toNode.datum().x;
        let y2 = toNode.datum().y;
        
        if(x1 === x2 && y1 === y2) {
            this.drawEdgeOnePoint(edge, x1, y1);
        } else {
            this.drawEdgeTwoPoints(edge, x1, y1, x2, y2);
        }
    }

    static drawEdgeTwoPoints(edge: EdgeHandleSelection, x1: number, y1: number, x2: number, y2: number){
        let len = Helpers.distance2({ x: x1, y: y1 }, { x: x2, y: y2 }) - Graph.sizeNode;
        let angle = 180 * Helpers.angleToXAxis({ x: x1, y: y1 }, { x: x2, y: y2 }) / Math.PI;
        

        let xText = (len + Graph.sizeNode)/2;
        let yText = - 5;

        if(true){
            edge.select("path").attr("d",
                "M" + Graph.sizeNode + "," + 0 +
                " L" + (len) + "," + 0);    //7 is for size of marker
            edge.select("rect").attr("width", Math.abs(len - Graph.sizeNode));
        }else{
            let c = Math.min(40 * len / 200, 100); //courbature controller
            let y = -2;

            edge.select("path").attr("d",
                "M" + Graph.sizeNode + "," + y +
                "C" + (Graph.sizeNode + c) + "," + (y - c / 2) + " "
                + (len - 7 - c) + "," + (y - c / 2) + " "
                + (len - 7) + "," + y);    //7 is for size of marker
            edge.select("rect").attr("width", len - Graph.sizeNode);

            xText = (len) / 2 + Graph.sizeNode;
            yText = (y + 3 * (y - c / 2)) / 4 - 5;
        }
        
        edge.select("text")
            .attr("x", xText)
            .attr("y",    yText); //5 offset text
        if (angle > 90 || angle < -90) {
            edge.select("text")
                .attr("transform", "rotate(180," + xText + "," + yText + ") " +
                                                                            "translate(0, 9)");
        } else {
            edge.select("text").attr("transform", "")
        }

        edge.attr("transform", "rotate(" + angle + "," + (x1) + "," + (y1) + ")" + " translate(" + (x1) + "," + (y1) + ")");
    }

    static drawEdgeOnePoint(edge: EdgeHandleSelection, x: number, y: number){
        let r = Graph.sizeNode;

        let firstYOffset = 50;
        let secondYOffset = 75;
        let xOffset = 20;

        let c = 12; //courbature control

        let startX = r * Math.sin(0.1);
        let startY = r * Math.cos(0.1);
        let finalX = -1 * (r + 7) * Math.sin(0.1);//7 is for size of marker
        let finalY = (r + 7) * Math.cos(0.1) ;
        
        edge.select("path").attr("d", 
            "M" + startX + "," + startY + 
            " C " + startX + "," + startY + "," + xOffset + "," + (r + firstYOffset - c) + " " + xOffset + "," + (r + firstYOffset) + 
            " C" + xOffset + "," + (r + firstYOffset + c) + " " + c + "," + (r + secondYOffset) + " 0," + (r + secondYOffset) + 
            " C" + "-" + c + "," + (r + secondYOffset) + " " + (-1 * xOffset) + "," + (r + firstYOffset + c) + " " + (-1 * xOffset) + ","    + (r + firstYOffset) + 
            " C" + (-1 * xOffset) + "," + (r + firstYOffset - c) + " " + finalX + "," + finalY + " " + finalX + "," + finalY)
            .style("fill", "none"); 
        
        edge.select("rect").attr("x", -xOffset).attr("y", r).attr("width", 2*xOffset).attr("height", (20 + secondYOffset)).style("fill","red");

        edge.select("text").attr("x", 0).attr("y", r + secondYOffset + 18);

        edge.attr("transform",    " translate(" + (x) + "," + (y) + ")");
    }

    static delete(transitionId:TransitionID, edge: EdgeHandleSelection): void{
        delete Edge.transitionIdToEdgeId[transitionId];
        let index = edge.datum().transitionID.indexOf[transitionId];
        edge.datum().transitionID.splice(index, 1);
        edge.classed("bigger", edge.datum().transitionID.length == 1);
        if(edge.datum().transitionID.length === 0){
            edge.remove();
        }
    }

    static isAnEdge(selection: d3.Selection<any, any, any, any>): boolean{
        if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
            if(d3.select("#" + selection.datum()["id"]).classed("edge")){
                return true;
            }
        }
        return false;
    }

    static getHandle(selection: EdgeElementSelection): EdgeHandleSelection{
        var edge: EdgeHandleSelection;
        if(selection.datum() !== undefined && selection.datum()["id"] !== undefined){
            edge = d3.select("#" + selection.datum()["id"])
            if(edge.classed("edge")){
                return edge
            }
        }
        throw "Graph.ts (getEdgeHandle): Selection is not part of a edge"
    }

    static getHandleByTransitionId(transitionID: TransitionID): EdgeHandleSelection {
        if(Edge.transitionIdToEdgeId.hasOwnProperty(transitionID)){
            return d3.select("#" + Edge.transitionIdToEdgeId[transitionID]);
        }
        throw "No matching edge for the transition id"
    }

    static drawText(edge: EdgeHandleSelection, onSymbol: TapeSymbol, outputSymbol: TapeSymbol, headAction:HeadAction): void{
        let actionAsString = "";
        switch (headAction) {
            case HeadAction.MoveLeft:
                actionAsString = "◀";
                break;

            case HeadAction.MoveRight:
                actionAsString = "▶";
                break;

            case HeadAction.None:
                actionAsString = "▽";
                break;

            default:
                actionAsString = "<unknown action>";
                break;
        }

        let extraText = (edge.datum().transitionID.length > 1)? " ..." : "";
        edge.select("text")
            .text(function (d) { return "R:" + onSymbol + "/W:" + outputSymbol + "/D:" + actionAsString + extraText});
    }
}
