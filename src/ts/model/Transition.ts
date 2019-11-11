import { State, StateID } from "./State";
import { TapeSymbol, HeadAction } from './Tape';
import { EventManager } from "../events/EventManager";
import { EditTransitionEvent } from "../events/EditTransitionEvent";
import { transition } from 'd3';
import { TransitionEdge } from '../view/graph/Edge/TransitionEdge';

export type TransitionID = number;

export const READ_ANY_SYMBOL: TapeSymbol = "";
export const WRITE_NO_SYMBOL: TapeSymbol = "";

interface EditableTransition extends Transition {
    id: TransitionID;
}

export interface TransitionExport {
    readonly id: TransitionID;
    readonly fromStateID: StateID;
    readonly toStateID: StateID;
    readonly onSymbol: TapeSymbol;
    readonly outputSymbol: TapeSymbol;
    readonly headAction: HeadAction;
}

export class Transition {

    private static nextTransitionID: TransitionID = 1;

    readonly id: TransitionID;
    readonly fromState: State;
    readonly toState: State;

    private onSymbol: TapeSymbol;
    private outputSymbol: TapeSymbol;
    private headAction: HeadAction;

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

    getOnSymbol(): TapeSymbol {
        return this.onSymbol;
    }

    setOnSymbol(symbol: TapeSymbol): void {
        let oldSymbol = this.onSymbol;
        this.onSymbol = symbol;

        // Update the origin state accordingly
        this.fromState.editOutTransitionSymbol(this, oldSymbol, symbol);

        EventManager.emit(new EditTransitionEvent(this));
    }

    getOutputSymbol(): TapeSymbol {
        return this.outputSymbol;
    }

    setOutputSymbol(symbol: TapeSymbol): void {
        this.outputSymbol = symbol;

        EventManager.emit(new EditTransitionEvent(this));
    }

    getHeadAction(): HeadAction {
        return this.headAction;
    }

    setHeadAction(action: HeadAction): void {
        this.headAction = action;

        EventManager.emit(new EditTransitionEvent(this));
    }

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

    private static ensureIDIsAbove(minID: TransitionID): void {
        if (Transition.nextTransitionID <= minID) {
            Transition.nextTransitionID = minID + 1;
        }
    }
}
