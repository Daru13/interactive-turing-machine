"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const Transition_1 = require("./Transition");
const EventManager_1 = require("../events/EventManager");
const NewStateEvent_1 = require("../events/NewStateEvent");
const DeleteStateEvent_1 = require("../events/DeleteStateEvent");
const NewTransitionEvent_1 = require("../events/NewTransitionEvent");
const DeleteTransitionEvent_1 = require("../events/DeleteTransitionEvent");
const EditInitialStateEvent_1 = require("../events/EditInitialStateEvent");
const NewCurrentStateEvent_1 = require("../events/NewCurrentStateEvent");
const NO_INITIAL_STATE_ID = -1;
class StateMachine {
    constructor() {
        this.states = new Map();
        this.transitions = new Map();
        this.currentState = null;
        this.initialState = null;
    }
    addState(state) {
        if (this.states.has(state.id)) {
            console.error("The state could not be added: already added.");
            return;
        }
        this.states.set(state.id, state);
        EventManager_1.EventManager.emit(new NewStateEvent_1.NewStateEvent(state));
    }
    createAndAddState(position, label, final = false) {
        let state = new State_1.State(position, label, final);
        this.addState(state);
        return state;
    }
    hasState(id) {
        return this.states.has(id);
    }
    getState(id) {
        return this.hasState(id) ? this.states.get(id) : null;
    }
    getStates() {
        return [...this.states.values()];
    }
    removeState(id) {
        let state = this.states.get(id);
        state.getInTransitions().forEach((t) => { this.removeTransition(t.id); });
        state.getOutTransitions().forEach((t) => { this.removeTransition(t.id); });
        this.states.delete(id);
        EventManager_1.EventManager.emit(new DeleteStateEvent_1.DeleteStateEvent(state));
    }
    removeAllStates() {
        for (let id of this.states.keys()) {
            this.removeState(id);
        }
    }
    getInitialState() {
        return this.initialState;
    }
    getCurrentState() {
        return this.currentState;
    }
    setInitialState(id) {
        if (!this.hasState(id)) {
            console.error("The state could not be set as initial: unknown state.");
            return;
        }
        this.resetInitialState();
        this.initialState = this.states.get(id);
        EventManager_1.EventManager.emit(new EditInitialStateEvent_1.EditInitialStateEvent(this.initialState, true));
    }
    resetInitialState() {
        if (this.initialState === null) {
            return;
        }
        let currentInitialState = this.initialState;
        this.initialState = null;
        EventManager_1.EventManager.emit(new EditInitialStateEvent_1.EditInitialStateEvent(currentInitialState, false));
    }
    setCurrentState(id) {
        if (!this.hasState(id)) {
            console.error("The state could not be set as current: unknown state.");
            return;
        }
        this.currentState = this.states.get(id);
        EventManager_1.EventManager.emit(new NewCurrentStateEvent_1.NewCurrentStateEvent(this.currentState));
    }
    resetCurrentState() {
        this.currentState = null;
        EventManager_1.EventManager.emit(new NewCurrentStateEvent_1.NewCurrentStateEvent(this.currentState));
    }
    addTransition(transition) {
        let origin = transition.origin;
        let destination = transition.destination;
        if (!(this.hasState(origin.id) && this.hasState(destination.id))) {
            console.error("The transition could not be added: unknown origin or destination state.");
            return;
        }
        if (this.transitions.has(transition.id)) {
            console.error("The transition could not be added: already added.");
            return;
        }
        destination.addInTransition(transition);
        origin.addOutTransition(transition);
        this.transitions.set(transition.id, transition);
        EventManager_1.EventManager.emit(new NewTransitionEvent_1.NewTransitionEvent(transition));
    }
    hasTransition(id) {
        return this.transitions.has(id);
    }
    hasTransitionBetween(state1, state2) {
        return state1.hasOutTransitionTo(state2)
            || state2.hasOutTransitionTo(state1);
    }
    getTransition(id) {
        return this.transitions.has(id) ? this.transitions.get(id) : null;
    }
    getTransitions() {
        return [...this.transitions.values()];
    }
    removeTransition(id) {
        if (!this.transitions.has(id)) {
            console.error("The transition could not be removed: unknown transition.");
            return;
        }
        let transition = this.transitions.get(id);
        this.transitions.delete(id);
        transition.destination.removeInTransition(transition);
        transition.origin.removeOutTransition(transition);
        EventManager_1.EventManager.emit(new DeleteTransitionEvent_1.DeleteTransitionEvent(transition));
    }
    removeAllTransitions() {
        for (let id of this.transitions.keys()) {
            this.removeTransition(id);
        }
    }
    getNonDeterministicTransitions() {
        let nonDeterministicTransitions = [];
        for (let state of this.states.values()) {
            nonDeterministicTransitions.push(...state.getNonDeterministicOutTransitions());
        }
        return nonDeterministicTransitions;
    }
    isDeterministic() {
        for (let state of this.states.values()) {
            if (!state.isDeterministic()) {
                return false;
            }
        }
        return true;
    }
    getStatesAsString(useLabels = true) {
        return [...this.states.values()]
            .map((s) => s.toString(useLabels))
            .reduce((str, s) => str + "\n" + s, "");
    }
    getTransitionsAsString(useLabels = true) {
        return [...this.states.values()]
            .map((s) => s.outTransitionsToString(useLabels))
            .reduce((str, t) => str + "\n\n" + t, "");
    }
    toString(useLabels = true) {
        let str = "";
        for (let state of this.states.values()) {
            str += state.toString(useLabels);
            if (this.currentState === state) {
                str += " (current)";
            }
            if (this.initialState === state) {
                str += " (init)";
            }
            str += state.outTransitionsToString(useLabels);
            str += "\n\n";
        }
        return str;
    }
    export() {
        let exportedStates = [...this.states.values()].map((s) => s.export());
        let exportedTransitions = [...this.transitions.values()].map((t) => t.export());
        let initialStateID = this.initialState === null ? NO_INITIAL_STATE_ID : this.initialState.id;
        return {
            states: exportedStates,
            transitions: exportedTransitions,
            initialStateID: initialStateID
        };
    }
    static fromExport(stateMachineExport) {
        let stateMachine = new StateMachine();
        for (let stateExport of stateMachineExport.states) {
            let state = State_1.State.fromExport(stateExport);
            stateMachine.addState(state);
        }
        for (let transitionExport of stateMachineExport.transitions) {
            let transition = Transition_1.Transition.fromExport(transitionExport, stateMachine.states);
            stateMachine.addTransition(transition);
        }
        if (stateMachineExport.initialStateID !== NO_INITIAL_STATE_ID) {
            stateMachine.setInitialState(stateMachineExport.initialStateID);
        }
        return stateMachine;
    }
}
exports.StateMachine = StateMachine;
//# sourceMappingURL=StateMachine.js.map