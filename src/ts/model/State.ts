import { Transition, TransitionID, READ_ANY_SYMBOL } from './Transition';
import { TapeSymbol } from './Tape';
import { EventManager } from '../events/EventManager';
import { EditStateEvent } from '../events/EditStateEvent';
import { transition, symbol } from 'd3';
import { EditFinalStateEvent } from '../events/EditFinalStateEvent';
import { MoveStateAction } from '../view/actions/MoveStateAction';
import { moveStateEvent } from '../events/MoveStateEvent';

/** The type of the unique identifier of a state. */
export type StateID = number;

/** The 2D position of a state. */
export interface Position {
    x: number;
    y: number;
}

/**
 * An internal type used to modify the ID of a state.
 * It is required to set it from an exported state.
 */
interface EditableState extends State {
    id: StateID;
}

/** An exported state which can be serialised. */
export interface StateExport {
    readonly id: StateID;
    readonly position: Position;
    readonly label: string;
    readonly final: boolean;
}

/**
 * A state of the state machine of a Turing machine.
 * It can be final (or not), has a position, a label, and transitions to other states.
 */
export class State {
    /** ID of the next state instance. */
    private static nextStateID: StateID = 1;

    /** Unique ID of a state. */
    readonly id: StateID;

    /** 2D position of the state. */
    private position: Position;

    /** Label of the state. */
    private label: string;

    /** Flag indicating whether the state is final or not. */
    private final: boolean;

    /** A map of all incoming transitions (keys are transition IDs). */
    private inTransitions: Map<TransitionID, Transition>;

    /** A map of all outgoing transitions (keys are transition IDs). */
    private outTransitions: Map<TransitionID, Transition>;

    /**
     * A map from the symbols which can be read in the state
     * to the transitions which accept them.
     */
    private symbolsToOutTransitions: Map<TapeSymbol, Set<Transition>>;

    /**
     * Create a new instance of State.
     * 
     * @param position The 2D position of the state.
     * @param label The label of the state.
     * @param final The final flag of the state.
     */
    constructor(position: Position, label: string, final: boolean = false) {
        this.id = State.nextStateID;
        State.nextStateID++;

        this.position = position;
        this.label = label;
        this.final = final;

        this.inTransitions = new Map();
        this.outTransitions = new Map();
        this.symbolsToOutTransitions = new Map();
    }

    /**
     * Return the position of the state.
     * 
     * @return The state position.
     */
    getPosition(): Position {
        return this.position;
    }

    /**
     * Set the position of the state.
     * 
     * @param position The new position of the state.
     */
    setPosition(position: Position): void {
        this.position = position;
        EventManager.emit(new moveStateEvent(this, this.position));
    }

    /**
     * Return the label of the state.
     * 
     * @return The state label.
     */
    getLabel(): string {
        return this.label;
    }

    /**
     * Set the label of the state.
     * Emit an [[EditStateEvent]] when done.
     * 
     * @param label The new label of the state.
     */
    setLabel(label: string): void {
        this.label = label;
        
        EventManager.emit(new EditStateEvent(this));
    }

    /**
     * Test whether the state is final or not.
     * 
     * @return `true` if the state is final, `false` otherwise.
     */
    isFinal(): boolean {
        return this.final;
    }

    /**
     * Set whether the state is final or not.
     * Emit an [[EditFinalStateEvent]] when done.
     * 
     * @param final `true` to make the state final, `false` otherwise.
     */
    setFinal(final: boolean): void {
        this.final = final;

        EventManager.emit(new EditFinalStateEvent(this, final));
    }

    /**
     * Add an incomming transition to the state.
     * 
     * @param transition The incomming transition to add.
     */
    addInTransition(transition: Transition): void {
        if (transition.destination !== this) {
            console.error("The transition could not be added: state and destination do not match.");
            return;
        }

        this.inTransitions.set(transition.id, transition);
    }

    /**
     * Remove an incomming transition from the state.
     * 
     * @param transition The incomming transition to remove.
     */
    removeInTransition(transition: Transition): void {
        let id = transition.id;
        if (! this.inTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }
        
        this.inTransitions.delete(transition.id);
    }

    /**
     * Add an outgoing transition to the state.
     * 
     * @param transition The outgoing transition to add.
     */
    addOutTransition(transition: Transition): void {
        if (transition.origin !== this) {
            console.error("The transition could not be added: state and origin do not match.");
            return;
        }

        let inputSymbol = transition.getInputSymbol();
        if (! this.symbolsToOutTransitions.has(inputSymbol)) {
            this.symbolsToOutTransitions.set(inputSymbol, new Set());
        }

        this.symbolsToOutTransitions.get(transition.getInputSymbol()).add(transition);
        this.outTransitions.set(transition.id, transition);
    }

    /**
     * Remove an outgoing transition from the state.
     * 
     * @param transition The outgoing transition to add.
     */
    removeOutTransition(transition: Transition): void {
        let id = transition.id;
        if (! this.outTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }

        let inputSymbol = transition.getInputSymbol();
        let transitions = this.symbolsToOutTransitions.get(inputSymbol);

        transitions.delete(transition);
        this.outTransitions.delete(id);

        if (this.symbolsToOutTransitions.get(inputSymbol).size === 0) {
            this.symbolsToOutTransitions.delete(inputSymbol);
        }
    }

    /**
     * Test whether the state has an outgoing transition to another state.
     * 
     * @param state The potential destination state.
     * @return `true` if the state has such a transition, `false` otherwise.
     */
    hasOutTransitionTo(state: State): boolean {
        for (let transition of this.outTransitions.values()) {
            if (transition.destination === state) {
                return true;
            }
        }

        return false;
    }

