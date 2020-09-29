"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const EventManager_1 = require("../events/EventManager");
const GeneratorNode_1 = require("./nodes/GeneratorNode");
const TransitionEdge_1 = require("./edges/TransitionEdge");
const State_1 = require("../model/State");
const StateNode_1 = require("./nodes/StateNode");
const GeneratorEdge_1 = require("./edges/GeneratorEdge");
class Graph {
    constructor(turingMachine) {
        this.turingMachine = turingMachine;
        this.transitionIdToTransitionEdge = new Map();
        this.stateIdToStateNode = new Map();
        this.eventsHandlers = {};
        this.setupUI();
        this.setupListeners();
        this.setResetViewBoxButton();
        this.init();
    }
    init() {
        let stateMachine = this.turingMachine.stateMachine;
        stateMachine.getStates().forEach((state) => {
            this.addNode(state);
            if (state.isFinal()) {
                this.editFinalNode(state, true);
            }
        });
        stateMachine.getTransitions().forEach((transition) => {
            this.addEdge(transition);
        });
        let initialState = stateMachine.getInitialState();
        if (initialState instanceof State_1.State) {
            this.editInitialNode(initialState, true);
        }
        let currentNode = stateMachine.getCurrentState();
        if (currentNode instanceof State_1.State) {
            this.newCurrentNode(currentNode);
        }
    }
    setupUI() {
        d3.select("#graph").selectAll("*:not(#toolbar)").remove();
        this.svg = d3.select("#graph").append("svg");
        let bbox = this.svg.node().getBoundingClientRect();
        this.viewBox = { x: 0, y: 0, width: bbox.width, height: bbox.height };
        this.updateViewBox();
        this.svg.append("g").attr("id", "edges");
        this.svg.append("g").attr("id", "nodes");
        this.generator = new GeneratorNode_1.GeneratorNode(this);
    }
    getSVGElement() {
        return this.svg.node();
    }
    getSVG() {
        return this.svg;
    }
    getNodesGroup() {
        return this.svg.select("#nodes");
    }
    getEdgesGroup() {
        return this.svg.select("#edges");
    }
    setResetViewBoxButton() {
        d3.select("#graph").append("button").attr("id", "reset-viewbox-graph-button").on("click", () => {
            this.viewBox.x = 0;
            this.viewBox.y = 0;
            this.updateViewBox();
        });
    }
    updateViewBox() {
        this.svg.attr("viewBox", `${this.viewBox.x},${this.viewBox.y}, ${this.viewBox.width}, ${this.viewBox.height}`);
    }
    translateViewBoxBy(dx, dy) {
        this.viewBox.x -= dx;
        this.viewBox.y -= dy;
        this.updateViewBox();
    }
    scaleViewBoxTo(width, height) {
        this.viewBox.width = width;
        this.viewBox.height = height;
        this.updateViewBox();
    }
    addNode(state) {
        this.stateIdToStateNode.set(state.id, new StateNode_1.StateNode(this, state));
    }
    editInitialNode(state, isInitial) {
        let node = this.stateIdToStateNode.get(state.id);
        node.setInitialNode(isInitial);
        console.log(node, isInitial);
        if (isInitial) {
            this.generatorEdge = new GeneratorEdge_1.GeneratorEdge(this, this.generator, node);
        }
        else {
            if (this.generatorEdge !== undefined) {
                this.generatorEdge.delete();
            }
        }
        if (this.turingMachine.stateMachine.getInitialState() === null) {
            this.generator.invalidate();
        }
        else {
            this.generator.validate();
        }
    }
    newCurrentNode(state) {
        if (state === null) {
            StateNode_1.StateNode.resetCurrentNode();
        }
        else {
            this.stateIdToStateNode.get(state.id).setCurrentNode();
        }
    }
    editFinalNode(state, isFinal) {
        this.stateIdToStateNode.get(state.id).setFinalNode(isFinal);
    }
    editNode(state) {
        this.stateIdToStateNode.get(state.id).setLabel(state.getLabel());
    }
    deleteNode(state) {
        let node = this.stateIdToStateNode.get(state.id);
        if (node.isInitialNode()) {
            this.generatorEdge.delete();
        }
        node.delete();
    }
    moveNode(state, x, y) {
        let node = this.stateIdToStateNode.get(state.id);
        node.translateTo(x, y);
    }
    setEdgeCurved(transition) {
        if (transition.origin === transition.destination) {
            return;
        }
        let sm = this.turingMachine.stateMachine;
        let isCurved = transition.origin.hasOutTransitionTo(transition.destination)
            && transition.destination.hasOutTransitionTo(transition.origin);
        this.transitionIdToTransitionEdge.get(transition.id).setCurved(isCurved);
        this.transitionIdToTransitionEdge.get(transition.id).redrawTransitionEdge();
        let oppositeTransitions = transition.destination.getOutTransitionsTo(transition.origin);
        if (oppositeTransitions.length > 0) {
            let transitionEdge = this.transitionIdToTransitionEdge.get(oppositeTransitions[0].id);
            transitionEdge.setCurved(isCurved);
            transitionEdge.redrawTransitionEdge();
        }
    }
    addEdge(transition) {
        let stateMachine = this.turingMachine.stateMachine;
        let transitionEdge;
        let transitions = transition.origin.getOutTransitionsTo(transition.destination);
        if (transitions.length > 1) {
            if (transitions[0].id !== transition.id) {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[0].id);
            }
            else {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[1].id);
            }
            if (transitionEdge !== undefined && transitionEdge !== null) {
                transitionEdge.addTransitionToEdge(transition);
            }
            else {
                transitionEdge = new TransitionEdge_1.TransitionEdge(this, transition, false);
            }
        }
        else {
            transitionEdge = new TransitionEdge_1.TransitionEdge(this, transition, false);
        }
        this.transitionIdToTransitionEdge.set(transition.id, transitionEdge);
        this.setEdgeCurved(transition);
        this.stateIdToStateNode.get(transition.origin.id).updateValidateProperty();
    }
    deleteEdge(transition) {
        let transitionEdge = this.transitionIdToTransitionEdge.get(transition.id);
        this.setEdgeCurved(transition);
        this.stateIdToStateNode.get(transition.origin.id).updateValidateProperty();
        transitionEdge.deleteTransitionEdge(transition.id);
        this.transitionIdToTransitionEdge.delete(transition.id);
    }
    editEdge(transition) {
        this.transitionIdToTransitionEdge.get(transition.id)
            .drawTransitionText(transition.getInputSymbol(), transition.getOutputSymbol(), transition.getHeadAction());
        this.stateIdToStateNode.get(transition.origin.id).updateValidateProperty();
    }
    setupListeners() {
        this.eventsHandlers["newState"] = ((e) => {
            this.addNode(e.state);
        });
        EventManager_1.EventManager.registerHandler("newState", this.eventsHandlers["newState"]);
        this.eventsHandlers["editInitialState"] = ((e) => {
            this.editInitialNode(e.state, e.isFirstInitialState);
        });
        EventManager_1.EventManager.registerHandler("editInitialState", this.eventsHandlers["editInitialState"]);
        this.eventsHandlers["newCurrentState"] = (e) => {
            this.newCurrentNode(e.state);
        };
        EventManager_1.EventManager.registerHandler("newCurrentState", this.eventsHandlers["newCurrentState"]);
        this.eventsHandlers["editFinalState"] = ((e) => {
            this.editFinalNode(e.state, e.isFinal);
        });
        EventManager_1.EventManager.registerHandler("editFinalState", this.eventsHandlers["editFinalState"]);
        this.eventsHandlers["editState"] = ((e) => {
            this.editNode(e.state);
        });
        EventManager_1.EventManager.registerHandler("editState", this.eventsHandlers["editState"]);
        this.eventsHandlers["deleteState"] = ((e) => {
            this.deleteNode(e.state);
        });
        EventManager_1.EventManager.registerHandler("deleteState", this.eventsHandlers["deleteState"]);
        this.eventsHandlers["moveState"] = ((e) => {
            this.moveNode(e.state, e.position.x, e.position.y);
        });
        EventManager_1.EventManager.registerHandler("moveState", this.eventsHandlers["moveState"]);
        this.eventsHandlers["newTransition"] = ((e) => {
            this.addEdge(e.transition);
        });
        EventManager_1.EventManager.registerHandler("newTransition", this.eventsHandlers["newTransition"]);
        this.eventsHandlers["deleteTransition"] = ((e) => {
            this.deleteEdge(e.transition);
        });
        EventManager_1.EventManager.registerHandler("deleteTransition", this.eventsHandlers["deleteTransition"]);
        this.eventsHandlers["editTransition"] = ((e) => {
            this.editEdge(e.transition);
        });
        EventManager_1.EventManager.registerHandler("editTransition", this.eventsHandlers["editTransition"]);
    }
    resize() {
        let svgBoundingBox = this.svg.node().getBoundingClientRect();
        this.scaleViewBoxTo(svgBoundingBox.width, svgBoundingBox.height);
    }
    removeHandler() {
        for (let eventId of Object.keys(this.eventsHandlers)) {
            EventManager_1.EventManager.unregisterHandler(eventId, this.eventsHandlers[eventId]);
        }
    }
}
exports.Graph = Graph;
Graph.sizeNode = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--node-size'));
//# sourceMappingURL=Graph.js.map