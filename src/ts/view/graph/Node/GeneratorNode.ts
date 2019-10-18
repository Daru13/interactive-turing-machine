import { Graph, GraphDatum } from "../Graph";
import { addGenerator } from "../../CustomShape/generator";
import * as d3 from "d3-selection";

export interface GeneratorDatum {
    x: number;
    y: number;
    id: string;
};

export type GeneratorHandleSelection = d3.Selection<SVGGElement, GeneratorDatum, HTMLElement, GraphDatum>;

export class Generator{
    graph: Graph;
    handle: d3.Selection<SVGGElement, any, any, any>;

    constructor(graph: Graph){
        this.graph = graph;
        this.init();
    }

    init(): void{
        let bbox = this.graph.getSVGElement().getBoundingClientRect();
        let datum = { x: Graph.sizeNode, y: bbox.height / 2, id: "generator"}

        this.handle = 
            this.graph.getSVG()
                .append("g")
                    .datum(datum)
                    .attr("id", "generator")
        
        addGenerator(this.handle, Graph.sizeNode);
        this.handle.selectAll("*").datum(datum);

        this.handle
            .attr("transform", function(d){return "translate(" + (d.x) + "," + (d.y) + ")"});
    }

    static isGenerator(selection: d3.Selection<any, any, any, any>): boolean {
        if (selection.datum() !== undefined && selection.datum()["id"] !== undefined) {
            if (selection.datum()["id"] === "generator") {
                return true;
            }
        }
        return false;
    }

    static getGeneratorHandle(selection: d3.Selection<any, any, any, any>): GeneratorHandleSelection {
        if (selection.datum() !== undefined && selection.datum()["id"] !== undefined) {
            if (selection.datum()["id"] === "generator") {
                return d3.select("#" + selection.datum()["id"]);
            }
        }
        throw "Graph.ts (getGeneratorHandle): Selection is not part of a generator";
    }
}