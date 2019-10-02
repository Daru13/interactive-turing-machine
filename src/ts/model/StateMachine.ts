import { State, StateID } from "./State";
import { Transition } from './Transition';
import { EventManager } from "../events/EventManager";
import { NewStateEvent } from "../events/NewStateEvent";
import { DeleteStateEvent } from "../events/DeleteStateEvent";
import { NewTransitionEvent } from "../events/NewTransitionEvent";
import { DeleteTransitionEvent } from "../events/DeleteTransitionEvent";


export class StateMachine {

    private states: Map<StateID, State>;
    private initialState: State;
    private currentState: State;


    constructor() {
        this.states = new Map();
        this.currentState = null;
        this.initialState = null;
    }

    addState(state: State, x: number = 0, y: number = 0) {
        this.states.set(state.id, state);
        EventManager.emit(new NewStateEvent(state, x, y));
    }

    removeState(state: State) {
        this.states.delete(state.id);
        EventManager.emit(new DeleteStateEvent(state));
    }

    hasState(state: State) {
        return this.states.has(state.id);
    }

    getInitialState() {
        return this.initialState;
    }

    getCurrentState() {
        return this.currentState;
    }

    setInitialState(state: State) {
        if (! this.hasState(state)) {
            console.error("The state could not be set as initial: unknown state.");
            return;
        }

        this.initialState = state;
    }

    setCurrentState(state: State) {
        if (! this.hasState(state)) {
            console.error("The state could not be set as current: unknown state.");
            return;
        }

        this.currentState = state;
    }

    addTransition(transition: Transition) {
        let fromState = transition.fromState;

        if (! this.hasState(fromState)) {
            console.error("The transition could not be added: unknown origin state.");
            return;
        }

        fromState.addTransition(transition);
        EventManager.emit(new NewTransitionEvent(transition));
    }

    removeTransition(transition: Transition) {
        throw "todo removeTransition StateMachine.ts"
        let fromState = transition.fromState;

        if (! this.hasState(fromState)) {
            console.error("The transition could not be removed: unknown origin state.");
            return;
        }

        fromState.addTransition(transition);
        EventManager.emit(new DeleteTransitionEvent(transition));
    }

    getStatesAsString(useLabels: boolean = true) {
        return [...this.states.values()]
            .map((s) => s.toString(useLabels))
            .reduce((str, s) => str + "\n" + s, "");
    }

    getTransitionsAsString(useLabels: boolean = true) {
        return [...this.states.values()]
            .map((s) => s.transitionsToString(useLabels))
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

            str += state.transitionsToString(useLabels);
            str += "\n\n";
        }

        return str;
    }


}
