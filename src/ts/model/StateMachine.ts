import { State, StateID, Position } from './State';
import { Transition, TransitionID } from './Transition';
import { EventManager } from "../events/EventManager";
import { NewStateEvent } from "../events/NewStateEvent";
import { DeleteStateEvent } from "../events/DeleteStateEvent";
import { NewTransitionEvent } from "../events/NewTransitionEvent";
import { DeleteTransitionEvent } from "../events/DeleteTransitionEvent";
import { EditInitialStateEvent } from "../events/EditInitialStateEvent";


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

    addState(state: State) {
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

    hasState(id: StateID) {
        return this.states.has(id);
    }

    getState(id: StateID){
        return this.hasState(id) ? this.states.get(id) : null;
    }

    removeState(id: StateID) {
        let state = this.states.get(id);

        // Remove in and out transitions first
        state.getInTransitions().forEach((t) => { this.removeTransition(t.id); });
        state.getOutTransitions().forEach((t) => { this.removeTransition(t.id); });

        this.states.delete(id);
        EventManager.emit(new DeleteStateEvent(state));
    }

    getInitialState() {
        return this.initialState;
    }

    getCurrentState() {
        return this.currentState;
    }

    setInitialState(id: StateID) {
        if (! this.hasState(id)) {
            console.error("The state could not be set as initial: unknown state.");
            return;
        }

        if(this.initialState !== null){
            EventManager.emit(new EditInitialStateEvent(this.initialState, false));
        }
        this.initialState = this.states.get(id);
        EventManager.emit(new EditInitialStateEvent(this.initialState, true));
    }

    setCurrentState(id: StateID) {
        if (! this.hasState(id)) {
            console.error("The state could not be set as current: unknown state.");
            return;
        }

        this.currentState = this.states.get(id);
    }

    addTransition(transition: Transition) {
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

    hasTransitionBetween(state1: State, state2: State) {
        return state1.hasOutTransitionTo(state2)
            || state2.hasOutTransitionTo(state1);
    }

    getTransition(id: TransitionID): Transition {
        return this.transitions.has(id) ? this.transitions.get(id) : null;
    }

    removeTransition(id: TransitionID) {
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

    getNonDeterministicTransitions(): Transition[] {
        let nonDeterministicTransitions = [];

        for (let state of this.states.values()) {
            nonDeterministicTransitions.push(...state.getNonDeterministicOutTransitions());
        }

        return nonDeterministicTransitions;
    }

    isDeterministic(): boolean {
        let deterministic = true;

        for (let state of this.states.values()) {
            if (! state.isDeterministic()) {
                return false;
            }
        }

        return true;
    }

    getStatesAsString(useLabels: boolean = true) {
        return [...this.states.values()]
            .map((s) => s.toString(useLabels))
            .reduce((str, s) => str + "\n" + s, "");
    }

    getTransitionsAsString(useLabels: boolean = true) {
        return [...this.states.values()]
            .map((s) => s.outTransitionsToString(useLabels))
            .reduce((str, t) => str + "\n\n" + t, "");
    }

    toString(useLabels: boolean = true) {
        let str = "";

        for (let state of this.states.values()) {
            str += state.toString(useLabels);

            if (this.currentState == state) {
                str += " (current)";
            }
            if (this.initialState == state) {
                str += " (init)";
            }

            str += state.outTransitionsToString(useLabels);
            str += "\n\n";
        }

        return str;
    }


}
