import * as d3 from "d3-selection";
import { EventManager, Event, EventHandler, EventID } from "../../events/EventManager";
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
import { GeneratorNode } from "./Node/GeneratorNode";
import { TransitionEdge } from "./Edge/TransitionEdge";
import { TransitionID, Transition } from "../../model/Transition";
import { StateID, State } from "../../model/State";
import { StateNode } from "./Node/StateNode";
import { GeneratorEdge } from "./Edge/GeneratorEdge";

export interface GraphDatum {};
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, {}>;

export class Graph {
    static sizeNode: number = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--node-size'));
    turingMachine: TuringMachine;
    svg: GraphSelection;
    transitionIdToTransitionEdge: Map<TransitionID, TransitionEdge>;
    stateIdToStateNode: Map<StateID, StateNode>;
    generator: GeneratorNode;
    generatorEdge: GeneratorEdge;
    viewBox: {x,y,width,height};
    eventsHandlers: Record<EventID, (EventHandler<any>)>;
    windowHandler: ()=>void;

    constructor(turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        this.transitionIdToTransitionEdge = new Map();
        this.stateIdToStateNode = new Map();
        this.eventsHandlers = {};
        this.setupUI();
        this.setupListeners();
        this.setResetViewBoxButton();
        this.init()
    }

    init(){
        let stateMachine = this.turingMachine.stateMachine;
        stateMachine.getStates().forEach((state: State) => {
            this.addNode(state);
        })

        stateMachine.getTransitions().forEach((transition: Transition) => {
            this.addEdge(transition);
        })

        let initialState = stateMachine.getInitialState();
        if(initialState instanceof State){
            this.editInitialNode(initialState, true);
        }
        
        let currentNode = stateMachine.getCurrentState();
        if (currentNode instanceof State) {
            this.newCurrentNode(currentNode);
        }
    }

