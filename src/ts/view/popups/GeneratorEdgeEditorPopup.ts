import { StateMachine } from "../../model/StateMachine";
import { Editor } from "./EditorPopup";
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

        this.init();
    }

    /**
     * Initialise the popup properties and its content.
     */
    init(): void {
        this.setTitle("Edge from the generator");
        this.holder.attr("id", "generator-edge-editor");

        this.addButtons();
        this.initPosition();
    }

    /**
     * Add delete and cancel buttons to the popup content.
     */
    addButtons(): void {
        let container = this.content.append("div")
            .classed("action-button-container", true);

        this.addButton("Delete", () => {
            this.stateMachine.resetInitialState();
            this.close();
        }, "", "delete", container);

        this.addButton("Cancel", () => {
            this.close();
        }, "", "cancel", container);
    }
}
