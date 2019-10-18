import * as d3 from "d3-selection";
import { EventManager } from "../../events/EventManager";
import { Node } from "./Node/Node"
import { NewStateEvent } from "../../events/NewStateEvent";
import { DeleteStateEvent } from "../../events/DeleteStateEvent";
import { NewTransitionEvent } from "../../events/NewTransitionEvent";
import { DeleteTransitionEvent } from "../../events/DeleteTransitionEvent";
import { EditTransitionEvent } from "../../events/EditTransitionEvent";
import { EditInitialStateEvent } from "../../events/EditInitialStateEvent";
import { EditFinalStateEvent } from "../../events/EditFinalStateEvent";
import { TuringMachine } from "../../model/TuringMachine";
import { NewCurrentStateEvent } from "../../events/NewCurrentStateEvent";
import { EditStateEvent } from "../../events/EditStateEvent";
import { Generator } from "./Node/GeneratorNode";
import { TransitionEdge } from "./Edge/TransitionEdge";
import { TransitionID } from "../../model/Transition";

export interface GraphDatum {};
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, {}>;

export class Graph {
    static sizeNode: number = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--node-size'));
    turingMachine: TuringMachine;
    svg: GraphSelection;
    transitionIdToTransitionEdge: Map<TransitionID, TransitionEdge>;

    constructor(turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        this.transitionIdToTransitionEdge = new Map();
        this.init()
    }

    init(){
        this.svg = d3.select("#graph").append("svg");
        
        new Generator(this);
        this.svg.append("g").attr("id", "edges");
        this.svg.append("g").attr("id", "nodes");

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
        var thisGraph = this;
        EventManager.registerHandler("newState", function(e: NewStateEvent) {
            Node.add(thisGraph, e.state);
        })

        EventManager.registerHandler("editInitialState", function (e: EditInitialStateEvent) {
            Node.setInitialState(Node.getHandleByStateId(e.state.id), e.isInitial);
        })

        EventManager.registerHandler("newCurrentState", function (e: NewCurrentStateEvent) {
            if(e.state === null){
                Node.resetCurrentNode();
            }else{
                Node.setCurrentNode(Node.getHandleByStateId(e.state.id));
            }
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
                        let transitionEdge = thisGraph.transitionIdToTransitionEdge.get(t.id);
                        transitionEdge.addTransitionToEdge(e.transition);
                        thisGraph.transitionIdToTransitionEdge.set(e.transition.id, transitionEdge);
                        added = true;
                        return;
                    }
                });
                if(!added){
                    let newTransitionEdge = new TransitionEdge(thisGraph, e.transition);
                    thisGraph.transitionIdToTransitionEdge.set(e.transition.id, newTransitionEdge);
                    console.log(thisGraph.transitionIdToTransitionEdge)
                }
        })

        EventManager.registerHandler("deleteTransition", function(e: DeleteTransitionEvent) {
            thisGraph.transitionIdToTransitionEdge.get(e.transition.id).deleteTransitionEdge(e.transition.id);
            thisGraph.transitionIdToTransitionEdge.delete(e.transition.id)
        })

        EventManager.registerHandler("editTransition", function (e: EditTransitionEvent) {
            thisGraph.transitionIdToTransitionEdge.get(e.transition.id)
                .drawTransitionText(
                    e.transition.getOnSymbol(),
                    e.transition.getOutputSymbol(),
                    e.transition.getHeadAction());
        })
    }
}
