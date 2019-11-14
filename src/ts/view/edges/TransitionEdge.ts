import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { Transition, TransitionID } from "../../model/Transition";
import { Helpers } from "../../helpers";
import { HeadAction, TapeSymbol } from "../../model/Tape";
import { Edge } from "./Edge";
import { StateNode } from "../nodes/StateNode";

/**
 * A class to reprensent every transitions between two states of the turing machine as an edge in the graph
 */
export class TransitionEdge extends Edge {
    /** List of transition ids reprensented by this edge */
    readonly transitionIDs: TransitionID[];
    /** The state from where the edge is comming from */
    originNode: StateNode;
    /** The state where the edge is going */
    destinationNode: StateNode;
    /** Is the edge curved */
    isCurved: boolean;
    /** The graph containing the edge */
    graph: Graph;

    constructor(graph: Graph, transition: Transition, isCurved: boolean) {
        super(graph);

        this.transitionIDs = [transition.id];    
        this.originNode = graph.stateIdToStateNode.get(transition.origin.id);
        this.destinationNode = graph.stateIdToStateNode.get(transition.destination.id);
        this.isCurved = isCurved;
        this.graph = graph;
        this.initTransitionEdge(transition);
     }

    /**
     * Inits the transition edge
     * @param transition first transition represented by the edge
     */
    initTransitionEdge(transition: Transition): void {
         super.init();

         this.handleSelection.classed("transition-edge", true);
         this.redrawTransitionEdge();
         this.drawTransitionText(transition.getInputSymbol(), transition.getOutputSymbol(), transition.getHeadAction());
     }

    /**
     * Adds a transition to the edge
     * @param transition transitions to add
     */
    addTransitionToEdge(transition: Transition): void {
        this.transitionIDs.push(transition.id);
        this.handleSelection.classed("bigger", true);
    }

    /**
     * Redraws the transition edge
     */
    redrawTransitionEdge(): void {
        let pt1 = { x: this.originNode.x, y: this.originNode.y };
        let pt2 = { x: this.destinationNode.x, y: this.destinationNode.y };
        let dx, dy;

        //case where the edge is going from and to the same point
        if (pt1.x === pt2.x && pt1.y === pt2.y) {
            let flipped = pt1.y < this.graph.viewBox.y + this.graph.viewBox.height / 2;

            dx = 0;
            dy = (flipped) ? -Graph.sizeNode : Graph.sizeNode;

            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt1.x + dx, y: pt1.y + dy }, false, flipped);
        } else {
            let angle = Helpers.angleToXAxis(pt1, pt2);
            dx = Math.cos(angle) * Graph.sizeNode;
            dy = Math.sin(angle) * Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, this.isCurved);
        }
    }

    /**
     * Removes a transition from the edge. If there is no more transition between the originNode and destinationNode, the edge is deleted
     * @param transitionId 
     */
    deleteTransitionEdge(transitionId: TransitionID): void {
        let index = this.transitionIDs.indexOf(transitionId);
        this.transitionIDs.splice(index, 1);
        this.handleSelection.classed("bigger", this.transitionIDs.length !== 1);
        if (this.transitionIDs.length === 0) {
            this.delete();
        }
    }

    /**
     * Determines whether a d3 selection is a transition edge
     * @param selection d3 selection to test
     * @returns true if selection is a transition edge 
     */
    static isTransitionEdge(selection: d3.Selection<any, any, any, any>): boolean {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof TransitionEdge;
    }

    /**
     * Gets the transition edge containing the selection
     * @param selection d3 selection of an element of a transition edge
     * @returns the transition edge containing the selection
     */
    static getTransitionEdge(selection: d3.Selection<any, any, any, any>): TransitionEdge {
        if (TransitionEdge.isTransitionEdge(selection)) {
            return selection.datum()["edge"];
        }
        
    }

    /**
     * Draws the text of the last modified transition represented by the edge
     * @param inputSymbol input symbol of the transition
     * @param outputSymbol output symbol of the transition
     * @param headAction head action of the transition
     */
    drawTransitionText(inputSymbol: TapeSymbol, outputSymbol: TapeSymbol, headAction: HeadAction): void {
        let headActionSymbol = "";
        switch (headAction) {
            case HeadAction.MoveLeft:
                headActionSymbol = "←";
                break;

            case HeadAction.MoveRight:
                headActionSymbol = "→";
                break;

            case HeadAction.None:
                headActionSymbol = "∅";
                break;
        }

        let extraTransitionsSymbol = (this.transitionIDs.length > 1) ? " ..." : "";
        this.redrawText((inputSymbol === "" ? "" : ("\u{1F4D6} " + inputSymbol + " "))
                      + (outputSymbol === "" ? "" : ("\u{1F4DD} " + outputSymbol + " "))
                      + ("\u{1F9ED} " + headActionSymbol)
                      + extraTransitionsSymbol);
    }

    /**
     * Sets the curved property of the edge
     * @param b 
     */
    setCurved(b: boolean): void {
        this.isCurved = b;
    }
}
