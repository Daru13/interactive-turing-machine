import { Graph } from "../Graph";
import * as d3 from "d3-selection";
import { Transition, TransitionID } from "../../../model/Transition";
import { Helpers } from "../../../helpers";
import { HeadAction, TapeSymbol } from "../../../model/Tape";
import { Edge } from "./Edge";
import { StateNode } from "../nodes/StateNode";

export class TransitionEdge extends Edge {
    readonly transitionIDs: TransitionID[];
    fromStateNode: StateNode;
    toStateNode: StateNode;
    isCurved: boolean;
    graph: Graph;

    constructor(graph: Graph, transition: Transition, isCurved: boolean) {
        super(graph);

        this.transitionIDs = [transition.id];    
        this.fromStateNode = graph.stateIdToStateNode.get(transition.fromState.id);
        this.toStateNode = graph.stateIdToStateNode.get(transition.toState.id);
        this.isCurved = isCurved;
        this.graph = graph;
        this.initTransitionEdge(transition);
     }

    initTransitionEdge(transition: Transition): void {
         super.init();

         this.handleSelection.classed("transition-edge", true);
         this.redrawTransitionEdge();
         this.drawTransitionText(transition.getOnSymbol(), transition.getOutputSymbol(), transition.getHeadAction());
     }

    addTransitionToEdge(transition: Transition): void {
        this.transitionIDs.push(transition.id);
        this.handleSelection.classed("bigger", true);
    }

    redrawTransitionEdge(): void {
        let pt1 = { x: this.fromStateNode.x, y: this.fromStateNode.y };
        let pt2 = { x: this.toStateNode.x, y: this.toStateNode.y };
        let dx, dy;

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

    deleteTransitionEdge(transitionId: TransitionID): void {
        let index = this.transitionIDs.indexOf(transitionId);
        this.transitionIDs.splice(index, 1);
        this.handleSelection.classed("bigger", this.transitionIDs.length !== 1);
        if (this.transitionIDs.length === 0) {
            this.delete();
        }
    }

    static isTransitionEdge(selection: d3.Selection<any, any, any, any>): boolean {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof TransitionEdge;
    }

    static getTransitionEdge(selection: d3.Selection<any, any, any, any>): TransitionEdge {
        if (TransitionEdge.isTransitionEdge(selection)) {
            return selection.datum()["edge"];
        }
        
    }

    drawTransitionText(onSymbol: TapeSymbol, outputSymbol: TapeSymbol, headAction: HeadAction): void {
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
        this.redrawText((onSymbol === "" ? "" : ("\u{1F4D6} " + onSymbol + " "))
                      + (outputSymbol === "" ? "" : ("\u{1F4DD} " + outputSymbol + " "))
                      + ("\u{1F9ED} " + headActionSymbol)
                      + extraTransitionsSymbol);
    }

    setCurved(b: boolean): void {
        this.isCurved = b;
    }
}
