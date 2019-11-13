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

/** An impossible state ID representing an absent initial state. */
const NO_INITIAL_STATE_ID: StateID = -1;

/** An exported transition which can be serialised. */
export interface StateMachineExport {
    states: StateExport[];
    transitions: TransitionExport[];
    initialStateID: StateID;
}

/**
 * The state machine of a Turing machine.
 * It contains states (including an inital and a current state) and transitions between states.
 */
export class StateMachine {
    /** A map of all the states of the state machine (keys are state IDs). */
    private states: Map<StateID, State>;
    
    /** A map of all the transitions of the state machine (keys are transition IDs). */
    private transitions: Map<TransitionID, Transition>;

    /** The initial state of the state machine. */
    private initialState: State;

    /** The current state of the state machine. */
    private currentState: State;

    /**
     * Create a new instance of StateMachine.
     */
    constructor() {
        this.states = new Map();
        this.transitions = new Map();

        this.currentState = null;
        this.initialState = null;
    }

    /** Add a new state to the state machine.
     * Emit an [[NewStateEvent]] when done.
     * 
     * @param state The state to add.
     */
    addState(state: State): void {
        if (this.states.has(state.id)) {
            console.error("The state could not be added: already added.");
            return;
        }

        this.states.set(state.id, state);

        EventManager.emit(new NewStateEvent(state));
    }

    /**
     * Create a new state and add it to the state machine.
     * See [[State]] for details.
     * 
     * @param position The position of the new state.
     * @param label The label of the new state.
     * @param The final flag of the new state.
     * @return The newly created state.
     */
    createAndAddState(position: Position, label: string, final: boolean = false): State {
        let state = new State(position, label, final);
        this.addState(state);

        return state;
    }

    /**
     * Test whether the state machine contains a certain state.
     * 
     * @param id The ID of the state.
     * @return `true` if the state machine contains the state, `false` otherwise.
     */
    hasState(id: StateID): boolean {
        return this.states.has(id);
    }

    /**
     * Return the state associated with the given ID.
     * If the state machines does not contain it, return `null`.
     * 
     * @param id The ID of the state.
     * @return The state with the given ID (possibly `null`).
     */
    getState(id: StateID): State {
        return this.hasState(id) ? this.states.get(id) : null;
    }

    /**
     * Return a list of all the states of the state machine.
     * 
     * @return An array of states (possibly empty).
     */
    getStates(): State[] {
        return [...this.states.values()];
    }

    /**
     * Remove the state with the given ID from the state machine.
     * Emit an [[DeleteStateEvent]] when done.
     * 
     * @param id The ID of the state.
     */
    removeState(id: StateID): void {
        let state = this.states.get(id);

        // Remove in and out transitions first
        state.getInTransitions().forEach((t) => { this.removeTransition(t.id); });
        state.getOutTransitions().forEach((t) => { this.removeTransition(t.id); });

        this.states.delete(id);
        EventManager.emit(new DeleteStateEvent(state));
    }

    /**
     * Remove all the states from the state machine.
     */
    removeAllStates(): void {
        for (let id of this.states.keys()) {
            this.removeState(id);
        }
    }

    /**
     * Return the initial state of the state machine.
     * 
     * @return The initial state (possibly `null`).
     */
    getInitialState(): State {
        return this.initialState;
    }

    /**
     * Return the current state of the state machine.
     * 
     * @return The current state (possibly `null`).
     */
    getCurrentState(): State {
        return this.currentState;
    }

    /**
     * Set the initial state of the state machine.
     * The state with the given ID must be part of the machine (no effect otherwise).
     * Emit an [[EditInitialStateEvent]] when done.
     * 
     * @param id The ID of the new initial state.
     */
    setInitialState(id: StateID): void {
        if (! this.hasState(id)) {
            console.error("The state could not be set as initial: unknown state.");
            return;
        }

        this.resetInitialState();
        this.initialState = this.states.get(id);

        EventManager.emit(new EditInitialStateEvent(this.initialState, true));
    }

    /**
     * Reset the initial state to `null`.
     * Emit an [[EditInitialStateEvent]] when done.
     */
    resetInitialState(): void {
        if (this.initialState === null) {
            return;
        }

        let currentInitialState = this.initialState;
        this.initialState = null;

        EventManager.emit(new EditInitialStateEvent(currentInitialState, false));
    }

