import { Graph, GraphDatum } from "../Graph";
import * as d3 from "d3-selection";
import { State, StateID } from "../../../model/State";
import { addLamp } from "../../CustomShape/lamps";
import { Node } from "./Node";
import { NonDeterministicError } from "../../../errors/NonDeterministicError";
import { ErrorPopup } from "../../editors/ErrorPopUp";

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
        this.addHoverInteraction();
    }

    static isStateNode(selection: d3.Selection<any, any, any, any>): boolean {
        if(Node.isNode(selection)){
            if(Node.getNode(selection) instanceof StateNode){
                return true
            }
        }
        return false;
    }

    static getStateNode(selection: d3.Selection<any, any, any, any>): StateNode {
        if (Node.isNode(selection)) {
            let node = Node.getNode(selection)
            if (node instanceof StateNode) {
                return node
            }
        }
        throw "StateNode.ts (getStateNode): Selection is not part of a stateNode";
    }

    isInitialState(): boolean {
        return this.handleSelection.classed("start");
    }

    setInitialState(isInital: boolean) {
        this.handleSelection.classed("start", isInital);
    }

    setFinalState(isFinal: boolean) {
        this.handleSelection.classed("final", isFinal);
    }

    static resetCurrentNode() {
        d3.selectAll(".current").classed("current", false);
    }

    setCurrentNode() {
        StateNode.resetCurrentNode();
        this.handleSelection.classed("current", true);
    }

    setLabel(label: string) {
        let textToDisplay = label;
        if (textToDisplay.length > 10) {
            textToDisplay = textToDisplay.substring(0, 7) + "..."
        }
        this.handleSelection.select("#Text").select("text").text(textToDisplay);
    }

    invalidate(){
        super.invalidate();
        this.graph.turingMachine.stateMachine.getState(this.stateID).getNonDeterministicOutTransitions().forEach((t) => {
            this.graph.transitionIdToTransitionEdge.get(t.id).invalidate();
        })
    }

    validate() {
        super.validate();
        this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions().forEach((t) => {
            this.graph.transitionIdToTransitionEdge.get(t.id).validate();
        })
    }

    updateValidateProperty(){
        if(this.graph.turingMachine.stateMachine.getState(this.stateID).isDeterministic()){
            this.validate();
        } else {
            this.invalidate();
        }
    }

    addHoverInteraction(){
        /*let popup = null;
        this.handleSelection.on("mouseover", () => {
            if(this.handleSelection.classed("not-valid") && popup === null){
                let tM = this.graph.turingMachine;
                let state = tM.stateMachine.getState(this.stateID);
                let transitions = state.getNonDeterministicOutTransitions();
                popup = new ErrorPopup(new NonDeterministicError(tM, state, transitions));
            }
        })

        this.handleSelection.on("mouseleave", () => {
            if (popup !== null) {
                popup.close();
                popup = null;
            }
        })*/
    }
}