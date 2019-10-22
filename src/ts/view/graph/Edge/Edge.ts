import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { Helpers } from "../../../helpers";

export type EdgeId = String;

export interface EdgeDatum {
    edge: Edge;
};

export type EdgeSelection = d3.Selection<SVGGElement, EdgeDatum, any, any>;

export abstract class Edge{
    static edgeNumber = 0;
    id: string;
    handleSelection: d3.Selection<SVGGElement, any, any, any>

    constructor(graph: Graph){
        this.id = "edge-" + Edge.edgeNumber;

        Edge.edgeNumber += 1;

        this.handleSelection = 
            graph.getEdgesGroup()
                .append("g")
                .datum({edge: this})
                .attr("id", this.id)
                .classed("edge", true);
    }

    init(){
        this.handleSelection
            .append("rect")
            .attr("x", 0)
            .attr("y", -25)
            .attr("width", 1)
            .attr("height", 50);

        this.handleSelection.append("path").attr("d", "M0,0 L0,1");

        this.handleSelection.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .text("");
    }

    protected redraw(pt1: { x: number, y: number }, pt2: { x: number, y: number }, curved: boolean = false, flipped = false){
        if(pt1.x == pt2.x && pt1.y == pt2.y){
            console.log("self edge drawn")
            this.redrawBetweenOnePoint(pt1, flipped);
        } else {
            this.redawBetweenTwoPoints(pt1, pt2, curved);
        }
    }

    private redawBetweenTwoPoints(pt1: { x: number, y: number }, pt2: { x: number, y: number }, curved: boolean = false){
        let len = Helpers.distance2(pt1, pt2);
        let angle = 180 * Helpers.angleToXAxis(pt1, pt2) / Math.PI;
        let xText = len/2;
        let yText = - 5;

        if(!curved){
            this.handleSelection
                .select("path")
                    .attr("d",
                        "M0,0" +
                        " L" + (len).toString() + ",0");
        }else{
            let c = Math.min(40 * len / 200, 100); //courbature controller
            let y = -2;

            this.handleSelection
                .select("path")
                    .attr("d",
                    "M" + 0 + "," + y +
                    "C" + (c) + "," + (y - c / 2) + " "
                    + (len - c) + "," + (y - c / 2) + " "
                    + (len) + "," + y); 
            
            xText = (len) / 2;
            yText = (y + 3 * (y - c / 2)) / 4 - 5;
        }
        
        this.handleSelection.select("text")
            .attr("x", xText)
            .attr("y",    yText);

        if (angle > 90 || angle < -90) {
            this.handleSelection.select("text")
                .attr("transform", "rotate(180," + xText + "," + yText + ") " +
                                              "translate(0, 9)");
        } else {
            this.handleSelection.select("text").attr("transform", "")
        }

        this.handleSelection
            .select("rect")
            .attr("y", yText - 20)
            .attr("width", len)
            .attr("height", Math.abs(yText - 20) + 5);

        this.handleSelection
            .attr("transform", "rotate(" + angle + "," + (pt1.x) + "," + (pt1.y) + ")" + " translate(" + (pt1.x) + "," + (pt1.y) + ")");
    }

    private redrawBetweenOnePoint(pt: { x: number, y: number }, flipped){
        let firstYOffset: number = (flipped)? -50 : 50;
        let secondYOffset = (flipped) ? - 75 : 75;
        let xOffset = (flipped) ? -20: 20;

        let c = (flipped) ? -12 : 12; //courbature control

        let startX = 0;
        let startY = 0;
        let finalX = 0;
        let finalY = 0;
        
        this.handleSelection
            .select("path").attr("d", 
                "M" + startX + "," + startY + 
                " C " + startX + "," + startY + "," + xOffset + "," + (firstYOffset - c) + " " + xOffset + "," + (firstYOffset) + 
                " C" + xOffset + "," + (firstYOffset + c) + " " + c + "," + (secondYOffset) + " 0," + (secondYOffset) + 
                " C" + "" + (-1 * c) + "," + (secondYOffset) + " " + (-1 * xOffset) + "," + (firstYOffset + c) + " " + (-1 * xOffset) + ","    + (firstYOffset) + 
                " C" + (-1 * xOffset) + "," + (firstYOffset - c) + " " + finalX + "," + finalY + " " + finalX + "," + finalY)
            .style("fill", "none"); 
        
        this.handleSelection.select("rect")
            .attr("x", -Math.abs(xOffset))
            .attr("y", Math.min(0, secondYOffset - 20))
            .attr("width", Math.abs(2*xOffset))
            .attr("height", (20 + Math.abs(secondYOffset)))
            .style("fill","red");

        this.handleSelection.select("text")
            .attr("x", 0)
            .attr("y", (flipped) ? secondYOffset -2 : secondYOffset + 18);

        this.handleSelection.attr("transform",    " translate(" + (pt.x) + "," + (pt.y) + ")");
    }

    protected redrawText(text: string): void {
        this.handleSelection.select("text").text(text);
    }

    delete(): void{
        this.handleSelection.remove();
    }

    static isEdge(selection: d3.Selection<any, any, any, any>): boolean{
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined;
    }

    static getEdge(selection: d3.Selection<any, any, any, any>): Edge{
        if(Edge.isEdge(selection)){
            return selection.datum()["edge"];
        }
        throw "Graph.ts (getEdge): Selection is not part of a edge"
    }
}
