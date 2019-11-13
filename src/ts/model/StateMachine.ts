import { State, StateID, Position, StateExport } from './State';
import { Transition, TransitionID, TransitionExport } from './Transition';
import { EventManager } from "../events/EventManager";
import { NewStateEvent } from "../events/NewStateEvent";
import { DeleteStateEvent } from "../events/DeleteStateEvent";
import { NewTransitionEvent } from "../events/NewTransitionEvent";
import { DeleteTransitionEvent } from "../events/DeleteTransitionEvent";
import { EditInitialStateEvent } from "../events/EditInitialStateEvent";
import { NewCurrentStateEvent } from '../events/NewCurrentStateEvent';
import { transition } from 'd3';

const NO_INITIAL_STATE_ID: StateID = -1;

export interface StateMachineExport {
    states: StateExport[];
    transitions: TransitionExport[];
    initialStateID: StateID;
}

export class StateMachine {

    private states: Map<StateID, State>;
    private transitions: Map<TransitionID, Transition>;

    private initialState: State;
    private currentState: State;


    constructor() {
        this.states = new Map();
        this.transitions = new Map();

        this.currentState = null;
        this.initialState = null;
    }

    addState(state: State): void {
        if (this.states.has(state.id)) {
            console.error("The state could not be added: already added.");
            return;
        }

        this.states.set(state.id, state);

        EventManager.emit(new NewStateEvent(state));
    }

    createAndAddState(position: Position, label: string, final: boolean = false): State {
        let state = new State(position, label, final);
        this.addState(state);

        return state;
    }

    hasState(id: StateID): boolean {
        return this.states.has(id);
    }

    getState(id: StateID): State {
        return this.hasState(id) ? this.states.get(id) : null;
    }

    getStates(): State[] {
        return [...this.states.values()];
    }

    removeState(id: StateID): void {
        let state = this.states.get(id);

        // Remove in and out transitions first
        state.getInTransitions().forEach((t) => { this.removeTransition(t.id); });
        state.getOutTransitions().forEach((t) => { this.removeTransition(t.id); });

        this.states.delete(id);
        EventManager.emit(new DeleteStateEvent(state));
    }

    removeAllStates(): void {
        for (let id of this.states.keys()) {
            this.removeState(id);
        }
    }

    getInitialState(): State {
        return this.initialState;
    }

    getCurrentState(): State {
        return this.currentState;
    }

    setInitialState(id: StateID): void {
        if (! this.hasState(id)) {
            console.error("The state could not be set as initial: unknown state.");
            return;
        }

        this.resetInitialState();
        this.initialState = this.states.get(id);

        EventManager.emit(new EditInitialStateEvent(this.initialState, true));
    }

    resetInitialState(): void {
        if (this.initialState === null) {
            return;
        }

        let currentInitialState = this.initialState;
        this.initialState = null;

        EventManager.emit(new EditInitialStateEvent(currentInitialState, false));
    }

    setCurrentState(id: StateID): void {
        if (! this.hasState(id)) {
            console.error("The state could not be set as current: unknown state.");
            return;
        }

        this.currentState = this.states.get(id);
        EventManager.emit(new NewCurrentStateEvent(this.currentState));
    }

    resetCurrentState(): void {
        this.currentState = null;
        EventManager.emit(new NewCurrentStateEvent(this.currentState));
    }

    addTransition(transition: Transition): void {
        let fromState = transition.fromState;
        let toState = transition.toState;

        if (! (this.hasState(fromState.id) && this.hasState(toState.id))) {
            console.error("The transition could not be added: unknown origin or destination state.");
            return;
        }

        if (this.transitions.has(transition.id)) {
            console.error("The transition could not be added: already added.");
            return;
        }

        toState.addInTransition(transition);
        fromState.addOutTransition(transition);
        this.transitions.set(transition.id, transition);

        EventManager.emit(new NewTransitionEvent(transition));
    }

    hasTransition(id: TransitionID): boolean {
        return this.transitions.has(id);
    }

    hasTransitionBetween(state1: State, state2: State): boolean {
        return state1.hasOutTransitionTo(state2)
            || state2.hasOutTransitionTo(state1);
    }

    getTransition(id: TransitionID): Transition {
        return this.transitions.has(id) ? this.transitions.get(id) : null;
    }

    getTransitions(): Transition[] {
        return [...this.transitions.values()];
    }

    removeTransition(id: TransitionID): void {
        if (! this.transitions.has(id)) {
            console.error("The transition could not be removed: unknown transition.");
            return;
        }

        let transition = this.transitions.get(id);
        this.transitions.delete(id);

        transition.toState.removeInTransition(transition);
        transition.fromState.removeOutTransition(transition);

        EventManager.emit(new DeleteTransitionEvent(transition));
    }

    removeAllTransitions(): void {
        for (let id of this.transitions.keys()) {
            this.removeTransition(id);
        }
    }

    getNonDeterministicTransitions(): Transition[] {
        let nonDeterministicTransitions = [];

        for (let state of this.states.values()) {
            nonDeterministicTransitions.push(...state.getNonDeterministicOutTransitions());
        }

        return nonDeterministicTransitions;
    }

    isDeterministic(): boolean {
        for (let state of this.states.values()) {
            if (! state.isDeterministic()) {
                return false;
            }
        }

        return true;
    }

    getStatesAsString(useLabels: boolean = true): string {
        return [...this.states.values()]
            .map((s) => s.toString(useLabels))
            .reduce((str, s) => str + "\n" + s, "");
    }

    getTransitionsAsString(useLabels: boolean = true): string {
        return [...this.states.values()]
            .map((s) => s.outTransitionsToString(useLabels))
            .reduce((str, t) => str + "\n\n" + t, "");
    }

    toString(useLabels: boolean = true): string {
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

    export(): StateMachineExport {
        let exportedStates = [...this.states.values()].map((s) => s.export());
        let exportedTransitions = [...this.transitions.values()].map((t) => t.export());
        let initialStateID = this.initialState === null ? NO_INITIAL_STATE_ID : this.initialState.id;

        return {
            states: exportedStates,
            transitions: exportedTransitions,
            initialStateID: initialStateID
        };
    }

    static fromExport(stateMachineExport: StateMachineExport): StateMachine {
        let stateMachine = new StateMachine();

        for (let stateExport of stateMachineExport.states) {
            let state = State.fromExport(stateExport);
            stateMachine.addState(state);
        }

        for (let transitionExport of stateMachineExport.transitions) {
            let transition = Transition.fromExport(transitionExport, stateMachine.states);
            stateMachine.addTransition(transition);
        }

        if (stateMachineExport.initialStateID !== NO_INITIAL_STATE_ID) {
            stateMachine.setInitialState(stateMachineExport.initialStateID);
        }

        return stateMachine;
    }
}
