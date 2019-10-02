import { State } from "./State";
import { TapeSymbol, HeadAction } from './Tape';

export type TransitionID = number;


export class Transition {

    private static nextTransitionID = 1;

    readonly id: TransitionID;
    readonly fromState: State;
    readonly toState: State;

    onSymbol: TapeSymbol;
    outputSymbol: TapeSymbol;
    headAction: HeadAction;

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
