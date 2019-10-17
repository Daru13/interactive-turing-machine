import { Graph } from "./Graph";
import { addGenerator } from "../CustomShape/generator";

export class Generator{
    graph: Graph;
    handle: d3.Selection<SVGGElement, any, any, any>;

    constructor(graph: Graph){
        this.graph = graph;
        this.init();
    }

    init(): void{
        let bbox = this.graph.getSVGElement().getBoundingClientRect();
        this.handle = 
            this.graph.getSVG()
                .append("g")
                    .attr("id", "generator")
        
        addGenerator(this.handle, Graph.sizeNode);
        this.handle.attr("transform", "translate(" + (Graph.sizeNode) + "," + (bbox.height / 2) + ")")
    }
}