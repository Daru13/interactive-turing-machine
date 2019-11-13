import { DeleteStateAction } from "../actions/DeleteStateAction";
import { TuringMachine } from "../../model/TuringMachine";
import { Editor } from "./Editor";
import { StateNode } from "../graph/nodes/StateNode";

/**
 * A class to create an editor for a state node
 */
export class NodeEditor extends Editor{
    /** The state node to edit */
    node: StateNode;
    /** The Turing machine containing the state associated to node */
    turingMachine: TuringMachine;

    constructor(node: StateNode, turingMachine: TuringMachine) {
        super(node);

        this.node = node;
        this.turingMachine = turingMachine;

        this.init();
    }

    /**
     * Inits node editor
     */
    init(): void {
        // Editor-specific class
        this.holder.classed("node-editor", true);

        // Popup title
        this.setTitle("Edit state");

        this.initContent();
        super.setOnClose(() => {
            let label = (this.content.select("#node-set-label-field").node() as HTMLInputElement).value;
            this.turingMachine.stateMachine.getState(this.node.stateID).setLabel(label);
        });
        this.initPosition();
    }

    /**
     * Inits content of the node editor
     */
    initContent(): void {
        let self = this;

        this.addLabel("Label", "node-set-label-field");
        this.addTextField(this.turingMachine.stateMachine.getState(this.node.stateID).getLabel(), {
            id: "node-set-label-field",
            placeholder:  "Label of the node"
        });

        this.addLabel("Final state", "node-set-final-button");
        this.addButton("",  () => {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            let newFinalState = !state.isFinal();
            state.setFinal(newFinalState);

            this.updateFinalButton(newFinalState);
        }, "node-set-final-button");
        this.updateFinalButton();

        this.addLabel("Delete", "node-delete-button");
        this.addButton("Delete", () => { this.deleteNode(); }, "node-delete-button");
    }

    /**
     * Updates the final property of the node
     * @param stateIsFinal final property of the node
     */
    private updateFinalButton(stateIsFinal?: boolean): void {
        if (stateIsFinal === undefined) {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            stateIsFinal = state.isFinal();
        }
        
        this.content.select("#node-set-final-button")
            .text(stateIsFinal ? "Turn off" : "Turn on");
    }

    /**
     * Deletes the node and close the editor
     */
    deleteNode(): void {
        DeleteStateAction.do(this.node, this.turingMachine);
        this.setOnClose(() => { });
        super.close();
    }
}