    /**
     * Return a list of outgoing transitions to the given state.
     * 
     * @param state The potential destination state.
     * @return An array of matching transition (possibly empty).
     */
    getOutTransitionsTo(state: State): Transition[] {
        return [...this.outTransitions.values()]
            .filter((t) => {
                return t.destination === state;
            });
    }
    
    /**
     * Test whether the state has an outgoing transition reading the given symbol.
     * 
     * @param symbol The symbol which must be read.
     * @return `true` if the state has such a transition, `false` otherwise.
     */
    hasOutTransitionForSymbol(symbol: TapeSymbol): boolean {
        return this.symbolsToOutTransitions.has(symbol)
            || this.symbolsToOutTransitions.has(READ_ANY_SYMBOL);
    }

    /**
     * Return a list of outgoing transitions reading the given symbol.
     * 
     * @param symbol The symbol which must be read.
     * @return An array of matching transition (possibly empty).
     */
    getOutTransitionsForSymbol(symbol: TapeSymbol): Transition[] {
        let transitions = this.symbolsToOutTransitions.get(symbol);
        
        // In case there is no transition for the given symbol,
        // try returning a transition matching any symbol (it may be undefined)
        return transitions === undefined
             ? [...this.symbolsToOutTransitions.get(READ_ANY_SYMBOL)]
             : [...transitions];
    }

    /**
     * Replace the input symbol of an outgoing transition by a new one.
     * 
     * @param transition The outgoing transition to modify.
     * @param oldSymbol The old input symbol.
     * @param newSymbol The new input symbol.
     */
    editOutTransitionInputSymbol(transition: Transition, oldSymbol: TapeSymbol, newSymbol: TapeSymbol): void {
        if (oldSymbol === newSymbol) {
            return;
        }

        let oldSymbolTransitions = this.symbolsToOutTransitions.get(oldSymbol);
        oldSymbolTransitions.delete(transition);

        if (oldSymbolTransitions.size === 0) {
            this.symbolsToOutTransitions.delete(oldSymbol);
        }

        if (! this.symbolsToOutTransitions.has(newSymbol)) {
            this.symbolsToOutTransitions.set(newSymbol, new Set());
        }
        
        this.symbolsToOutTransitions.get(newSymbol).add(transition);
    }

    /**
     * Return a list of all the incomming transitions of the state.
     * 
     * @return An array of incomming transitions (possibly empty).
     */
    getInTransitions(): Transition[] {
        return [...this.inTransitions.values()];
    }

    /**
     * Return a list of all the outgoing transitions of the state.
     * 
     * @return An array of outgoing transitions (possibly empty).
     */
    getOutTransitions(): Transition[] {
        return [...this.outTransitions.values()];
    }

    /**
     * Return a list of all the non-deterministic outgoing transitions of the state.
     * 
     * A transition is said _non-deterministic_ if there is at least another transition
     * which reads the same symbol from the same state.
     * 
     * @return An array of outgoing transitions (possibly empty).
     */
    getNonDeterministicOutTransitions(): Transition[] {
        let nonDeterministicTransitions = [];

        for (let transitions of this.symbolsToOutTransitions.values()) {
            if (transitions.size > 1) {
                nonDeterministicTransitions.push(...transitions.values());                
            }
        }

        return nonDeterministicTransitions;
    }

    /**
     * Test whether the state is deterministic or not.
     * 
     * A state is said _deterministic_ if it does not have
     * any non-deterministic outgoing transitions (see [[getNonDeterministicOutTransitions]]).
     * 
     * @return `true` if it is deterministic, `false` otherwise.
     */
    isDeterministic(): boolean {
        for (let transitions of this.symbolsToOutTransitions.values()) {
            if (transitions.size > 1) {
                return false;
            }
        }

        return true;
    }

    /**
     * Return a textual version of the state.
     * 
     * @param useLabels Use the state label instead of the state ID.
     * @return A string representing the state.
     */
    toString(useLabels: boolean = true): string {
        return useLabels ? this.label : this.id.toString();
    }

    /**
     * Return a textual list of outgoing transitions of the state.
     * Each transition is put on a new line.
     * 
     * @param useLabels Use state labels instead of state IDs.
     * @return A string representing the list of outgoing transitions of the state.
     */
    outTransitionsToString(useLabels: boolean = true): string {
        return [...this.outTransitions.values()]
            .map((t) => t.toString(useLabels))
            .reduce((str, t) => str + "\n" + t, "");
    }

    /**
     * Return an exportable version of the state.
     * 
     * @return An export object describing the state.
     */
    export(): StateExport {
        return {
           id: this.id,
           position: this.position,
           label: this.label,
           final: this.final 
        };
    }

    /**
     * Create a state from the given export.
     * 
     * @param stateExport The exported state to instanciate.
     * @return A new State instance based on the given import (with the given ID).
     */
    static fromExport(stateExport: StateExport): State {
        let state = new State(stateExport.position, stateExport.label, stateExport.final) as EditableState;
        
        // Restore the original state ID        
        state.id = stateExport.id;
        State.ensureIDIsAbove(stateExport.id);

        return state;
    }

    /**
     * Ensure the ID of the next state is above the given ID.
     * 
     * This is useful when importing states with their own IDs,
     * to prevent potential future collisions between state IDs.
     * 
     * @param minID The highest non-available state ID.
     */
    private static ensureIDIsAbove(minID: StateID): void {
        if (State.nextStateID <= minID) {
            State.nextStateID = minID + 1;
        }
    }
}
