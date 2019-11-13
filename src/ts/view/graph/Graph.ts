import * as d3 from "d3-selection";
import { EventManager, EventHandler, EventID } from "../../events/EventManager";
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
import { GeneratorNode } from "./nodes/GeneratorNode";
import { TransitionEdge } from "./edges/TransitionEdge";
import { TransitionID, Transition } from "../../model/Transition";
import { StateID, State, Position } from "../../model/State";
import { StateNode } from "./nodes/StateNode";
import { GeneratorEdge } from "./edges/GeneratorEdge";
import { moveStateEvent } from "../../events/MoveStateEvent";

export interface GraphDatum { }
export type GraphSelection = d3.Selection<SVGElement, GraphDatum, HTMLElement, { }>;

/**
 * A class to create a graph which is the visualization of a state machine
 */
export class Graph {
    /** Size of the node in the graph */
    static sizeNode: number = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--node-size'));
    /** Turing machine containing the state machine represented by this graph */
    turingMachine: TuringMachine;
    /** d3 selection of the svg containing the nodes and edges */
    svg: GraphSelection;
    /** view box porperty of the svg */
    viewBox: { x: number, y: number, width: number, height: number };
    /** Map of transition ID from the state machine to the transition edge in the graph */
    transitionIdToTransitionEdge: Map<TransitionID, TransitionEdge>;
    /** Map of state ID from the state machine to the state node in the graph */
    stateIdToStateNode: Map<StateID, StateNode>;
    /** Generator Node of the graph */
    generator: GeneratorNode;
    /** Generator edge comming from the generator */
    generatorEdge: GeneratorEdge;
    /** event handlers for events emitted by the state machine */
    eventsHandlers: Record<EventID, (EventHandler<any>)>;

    constructor(turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
        this.transitionIdToTransitionEdge = new Map();
        this.stateIdToStateNode = new Map();
        this.eventsHandlers = { };
        this.setupUI();
        this.setupListeners();
        this.setResetViewBoxButton();
        this.init();
    }

    /**
     * Inits the graph by creating a node for every state in the turing machine and an edge for every transition
     */
    init(): void {
        let stateMachine = this.turingMachine.stateMachine;
        stateMachine.getStates().forEach((state: State) => {
            this.addNode(state);
            if (state.isFinal()) {
                this.editFinalNode(state, true);
            }
        });

        stateMachine.getTransitions().forEach((transition: Transition) => {
            this.addEdge(transition);
        });

        let initialState = stateMachine.getInitialState();
        if (initialState instanceof State) {
            this.editInitialNode(initialState, true);
        }
        
        let currentNode = stateMachine.getCurrentState();
        if (currentNode instanceof State) {
            this.newCurrentNode(currentNode);
        }
    }

    /**
     * Setups the UI by creating a group for the edge and one for the node
     */
    setupUI(): void {
        d3.select("#graph").selectAll("*").remove();
        this.svg = d3.select("#graph").append("svg");

        let bbox = this.svg.node().getBoundingClientRect();
        this.viewBox = { x: 0, y: 0, width: bbox.width, height: bbox.height };
        this.updateViewBox();

        this.svg.append("g").attr("id", "edges");
        this.svg.append("g").attr("id", "nodes");

        this.generator = new GeneratorNode(this);
    }

    /**
     * Gets the svg
     * @returns svg
     */
    getSVGElement(): SVGSVGElement {
        return this.svg.node() as SVGSVGElement;
    }

    /**
     * Gets the d3 selection of the svg
     * @returns d3 selection of the svg 
     */
    getSVG(): GraphSelection {
        return this.svg;
    }

    /**
     * Gets the group containing the nodes
     * @returns the group containing the nodes
     */
    getNodesGroup(): d3.Selection<SVGGElement, any, any, any> {
        return this.svg.select("#nodes");
    }

    /**
     * Gets the group containing the edges
     * @returns the group containing the edges
     */
    getEdgesGroup(): d3.Selection<SVGGElement, any, any, any> {
        return this.svg.select("#edges");
    }

