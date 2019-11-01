import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";
import { Transition } from "../model/Transition";

export class NonDeterministicError extends TMError {
    state: State;
    transitions: Transition[];

    constructor(turingMachine: TuringMachine, state: State, transitions: Transition[]) {
        super(turingMachine);
        this.name = `State ${state.getLabel()} is non deterministic`;
        this.text = `There is transitions going from state ${state.getLabel()} that read the same symbol. This makes the turing machine non deterministic.`;
        this.state = state;
        this.transitions = transitions;
    }
}