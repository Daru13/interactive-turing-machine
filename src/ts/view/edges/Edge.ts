import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { Helpers, Selection } from "../../helpers";


export type EdgeId = String;

/**
 * Data in the DOM link to the Element Edge.
 */
export interface EdgeDatum {
    edge: Edge;
}

export type EdgeSelection = d3.Selection<SVGGElement, EdgeDatum, any, any>;

/**
 * An abstract class to define an edge.
 */
export abstract class Edge{
    /** Number of edge created. */
    static edgeNumber: number = 0;
    /** id of the edge. */
    id: string;
    /** d3 selection of the svg group classed as an edge. */
    handleSelection: EdgeSelection;

    constructor(graph: Graph) {
        this.id = "edge-" + Edge.edgeNumber;

        Edge.edgeNumber += 1;

        this.handleSelection = 
            graph.getEdgesGroup()
                .append("g")
                .datum({ edge: this})
                .attr("id", this.id)
                .classed("edge", true);
    }

    /**
     * Inits the edge by creating the svg group with a path, a text and a rectangle. The rectangle is the hit box of the edge.
     */
    init(): void {
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

    /**
     * Redraws the edge between two points.
     * @param pt1 point where the edge comes from.
     * @param pt2 point where the goes to.
     * @param curved if pt1 !== pt2 the edge can be curved with this boolean .
     * @param flipped if pt1 === pt2, the edge can be either above (flipped = true) or under the point.
     */
    protected redraw(pt1: { x: number, y: number }, pt2: { x: number, y: number }, curved: boolean = false, flipped: boolean = false): void {
        if (pt1.x === pt2.x && pt1.y === pt2.y) {
            this.redrawBetweenOnePoint(pt1, flipped);
        } else {
            this.redawBetweenTwoPoints(pt1, pt2, curved);
        }
    }

    /**
     * Redaws the edge between two different points.
     * @param pt1 point where the edge comes from.
     * @param pt2 point where the goes to.
     * @param curved if true, the edge will be a curve, if false the edge is a line.
     */
    private redawBetweenTwoPoints(pt1: { x: number, y: number }, pt2: { x: number, y: number }, curved: boolean = false): void {
        let len = Helpers.distance2(pt1, pt2); //length of the edge
        let angle = 180 * Helpers.angleToXAxis(pt1, pt2) / Math.PI; //angle of the edge with the x axis
        let xText = len / 2; //x position of the text
        let yText = - 5; //y position of the text

        // drawn as a line
        if (!curved) {
            this.handleSelection
                .select("path")
                    .attr("d",
                        "M0,0" +
                        " L" + (len).toString() + ",0");
        }
        // drawn as a curve
        else {
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
            .attr("y", yText);

        //flipped the text so that it is never bottom up
        if (angle > 90 || angle < -90) {
            this.handleSelection.select("text")
                .attr("transform", "rotate(180," + xText + "," + yText + ") " +
                                              "translate(0, 9)");
        } else {
            this.handleSelection.select("text").attr("transform", "");
        }

        // update the hit box of the edge
        this.handleSelection
            .select("rect")
            .attr("y", yText - 20)
            .attr("width", len)
            .attr("height", Math.abs(yText - 20) + 5);

        // place the edge between the two points
        this.handleSelection
            .attr("transform", "rotate(" + angle + "," + (pt1.x) + "," + (pt1.y) + ")" + " translate(" + (pt1.x) + "," + (pt1.y) + ")");
    }

    /**
     * Redraws the edge on one point.
     * @param pt point where the edge will be drawn.
     * @param flipped if true the edge is above the pt, if false the edge is under the pt.
     */
    private redrawBetweenOnePoint(pt: { x: number, y: number }, flipped: boolean): void {
        let firstYOffset: number = (flipped) ? -50 : 50;
        let secondYOffset = (flipped) ? - 75 : 75;
        let xOffset = (flipped) ? -20 : 20;

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
            .attr("width", Math.abs(2 * xOffset))
            .attr("height", (20 + Math.abs(secondYOffset)))
            .style("fill", "red");

        this.handleSelection.select("text")
            .attr("x", 0)
            .attr("y", (flipped) ? secondYOffset - 2 : secondYOffset + 18);

        this.handleSelection.attr("transform", " translate(" + (pt.x) + "," + (pt.y) + ")");
    }

    /**
     * Redraws the text of the edge.
     * @param text text to draw.
     */
    protected redrawText(text: string): void {
        this.handleSelection.select("text").text(text);
    }

    /**
     * Deletes the edge.
     */
    delete(): void {
        this.handleSelection.remove();
    }

    /**
     * Classs the edge as valid.
     */
    validate(): void  {
        this.handleSelection.classed("not-valid", false);
    }

    /**
     * Classs the edge as invalid.
     */
    invalidate(): void  {
        this.handleSelection.classed("not-valid", true);
    }

    /**
     * Determines whether a d3 selection is an edge or not.
     * @param selection the d3 selection to test.
     * @returns true if is the d3 selection is an edge.
     */
    static isEdge(selection: Selection<any>): boolean {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined;
    }

    /**
     * Gets the edge containing the selection.
     * @param selection selection of an element of an edge.
     * @returns the group classed as an edge containing the selection.
     */
    static getEdge(selection: Selection<any>): Edge {
        if (Edge.isEdge(selection)) {
            return selection.datum()["edge"];
        }
        throw "Edge.ts (getEdge): Selection is not part of a edge";
    }
}