    /**
     * Sets the reset viewBox button
     */
    setResetViewBoxButton(): void {
        d3.select("#graph").append("button").attr("id", "reset-viewbox-graph-button").on("click", () => {
            this.viewBox.x = 0;
            this.viewBox.y = 0;
            this.updateViewBox();
        });
    }

    /**
     * Updates the view box of the svg
     */
    updateViewBox(): void {
        this.svg.attr("viewBox", `${this.viewBox.x},${this.viewBox.y}, ${this.viewBox.width}, ${this.viewBox.height}`);
    }

    /**
     * Translates the view box by dx and dy
     * @param dx 
     * @param dy 
     */
    translateViewBoxBy(dx: number, dy: number): void {
        this.viewBox.x -= dx;
        this.viewBox.y -= dy;
        this.updateViewBox();
    }

    /**
     * Scales the view box to width and height
     * @param width 
     * @param height 
     */
    scaleViewBoxTo(width: number, height: number): void {
        this.viewBox.width = width;
        this.viewBox.height = height;
        this.updateViewBox();
    }

    /**
     * Adds a state node in the graph
     * @param state state to get the node from
     */
    addNode(state: State): void {
        this.stateIdToStateNode.set(state.id, new StateNode(this, state));
    }

    /**
     * Edits the initial property of a node
     * @param state state to get the node from
     * @param isInitial 
     */
    editInitialNode(state: State, isInitial: boolean): void {
        let node = this.stateIdToStateNode.get(state.id);
        node.setInitialNode(isInitial);
        if (isInitial) {
            this.generatorEdge = new GeneratorEdge(this, this.generator, node);
        } else {
            if (this.generatorEdge !== undefined) {
                this.generatorEdge.delete();
            }
        }
        if (this.turingMachine.stateMachine.getInitialState() === null) {
            this.generator.invalidate();
        } else {
            this.generator.validate();
        }
    }

    /**
     * Sets the current node
     * @param state state to get the node from
     */
    newCurrentNode(state: State): void {
        if (state === null) {
            StateNode.resetCurrentNode();
        } else {
            this.stateIdToStateNode.get(state.id).setCurrentNode();
        }
    }

    /**
     * Edits the final property of a node
     * @param state state to get the node from
     * @param isFinal 
     */
    editFinalNode(state: State, isFinal: boolean): void {
        this.stateIdToStateNode.get(state.id).setFinalNode(isFinal);
    }

    /**
     * Edits the label of a node
     * @param state state to get the node and the label from
     */
    editNode(state: State): void {
        this.stateIdToStateNode.get(state.id).setLabel(state.getLabel());
    }
    
    /**
     * Deletes a node
     * @param state state to get the node from
     */
    deleteNode(state: State): void {
        let node = this.stateIdToStateNode.get(state.id);
        if (node.isInitialNode()) {
            this.generatorEdge.delete();
        }
        node.delete();
    }

    /**
     * Moves a node to x and y
     * @param state state to get the node from
     * @param x 
     * @param y 
     */
    moveNode(state: State, x: number, y: number): void {
        let node = this.stateIdToStateNode.get(state.id);
        node.translateTo(x, y);
    }

    /**
     * Sets the curved property of an edge to true if for two nodes A and B, there is an edge from A to B and one from B to A
     * @param transition transition to get the edge from
     */
    setEdgeCurved(transition: Transition): void {
        if (transition.fromState === transition.toState) {
            return;
        }

        let sm = this.turingMachine.stateMachine;
        let isCurved = transition.fromState.hasOutTransitionTo(transition.toState)
                    && transition.toState.hasOutTransitionTo(transition.fromState);

        this.transitionIdToTransitionEdge.get(transition.id).setCurved(isCurved);
        this.transitionIdToTransitionEdge.get(transition.id).redrawTransitionEdge();

        let oppositeTransitions = transition.toState.getOutTransitionsTo(transition.fromState);
        if (oppositeTransitions.length > 0) {
            let transitionEdge = this.transitionIdToTransitionEdge.get(oppositeTransitions[0].id);
            transitionEdge.setCurved(isCurved);
            transitionEdge.redrawTransitionEdge();
        }
    }

