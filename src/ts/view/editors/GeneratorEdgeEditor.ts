import * as d3 from "d3-selection";
import { HeadAction } from "../../model/Tape";
import { StateMachine } from "../../model/StateMachine";
import { TransitionID } from "../../model/Transition";
import { Editor } from "./Editor";
import { GeneratorEdge } from "../graph/Edge/GeneratorEdge";

export class GeneratorEdgeEditor extends Editor {
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    edge: GeneratorEdge;
    stateMachine: StateMachine;

    constructor(edge: GeneratorEdge, stateMachine: StateMachine) {
        super(edge);
        this.edge = edge;
        this.stateMachine = stateMachine;

        this.holder.classed("generator-edge-editor", true);

        this.initContent();
    }

    initContent(): void {
        this.addButton("Delete", () => {
            this.close();
        }, "delete-generator-edge-button")
    }
}
