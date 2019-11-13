import { StateMachine } from "../../model/StateMachine";
import { Editor } from "./Editor";
import { GeneratorEdge } from "../graph/edges/GeneratorEdge";

/**
 * A class to create an editor for the edge going from the generator to a node
 */
export class GeneratorEdgeEditor extends Editor {
    /** Edge comming from the generator */
    edge: GeneratorEdge;
    /** StateMachine to remove intital state if we delete the edge */
    stateMachine: StateMachine;

    constructor(edge: GeneratorEdge, stateMachine: StateMachine) {
        super(edge);
        this.edge = edge;
        this.stateMachine = stateMachine;

        this.holder.classed("generator-edge-editor", true);

        this.initContent();
        this.initPosition();
    }

    /**
     * Inits content with a delete button
     */
    initContent(): void {
        this.addButton("Delete", () => {
            this.stateMachine.resetInitialState();
            this.close();
        }, "delete-generator-edge-button");
    }
}
