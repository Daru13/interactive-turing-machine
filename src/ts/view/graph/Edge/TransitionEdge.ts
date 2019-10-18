import { Graph, GraphDatum } from "../Graph";
import * as d3 from "d3-selection";
import { Node, NodeHandleSelection } from "../Node/Node";
import { Transition, TransitionID } from "../../../model/Transition";
import { Helpers } from "../../../helpers";
import { HeadAction, TapeSymbol } from "../../../model/Tape";
import { Edge, EdgeId, EdgeSelection } from "./Edge";

export class TransitionEdge extends Edge {
    readonly transitionIDs: TransitionID[];

    constructor(graph: Graph, transition: Transition) {
        super(graph);

        this.transitionIDs = [transition.id];    
        this.initTransitionEdge(transition);
     }

     initTransitionEdge(transition: Transition){
         super.init();

         this.handleSelection.classed("transition-edge", true);

         let fromNode = Node.getHandleByStateId(transition.fromState.id);
         let toNode = Node.getHandleByStateId(transition.toState.id);
         this.redrawTransitionEdge(fromNode, toNode);
     }

    addTransitionToEdge (transition: Transition) {
        this.transitionIDs.push(transition.id);
        this.handleSelection.classed("bigger", true);
    }

    redrawTransitionEdge(fromNode: NodeHandleSelection, toNode: NodeHandleSelection, curved: boolean = false) {
        let pt1 = { x: fromNode.datum().x, y: fromNode.datum().y };
        let pt2 = { x: toNode.datum().x, y: toNode.datum().y }
        let dx, dy;

        if (pt1.x == pt2.x && pt1.y == pt2.y) {
            dx = 0;
            dy = Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt1.x + dx, y: pt1.y + dy }, curved);
        } else {
            let angle = Helpers.angleToXAxis(pt1, pt2);
            dx = Math.cos(angle) * Graph.sizeNode;
            dy = Math.sin(angle) * Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, curved);
        }
    }

    deleteTransitionEdge(transitionId: TransitionID): void {
        let index = this.transitionIDs.indexOf[transitionId];

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
        if(TransitionEdge.isTransitionEdge(selection)){
            return selection.datum()["edge"];
        }
        
    }

    drawTransitionText(onSymbol: TapeSymbol, outputSymbol: TapeSymbol, headAction: HeadAction): void {
        let actionAsString = "";
        switch (headAction) {
            case HeadAction.MoveLeft:
                actionAsString = "⬅️";
                break;

            case HeadAction.MoveRight:
                actionAsString = "➡️";
                break;

            case HeadAction.None:
                actionAsString = "⬇️";
                break;

            default:
                actionAsString = "<unknown action>";
                break;
        }

        let extraText = (this.transitionIDs.length > 1) ? " ..." : "";
        this.redrawText(`📖:${onSymbol}, 📝:${outputSymbol}, ${actionAsString} ${extraText}`);
    }
}
