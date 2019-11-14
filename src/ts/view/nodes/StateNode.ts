import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { State, StateID } from "../../model/State";
import { addLamp } from "../custom-shapes/lamps";
import { Node } from "./Node";

/**
 * Possible types of node.
 */
export enum StateNodeType {
    STANDARD = "standard",
    START = "start",
    FINAL = "final"
}

/**
 * A class to represent a state of the turing machine as a node in the graph.
 */
export class StateNode extends Node{
    /** id of the state node. */
    readonly stateID: StateID;

    constructor(graph: Graph, state: State) {
        super(graph);

        this.stateID = state.id;

        this.initStateNode(state);
     }

    /**
     * Inits the state node by adding a lamp (lamp.ts) and creating a falling animation for the node.
     * @param state state represented by the node.
     */
    initStateNode(state: State): void {
        super.init();

        let position = state.getPosition();

        this.handleSelection.classed("state-node", true);

        this.handleSelection.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", Graph.sizeNode + 2)
            .classed("shadow", true);

        addLamp(this.handleSelection, "nodeCircle");

        this.handleSelection.on("animationend", () => {
            this.handleSelection.classed("created", false);
            this.handleSelection.select(".shadow").remove();
        });
        this.handleSelection.classed("created", true);

        this.setLabel(state.getLabel());

        this.translateTo(position.x, position.y);
    }

    /**
     * Determines whether a d3 selection is a state node.
     * @param selection d3 selection to test.
     * @returns true if is a state node.
     */
    static isStateNode(selection: d3.Selection<any, any, any, any>): boolean {
        if (Node.isNode(selection)) {
            if (Node.getNode(selection) instanceof StateNode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the state node containing the d3 selection.
     * @param selection d3 selection of a part of a state node.
     * @returns state node.
     */
    static getStateNode(selection: d3.Selection<any, any, any, any>): StateNode {
        if (Node.isNode(selection)) {
            let node = Node.getNode(selection);
            if (node instanceof StateNode) {
                return node;
            }
        }
        throw "StateNode.ts (getStateNode): Selection is not part of a stateNode";
    }

    /**
     * Determines whether the node is initial.
     * @returns True if is initial.
     */
    isInitialNode(): boolean {
        return this.handleSelection.classed("start");
    }

    /**
     * Sets the node as initial or not.
     * @param isInital If true, set the node as initial. 
     */
    setInitialNode(isInital: boolean): void {
        this.handleSelection.classed("start", isInital);
    }

    /**
     * Sets the node as final or not.
     * @param isFinal If true, set the node as final.
     */
    setFinalNode(isFinal: boolean): void {
        this.handleSelection.classed("final", isFinal);
    }

    /**
     * Reset the current node of the graph.
     */
    static resetCurrentNode(): void {
        d3.selectAll(".current").classed("current", false);
    }

    /**
     * Sets the node as the current node.
     */
    setCurrentNode(): void {
        StateNode.resetCurrentNode();
        this.handleSelection.classed("current", true);
    }

    /**
     * Display the label of the node.
     * @param label label to display.
     */
    setLabel(label: string): void {
        let textToDisplay = label;
        if (textToDisplay.length > 10) {
            textToDisplay = textToDisplay.substring(0, 7) + "...";
        }
        this.handleSelection.select("#label-text").text(textToDisplay);
    }

    /**
     * Invalidates the state node and every edges going from this node.
     */
    invalidate(): void {
        super.invalidate();

        let transitions = this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions();
        let edge;

        if (transitions !== undefined && transitions !== null) {
            transitions.forEach((t) => {
                edge = this.graph.transitionIdToTransitionEdge.get(t.id);
                if (edge !== undefined && edge !== null) {
                    edge.invalidate();
                }
            });
        }
    }

    /**
     * Validates the state node and every edges going from this node.
     */
    validate(): void {
        super.validate();

        let transitions = this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions();
        let edge;
        
        if (transitions !== undefined && transitions !== null) {
            transitions.forEach((t) => {
                edge = this.graph.transitionIdToTransitionEdge.get(t.id);
                if (edge !== undefined && edge !== null) {
                    edge.validate();
                }
            });
        }
    }

    /**
     * Updates if a state node is valid or not. A state node is not valid if the corresponding is not deterministic.
     */
    updateValidateProperty(): void {
        if (this.graph.turingMachine.stateMachine.getState(this.stateID).isDeterministic()) {
            this.validate();
        } else {
            this.invalidate();
        }
    }
}