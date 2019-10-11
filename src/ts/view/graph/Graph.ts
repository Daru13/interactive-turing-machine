import * as d3 from "d3-selection";
import { EventManager } from "../../events/EventManager";
import { Node, NodeHandleSelection } from "./Node"
import { NewStateEvent } from "../../events/NewStateEvent";
import { DeleteStateEvent } from "../../events/DeleteStateEvent";
import { NewTransitionEvent } from "../../events/NewTransitionEvent";
import { DeleteTransitionEvent } from "../../events/DeleteTransitionEvent";
import { Edge, EdgeHandleSelection } from "./Edge";
import { EditTransitionEvent } from "../../events/EditTransitionEvent";
import { EditInitialStateEvent } from "../../events/EditInitialStateEvent";
import { EditFinalStateEvent } from "../../events/EditFinalStateEvent";
import { TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";

export interface GraphDatum {};
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, {}>;

export class Graph {
    svg: GraphSelection;
    static sizeNode: number = 30;
    turingMachine: TuringMachine;

    constructor(turingMachine: TuringMachine){
        this.svg = d3.select("#graph").append("svg");
        this.turingMachine = turingMachine;
        this.setupListeners()
    }

    getSVGElement(): SVGSVGElement{
        return this.svg.node() as SVGSVGElement;
    }

    getSVG(): GraphSelection{
        return this.svg;
    }

    getTransitionsFromNode(node: NodeHandleSelection): Transition[]{
        let transitions = [];
        this.turingMachine
            .stateMachine.getState(node.datum().stateID)
            .getInTransitions()
            .forEach((t) => transitions.push(t));
        this.turingMachine
            .stateMachine.getState(node.datum().stateID)
            .getOutTransitions()
            .forEach((t) => transitions.push(t));
        return transitions;
    }

    getNodesFromEdges(edge: EdgeHandleSelection): {fromNode:NodeHandleSelection, toNode:NodeHandleSelection}{
        let transition = this.turingMachine.stateMachine.getTransition(edge.datum().transitionID)
        return { fromNode: Node.getHandleByStateId(transition.fromState.id), toNode: Node.getHandleByStateId(transition.toState.id)}
    }

    setupListeners(){
        var t = this;
        EventManager.registerHandler("newState", function(e: NewStateEvent) {
            Node.add(t, e.state);
        })

        EventManager.registerHandler("editInitialState", function (e: EditInitialStateEvent) {
            Node.setInitialState(Node.getHandleByStateId(e.state.id), e.isInitial);
        })

        EventManager.registerHandler("editFinalState", function (e: EditFinalStateEvent) {
            Node.setFinalState(Node.getHandleByStateId(e.state.id), e.isFinal);
        })

        EventManager.registerHandler("deleteState", function(e: DeleteStateEvent) {
            Node.delete(Node.getHandleByStateId(e.state.id));
        })

        EventManager.registerHandler("newTransition", function(e: NewTransitionEvent) {
            Edge.add(t, e.transition);
        })

        EventManager.registerHandler("deleteTransition", function(e: DeleteTransitionEvent) {
            Edge.delete(Edge.getHandleByTransitionId(e.transition.id));
        })

        EventManager.registerHandler("editTransition", function (e: EditTransitionEvent) {
            Edge.drawText(Edge.getHandleByTransitionId(e.transition.id),
                                        e.transition.getOnSymbol(),
                                        e.transition.getOutputSymbol(),
                                        e.transition.getHeadAction());
        })
    }
}
