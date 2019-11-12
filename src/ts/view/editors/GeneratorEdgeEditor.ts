import * as d3 from "d3-selection";
import { StateMachine } from "../../model/StateMachine";
import { Editor } from "./Editor";
import { GeneratorEdge } from "../graph/edges/GeneratorEdge";

export class GeneratorEdgeEditor extends Editor {
    holder: d3.Selection<HTMLDivElement, { }, HTMLElement, any>;
    edge: GeneratorEdge;
    stateMachine: StateMachine;

    constructor(edge: GeneratorEdge, stateMachine: StateMachine) {
        super(edge);
        this.edge = edge;
        this.stateMachine = stateMachine;

        this.holder.classed("generator-edge-editor", true);

        this.initContent();
        this.initPosition();
    }

    initContent(): void {
        this.addButton("Delete", () => {
            this.stateMachine.resetInitialState();
            this.close();
        }, "delete-generator-edge-button");
    }
}
