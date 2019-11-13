import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";
import { Transition } from "../model/Transition";

/**
 * A class to throw an error when the turing machine tries to run but there is a non deterministic error
 */
export class NonDeterministicError extends TMError {
    private readonly state: State;
    private readonly transitions: Transition[];

    constructor(turingMachine: TuringMachine, state: State, transitions: Transition[]) {
        super(turingMachine,
            `State ${state.getLabel()} is not deterministic`, 
            `There are more than one transition going out of state ${state.getLabel()} for the same symbol. This makes the Turing machine <strong>non-deterministic</strong>: it cannot decide which transition to follow!`,
            `Remove or modify the conflicting transitions going out of state ${state.getLabel()} (you can click on a transition to change the input symbol).`,
            "Non-deterministic state"
        );

        this.state = state;
        this.transitions = transitions;
    }

    getState(): State {
        return this.state;
    }

    getTransitions(): Transition[] {
        return this.transitions;
    }
}