    /**
     * Set the current state of the state machine.
     * The state with the given ID must be part of the machine (no effect otherwise).
     * Emit an [[NewCurrentStateEvent]] when done.
     * 
     * @param id The ID of the new current state.
     */
    setCurrentState(id: StateID): void {
        if (! this.hasState(id)) {
            console.error("The state could not be set as current: unknown state.");
            return;
        }

        this.currentState = this.states.get(id);
        EventManager.emit(new NewCurrentStateEvent(this.currentState));
    }

    /**
     * Reset the current state of the state machine to `null`.
     * Emit an [[NewCurrentStateEvent]] when done.
     */
    resetCurrentState(): void {
        this.currentState = null;
        EventManager.emit(new NewCurrentStateEvent(this.currentState));
    }

    /**
     * Add a transition to the state machine.
     * The two states of the transition must be part of the state machine (no effect otherwise).
     * Emit an [[NewTransitionEvent]] when done.
     * 
     * @param transition The transition to add.
     */
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

    /**
     * Test whether the state machine contains a certain transition.
     * 
     * @param id The ID of the transition.
     * @return `true` if the state machine contains the transition, `false` otherwise.
     */
    hasTransition(id: TransitionID): boolean {
        return this.transitions.has(id);
    }

    /**
     * Test if a transition exist between two given states (in any direction).
     * 
     * @param state1 One of the states of the potential transition.
     * @param state2 the other state of the potential transition.
     */
    hasTransitionBetween(state1: State, state2: State): boolean {
        return state1.hasOutTransitionTo(state2)
            || state2.hasOutTransitionTo(state1);
    }

    /**
     * Return the transition associated with the given ID.
     * If the state machines does not contain it, return `null`.
     * 
     * @param id The ID of the transition.
     * @return The transition with the given ID (possibly `null`).
     */
    getTransition(id: TransitionID): Transition {
        return this.transitions.has(id) ? this.transitions.get(id) : null;
    }

    /**
     * Return a list of all the transitions of the state machine.
     * 
     * @return An array of transitions (possibly empty).
     */
    getTransitions(): Transition[] {
        return [...this.transitions.values()];
    }

    /**
     * Remove the transition with the given ID from the state machine.
     * Emit an [[DeleteTransitionEvent]] when done.
     * 
     * @param id The ID of the transition.
     */
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

    /**
     * Remove all the transitions from the state machine.
     */
    removeAllTransitions(): void {
        for (let id of this.transitions.keys()) {
            this.removeTransition(id);
        }
    }

    /**
     * Return a list of all the non-deterministic transitions of the state machine.
     * (non-deterministic being defined by [[State.getNonDeterministicOutTransitions]]).
     * 
     * @return An array of transitions (possibly empty).
     */
    getNonDeterministicTransitions(): Transition[] {
        let nonDeterministicTransitions = [];

        for (let state of this.states.values()) {
            nonDeterministicTransitions.push(...state.getNonDeterministicOutTransitions());
        }

        return nonDeterministicTransitions;
    }

    /**
     * Test whether all the states of the state machine are deterministic or not
     * (non-deterministic being defined by [[State.isDeterministic]]).
     * 
     * @return `true` if they all are deterministic, `false` otherwise.
     */
    isDeterministic(): boolean {
        for (let state of this.states.values()) {
            if (! state.isDeterministic()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Return a textual version of all the states of the state machine.
     * Each state is put on a new line.
     * 
     * @param useLabels Use state labels instead of the state ID.
     * @return A string representing the the list of states of the state machine.
     */
    getStatesAsString(useLabels: boolean = true): string {
        return [...this.states.values()]
            .map((s) => s.toString(useLabels))
            .reduce((str, s) => str + "\n" + s, "");
    }
    
    /**
     * Return a textual list of all the transitions of the state machine.
     * Each transition is put on a new line.
     * 
     * @param useLabels Use state labels instead of state IDs.
     * @return A string representing the list of transitions of the state machine.
     */
    getTransitionsAsString(useLabels: boolean = true): string {
        return [...this.states.values()]
            .map((s) => s.outTransitionsToString(useLabels))
            .reduce((str, t) => str + "\n\n" + t, "");
    }

    /**
     * Return a textual version of the state machine.
     * It contains the textual version of all the states and all the transitions.
     * 
     * @param useLabels Use the state label instead of the state ID.
     * @return A string representing the state machine.
     */
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

    /**
     * Return an exportable version of the state machine.
     * 
     * @return An export object describing the state machine.
     */
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

    /**
     * Create a state machine from the given export.
     * 
     * @param stateMachineExport The exported state machine to instanciate.
     * @return A new StateMachine instance based on the given import.
     */
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