    /**
     * from a transition from state A to state B, adds the transition to the edge from node A to B or creates a new edge if there is no edge from A to B
     * @param transition
     */
    addEdge(transition: Transition): void {
        let stateMachine = this.turingMachine.stateMachine;
        let transitionEdge;
        let transitions = transition.fromState.getOutTransitionsTo(transition.toState);

        if (transitions.length > 1) {
            if (transitions[0].id !== transition.id) {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[0].id);
            } else {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[1].id);
            }
            //if there was already an edge, adds the transition to it
            if (transitionEdge !== undefined && transitionEdge !== null) {
                transitionEdge.addTransitionToEdge(transition);
            } else { //else create a new one
                transitionEdge = new TransitionEdge(this, transition, false);
            }
            
        } else {
            transitionEdge = new TransitionEdge(this, transition, false);
        }

        this.transitionIdToTransitionEdge.set(transition.id, transitionEdge);
        this.setEdgeCurved(transition);
        this.stateIdToStateNode.get(transition.fromState.id).updateValidateProperty();
    }

    /**
     * Deletes a transition from an edge
     * @param transition 
     */
    deleteEdge(transition: Transition): void {
        let transitionEdge = this.transitionIdToTransitionEdge.get(transition.id);

        this.setEdgeCurved(transition);
        this.stateIdToStateNode.get(transition.fromState.id).updateValidateProperty();

        transitionEdge.deleteTransitionEdge(transition.id);
        this.transitionIdToTransitionEdge.delete(transition.id);
    }

    /**
     * Edits the text displayed on the edge
     * @param transition 
     */
    editEdge(transition: Transition): void {
        this.transitionIdToTransitionEdge.get(transition.id)
            .drawTransitionText(
                transition.getOnSymbol(),
                transition.getOutputSymbol(),
                transition.getHeadAction());
        
        this.stateIdToStateNode.get(transition.fromState.id).updateValidateProperty();
    }

    /**
     * Setups the listeners for events from the state machine
     */
    setupListeners(): void {
        //New state
        this.eventsHandlers["newState"] = ((e: NewStateEvent) => {
            this.addNode(e.state);
        });
        EventManager.registerHandler("newState", this.eventsHandlers["newState"]);

        //edit initial state
        this.eventsHandlers["editInitialState"] = ((e: EditInitialStateEvent) => {
            this.editInitialNode(e.state, e.isFirstInitialState);
        });
        EventManager.registerHandler("editInitialState", this.eventsHandlers["editInitialState"]);

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
        });
        EventManager.registerHandler("deleteState", this.eventsHandlers["deleteState"]);

        //move state 
        this.eventsHandlers["moveState"] = ((e: moveStateEvent) => {
            this.moveNode(e.state, e.position.x, e.position.y);
        });
        EventManager.registerHandler("moveState", this.eventsHandlers["moveState"]);

        //new transition
        this.eventsHandlers["newTransition"] = ((e: NewTransitionEvent) => {
            this.addEdge(e.transition);
        });
        EventManager.registerHandler("newTransition", this.eventsHandlers["newTransition"]);

        //delete transition
        this.eventsHandlers["deleteTransition"] = ((e: DeleteTransitionEvent) => {
            this.deleteEdge(e.transition);
        });
        EventManager.registerHandler("deleteTransition", this.eventsHandlers["deleteTransition"]);

        //edit transition
        this.eventsHandlers["editTransition"] = ((e: EditTransitionEvent) => {
            this.editEdge(e.transition);
        });
        EventManager.registerHandler("editTransition", this.eventsHandlers["editTransition"]);
    }

    /**
     * Scale the viewBox of the svg to the bouding box of the svg
     */
    resize(): void {
        let svgBoundingBox = this.svg.node().getBoundingClientRect();
        this.scaleViewBoxTo(svgBoundingBox.width, svgBoundingBox.height);
    }

    /**
     * Removes event handlers
     */
    removeHandler(): void {
        for (let eventId of Object.keys(this.eventsHandlers)) {
            EventManager.unregisterHandler(eventId, this.eventsHandlers[eventId]);
        }
    }
}