    setupUI(){
        d3.select("#graph").selectAll("*").remove();
        this.svg = d3.select("#graph").append("svg");

        let bbox = this.svg.node().getBoundingClientRect();
        this.viewBox = { x: 0, y: 0, width: bbox.width, height: bbox.height };
        this.updateViewBox();

        this.svg.append("g").attr("id", "edges");
        this.svg.append("g").attr("id", "nodes");

        this.generator = new GeneratorNode(this);
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

    setResetViewBoxButton(){
        d3.select("#graph").append("button").attr("id", "reset-viewbox-graph-button").on("click", () => {
            this.viewBox.x = 0;
            this.viewBox.y = 0;
            this.updateViewBox();
        })
    }

    updateViewBox(){
        this.svg.attr("viewBox", `${this.viewBox.x},${this.viewBox.y}, ${this.viewBox.width}, ${this.viewBox.height}`);
    }

    translateViewBoxBy(dx: number, dy: number){
        this.viewBox.x -= dx;
        this.viewBox.y -= dy;
        this.updateViewBox();
    }

    scaleViewBoxTo(width: number, height: number){
        this.viewBox.width = width;
        this.viewBox.height = height;
        this.updateViewBox();
    }

    addNode(state: State){
        this.stateIdToStateNode.set(state.id, new StateNode(this, state));
    }

    editInitialNode(state: State, isInitial: boolean){
        let node = this.stateIdToStateNode.get(state.id);
        node.setInitialState(isInitial);
        if (isInitial) {
            this.generatorEdge = new GeneratorEdge(this, this.generator, node);
        } else {
            if (this.generatorEdge !== undefined) {
                this.generatorEdge.delete()
            }
        }
        if (this.turingMachine.stateMachine.getInitialState() === null) {
            this.generator.invalidate();
        } else {
            this.generator.validate();
        }
    }

    newCurrentNode(state: State){
        if (state === null) {
            StateNode.resetCurrentNode();
        } else {
            this.stateIdToStateNode.get(state.id).setCurrentNode();
        }
    }

    editFinalNode(state: State, isFinal: boolean){
        this.stateIdToStateNode.get(state.id).setFinalState(isFinal);
    }

    editNode(state: State){
        this.stateIdToStateNode.get(state.id).setLabel(state.getLabel());
    }

    deleteNode(state: State){
        let node = this.stateIdToStateNode.get(state.id);
        if (node.isInitialState()) {
            this.generatorEdge.delete();
        }
        node.delete();
    }

    addEdge(transition: Transition){
        let stateMachine = this.turingMachine.stateMachine
        let isCurved = stateMachine
            .hasTransitionFromStateToState(transition.toState, transition.fromState) && transition.fromState !== transition.toState;

        if (isCurved) {
            let transitions = stateMachine.getTransitionsFromStateToState(transition.toState, transition.fromState);
            let transitionEdge = this.transitionIdToTransitionEdge.get(transitions[0].id);
            transitionEdge.setCurved(true);
            transitionEdge.redrawTransitionEdge();
        }

        let transitions = stateMachine.getTransitionsFromStateToState(transition.fromState, transition.toState);
        if (transitions.length > 1) {
            let transitionEdge;
            if (transitions[0].id !== transition.id) {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[0].id);
            } else {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[1].id);
            }

            transitionEdge.addTransitionToEdge(transition);
            this.transitionIdToTransitionEdge.set(transition.id, transitionEdge);
            return;
        }
        let newTransitionEdge = new TransitionEdge(this, transition, isCurved);
        this.transitionIdToTransitionEdge.set(transition.id, newTransitionEdge);
    }

    deleteEdge(transition: Transition){
        let transitionEdge = this.transitionIdToTransitionEdge.get(transition.id)

        if (!this.turingMachine.stateMachine.hasTransitionFromStateToState(transition.fromState, transition.toState)) {
            let transitions = this.turingMachine.stateMachine.getTransitionsFromStateToState(transition.toState, transition.fromState);
            if (transitions.length > 0) {
                let transitionEdge = this.transitionIdToTransitionEdge.get(transitions[0].id);
                transitionEdge.setCurved(false);
                transitionEdge.redrawTransitionEdge();
            }
        }

        transitionEdge.deleteTransitionEdge(transition.id);
        this.transitionIdToTransitionEdge.delete(transition.id)

        if (transition.fromState.isDeterministic()) {
            this.stateIdToStateNode.get(transition.fromState.id).validate();
        } else {
            this.stateIdToStateNode.get(transition.fromState.id).invalidate();
        }
    }

    editEdge(transition: Transition){
        this.transitionIdToTransitionEdge.get(transition.id)
            .drawTransitionText(
                transition.getOnSymbol(),
                transition.getOutputSymbol(),
                transition.getHeadAction());
        if (transition.fromState.isDeterministic()) {
            this.stateIdToStateNode.get(transition.fromState.id).validate();
        } else {
            this.stateIdToStateNode.get(transition.fromState.id).invalidate();
        }
    }

    setupListeners(){
        //New state
        this.eventsHandlers["newState"] = ((e: NewStateEvent) => {
            this.addNode(e.state);
        })
        EventManager.registerHandler("newState", this.eventsHandlers["newState"])

        //edit initial state
        this.eventsHandlers["editInitialState"] = ((e: EditInitialStateEvent) => {
            this.editInitialNode(e.state, e.isInitial);
        });
        EventManager.registerHandler("editInitialState", this.eventsHandlers["editInitialState"])

        //new current state
        this.eventsHandlers["newCurrentState"] = (e: NewCurrentStateEvent) => {
            this.newCurrentNode(e.state);
        };
        EventManager.registerHandler("newCurrentState", this.eventsHandlers["newCurrentState"]);

        //edit final
        this.eventsHandlers["editFinalState"] = ((e: EditFinalStateEvent) => {
            this.editFinalNode(e.state, e.isFinal);
        });
        EventManager.registerHandler("editFinalState", this.eventsHandlers["editFinalState"]);

        //edit state
        this.eventsHandlers["editState"] = ((e: EditStateEvent) => {
            this.editNode(e.state);
        });
        EventManager.registerHandler("editState", this.eventsHandlers["editState"]);

        //delete state
        this.eventsHandlers["deleteState"] = ((e: DeleteStateEvent) => {
            this.deleteNode(e.state);
        })
        EventManager.registerHandler("deleteState", this.eventsHandlers["deleteState"]);

        //new transition
        this.eventsHandlers["newTransition"] = ((e: NewTransitionEvent) => {
            this.addEdge(e.transition);
        })
        EventManager.registerHandler("newTransition", this.eventsHandlers["newTransition"]);

        //delete transition
        this.eventsHandlers["deleteTransition"] = ((e: DeleteTransitionEvent) => {
            this.deleteEdge(e.transition);
        })
        EventManager.registerHandler("deleteTransition", this.eventsHandlers["deleteTransition"]);

        //edit transition
        this.eventsHandlers["editTransition"] = ((e: EditTransitionEvent) => {
            this.editEdge(e.transition);
        })
        EventManager.registerHandler("editTransition", this.eventsHandlers["editTransition"]);

        this.windowHandler = () => {
            let bbox = this.svg.node().getBoundingClientRect();
            this.scaleViewBoxTo(bbox.width, bbox.height);
        };
        window.addEventListener("resize", this.windowHandler);
    }

    removeHandler(){
        for(var eventId of Object.keys(this.eventsHandlers)){
            EventManager.unregisterHandler(eventId, this.eventsHandlers[eventId]);
        }

        window.removeEventListener("resize", this.windowHandler);
    }
}
