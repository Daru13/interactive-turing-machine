import { State, StateID } from "./State";
import { TapeSymbol, HeadAction } from './Tape';
import { EventManager } from "../events/EventManager";
import { EditTransitionEvent } from "../events/EditTransitionEvent";
import { transition } from 'd3';
import { TransitionEdge } from '../view/graph/edges/TransitionEdge';

/** The type of the unique identifier of a transition. */
export type TransitionID = number;

/** The input symbol representing any symbol of the tape. */
export const READ_ANY_SYMBOL: TapeSymbol = "";

/** The output symbol representing an absence of writing. */
export const WRITE_NO_SYMBOL: TapeSymbol = "";

/**
 * An internal type used to modify the ID of a transition.
 * It is required to set it from an exported transition.
 */
interface EditableTransition extends Transition {
    id: TransitionID;
}

/** An exported transition which can be serialised. */
export interface TransitionExport {
    readonly id: TransitionID;
    readonly fromStateID: StateID;
    readonly toStateID: StateID;
    readonly onSymbol: TapeSymbol;
    readonly outputSymbol: TapeSymbol;
    readonly headAction: HeadAction;
}

/**
 * A transition of the state machine of a Turing machine.
 * It has an origin, a destination, input and output symbols, and an action onto the tape head.
 */
export class Transition {
    /** ID of the next transition instance. */
    private static nextTransitionID: TransitionID = 1;
    
    /** Unique ID of a transition. */
    readonly id: TransitionID;

    /** Origin state. */
    readonly fromState: State;

    /** Destination state. */
    readonly toState: State;

    /** Input symbol (to be read from the tape). */
    private onSymbol: TapeSymbol;

    /** Output symbol (to be written on the tape). */
    private outputSymbol: TapeSymbol;

    /** The action to execute on the head of the tape. */
    private headAction: HeadAction;

    /**
     * Create a new instance of Transition.
     * 
     * @param fromState Origin state.
     * @param toState Destination state.
     * @param onSymbol Input symbol.
     * @param outputSymbol Output symbol.
     * @param headAction Action on the head of the tape.
     */
    constructor(fromState: State,
        toState: State,
        onSymbol: TapeSymbol,
        outputSymbol: TapeSymbol,
        headAction: HeadAction) {
        this.id = Transition.nextTransitionID;
        Transition.nextTransitionID++;

        this.fromState = fromState;
        this.toState = toState;

        this.onSymbol = onSymbol;
        this.outputSymbol = outputSymbol;
        this.headAction = headAction;
    }

    /**
     * Return the input symbol of the transition.
     * 
     * @return The input symbol.
     */
    getOnSymbol(): TapeSymbol {
        return this.onSymbol;
    }

    /**
     * Set the input symbol of the transition.
     * Emit an [[EditTransitionEvent]] when done.
     * 
     * @param symbol The new input symbol.
     */
    setOnSymbol(symbol: TapeSymbol): void {
        let oldSymbol = this.onSymbol;
        this.onSymbol = symbol;

        // Update the origin state accordingly
        this.fromState.editOutTransitionSymbol(this, oldSymbol, symbol);

        EventManager.emit(new EditTransitionEvent(this));
    }

    /**
     * Return the output symbol of the transition.
     * 
     * @return The output symbol.
     */
    getOutputSymbol(): TapeSymbol {
        return this.outputSymbol;
    }

    /**
     * Set the output symbol of the transition.
     * Emit an [[EditTransitionEvent]] when done.
     * 
     * @param symbol The new output symbol.
     */
    setOutputSymbol(symbol: TapeSymbol): void {
        this.outputSymbol = symbol;

        EventManager.emit(new EditTransitionEvent(this));
    }

    /**
     * Return the head action of the transition (to execute on the tape head).
     * 
     * @return The head action.
     */
    getHeadAction(): HeadAction {
        return this.headAction;
    }

    /**
     * Set the head action of the transition (to execute on the tape head).
     * Emit an [[EditTransitionEvent]] when done.
     * 
     * @param action The new head action.
     */
    setHeadAction(action: HeadAction): void {
        this.headAction = action;

        EventManager.emit(new EditTransitionEvent(this));
    }

    /**
     * Return a textual version of the transition.
     * 
     * @param useLabels Use state labels instead of state IDs.
     * @return A string representing the transition.
     */
    toString(useLabels: boolean = true): string {
        let actionAsString = "";
        switch (this.headAction) {
            case HeadAction.MoveLeft:
                actionAsString = "◀";
                break;

            case HeadAction.MoveRight:
                actionAsString = "▶";
                break;

            case HeadAction.None:
                actionAsString = "▽";
                break;

            default:
                actionAsString = "<unknown action>";
                break;
        }

        return this.fromState.toString(useLabels)
             + " → "
             + this.toState.toString(useLabels)
             + " ("
             + (this.onSymbol === READ_ANY_SYMBOL ? "<any>" : this.onSymbol)
             + " / "
             + (this.outputSymbol === WRITE_NO_SYMBOL ? "<none>" : this.outputSymbol)
             + ", "
             + actionAsString
             + ")";
    }

    /**
     * Return an exportable version of the transition.
     * 
     * @return An export object describing the transition.
     */
    export(): TransitionExport {
        return {
            id: this.id,
            fromStateID: this.fromState.id,
            toStateID: this.toState.id,
            onSymbol: this.onSymbol,
            outputSymbol: this.outputSymbol,
            headAction: this.headAction
        };
    }

    /**
     * Create a transition from the given export.
     * 
     * It also require a map of states (from a StateMachine instance)
     * in order to fetch the origin and destination states (since the export only contains IDs).
     * 
     * If the states are not found, the import does not fail, but states can be equal to `undefined`.
     * 
     * @param stateExport The exported transition to instanciate.
     * @param states The map of states of the state machine.
     * @return A new Transition instance based on the given import (with the given ID).
     */
    static fromExport(transitionExport: TransitionExport, states: Map<StateID, State>): Transition {
        // Origin and destination states MUST HAVE ALREADY BEEN CREATED
        let fromState = states.get(transitionExport.fromStateID);
        let toState = states.get(transitionExport.toStateID);

        if (fromState === undefined || toState === undefined) {
            console.error("The transition could not be created from an export: unknown state.");
        }

        let transition = new Transition(
            fromState,
            toState,
            transitionExport.onSymbol,
            transitionExport.outputSymbol,
            transitionExport.headAction
        ) as EditableTransition;

        // Restore the original transition ID
        transition.id = transitionExport.id;
        Transition.ensureIDIsAbove(transitionExport.id);

        return transition;
    }

    /**
     * Ensure the ID of the next transition is above the given ID.
     * 
     * This is useful when importing transitions with their own IDs,
     * to prevent potential future collisions between transition IDs.
     * 
     * @param minID The highest non-available transition ID.
     */
    private static ensureIDIsAbove(minID: TransitionID): void {
        if (Transition.nextTransitionID <= minID) {
            Transition.nextTransitionID = minID + 1;
        }
    }
}
