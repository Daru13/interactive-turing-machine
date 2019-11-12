import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { State, StateID } from "../../../model/State";
import { addLamp } from "../../custom-shapes/lamps";
import { Node } from "./Node";

export enum StateNodeType {
    STANDARD = "standard",
    START = "start",
    FINAL = "final"
}

export class StateNode extends Node{
    readonly stateID: StateID;

    constructor(graph: Graph, state: State) {
        super(graph);

        this.stateID = state.id;

        this.initStateNode(state);
     }

    initStateNode(state: State): void {
        super.init();

        let position = state.getPosition();

        this.handleSelection.classed("state-node", true);

        this.handleSelection.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", Graph.sizeNode + 2)
            .classed("shadow", true);

        addLamp(this.handleSelection, Graph.sizeNode, "nodeCircle");

        this.handleSelection.on("animationend", () => {
            this.handleSelection.classed("created", false);
            this.handleSelection.select(".shadow").remove();
        });
        this.handleSelection.classed("created", true);

        this.setLabel(state.getLabel());

        this.translateTo(position.x, position.y);
    }

    static isStateNode(selection: d3.Selection<any, any, any, any>): boolean {
        if (Node.isNode(selection)) {
            if (Node.getNode(selection) instanceof StateNode) {
                return true;
            }
        }
        return false;
    }

    static getStateNode(selection: d3.Selection<any, any, any, any>): StateNode {
        if (Node.isNode(selection)) {
            let node = Node.getNode(selection);
            if (node instanceof StateNode) {
                return node;
            }
        }
        throw "StateNode.ts (getStateNode): Selection is not part of a stateNode";
    }

    isInitialState(): boolean {
        return this.handleSelection.classed("start");
    }

    setInitialState(isInital: boolean): void {
        this.handleSelection.classed("start", isInital);
    }

    setFinalState(isFinal: boolean): void {
        this.handleSelection.classed("final", isFinal);
    }

    static resetCurrentNode(): void {
        d3.selectAll(".current").classed("current", false);
    }

    setCurrentNode(): void {
        StateNode.resetCurrentNode();
        this.handleSelection.classed("current", true);
    }

    setLabel(label: string): void {
        let textToDisplay = label;
        if (textToDisplay.length > 10) {
            textToDisplay = textToDisplay.substring(0, 7) + "...";
        }
        this.handleSelection.select("#label-text").text(textToDisplay);
    }

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

    updateValidateProperty(): void {
        if (this.graph.turingMachine.stateMachine.getState(this.stateID).isDeterministic()) {
            this.validate();
        } else {
            this.invalidate();
        }
    }
}