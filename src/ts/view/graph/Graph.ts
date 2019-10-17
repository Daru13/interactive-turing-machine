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
import { NewCurrentStateEvent } from "../../events/NewCurrentStateEvent";
import { EditStateEvent } from "../../events/EditStateEvent";
import { Generator } from "./Generator";

export interface GraphDatum {};
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, {}>;

export class Graph {
    svg: GraphSelection;
    static sizeNode: number = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--node-size'));
    turingMachine: TuringMachine;

    constructor(turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        this.init()
    }

    init(){
        this.svg = d3.select("#graph").append("svg");
        this.svg.append("g").attr("id", "edges");
        this.svg.append("g").attr("id", "nodes");

        new Generator(this);

        this.setupListeners();
    }

    getSVGElement(): SVGSVGElement{
        return this.svg.node() as SVGSVGElement;
    }

    getSVG(): GraphSelection{
        return this.svg;
    }

    getNodesGroup(): d3.Selection<SVGGElement, any, any, any>{
        return this.svg.select("#nodes");
    }

    getEdgesGroup(): d3.Selection<SVGGElement, any, any, any> {
        return this.svg.select("#edges");
    }

    setupListeners(){
        var t = this;
        EventManager.registerHandler("newState", function(e: NewStateEvent) {
            Node.add(t, e.state);
        })

        EventManager.registerHandler("editInitialState", function (e: EditInitialStateEvent) {
            Node.setInitialState(Node.getHandleByStateId(e.state.id), e.isInitial);
        })

        EventManager.registerHandler("newCurrentState", function (e: NewCurrentStateEvent) {
            Node.setCurrentNode(Node.getHandleByStateId(e.state.id));
        })

        EventManager.registerHandler("editFinalState", function (e: EditFinalStateEvent) {
            Node.setFinalState(Node.getHandleByStateId(e.state.id), e.isFinal);
        })

        EventManager.registerHandler("editState", function (e: EditStateEvent) {
            Node.setLabel(Node.getHandleByStateId(e.state.id), e.state.getLabel());
        })

        EventManager.registerHandler("deleteState", function(e: DeleteStateEvent) {
            Node.delete(Node.getHandleByStateId(e.state.id));
        })

        EventManager.registerHandler("newTransition", function(e: NewTransitionEvent) {
                let added = false;
                e.transition.fromState.getOutTransitions().forEach(t => {
                    if(t.toState === e.transition.toState && t.id !== e.transition.id && !added){
                        Edge.addToEdge(Edge.getHandleByTransitionId(t.id), e.transition);
                        added = true;
                        return;
                    }
                });
                if(!added){
                    Edge.addNewEdge(t, e.transition);
                }
        })

        EventManager.registerHandler("deleteTransition", function(e: DeleteTransitionEvent) {
            Edge.delete(e.transition.id, Edge.getHandleByTransitionId(e.transition.id));
        })

        EventManager.registerHandler("editTransition", function (e: EditTransitionEvent) {
            Edge.drawText(Edge.getHandleByTransitionId(e.transition.id),
                                        e.transition.getOnSymbol(),
                                        e.transition.getOutputSymbol(),
                                        e.transition.getHeadAction());
        })
    }
}
