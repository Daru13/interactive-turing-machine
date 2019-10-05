import { State } from "./State";
import { TapeSymbol, HeadAction } from './Tape';
import { EventManager } from "../events/EventManager";
import { EditTransitionEvent } from "../events/EditTransitionEvent";

export type TransitionID = number;


export class Transition {

    private static nextTransitionID = 1;

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

    setOnSymbol(symbol: TapeSymbol) {
        let oldSymbol = this.onSymbol;
        this.onSymbol = symbol;

        // Update the origin state accordingly
        this.fromState.editOutTransitionSymbol(this, oldSymbol, symbol);

        EventManager.emit(new EditTransitionEvent(this));
    }

    getOutputSymbol(): TapeSymbol {
        return this.outputSymbol;
    }

    setOutputSymbol(symbol: TapeSymbol) {
        this.onSymbol = symbol;

        EventManager.emit(new EditTransitionEvent(this));
    }

    getHeadAction(): HeadAction {
        return this.headAction;
    }

    setHeadAction(action: HeadAction) {
        this.headAction = action;

        EventManager.emit(new EditTransitionEvent(this));
    }

    toString(useLabels: boolean = true) {
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
             + this.onSymbol
             + " / "
             + this.outputSymbol
             + ", "
             + actionAsString
             + ")";
    }
}
