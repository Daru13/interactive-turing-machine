import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";
import { Transition } from "../model/Transition";

export class NonDeterministicError extends TMError {
    state: State;
    transitions: Transition[];

    constructor(turingMachine: TuringMachine, state: State, transitions: Transition[]) {
        super(turingMachine);
        this.text = "no deterministic";
        this.state = state;
        this.transitions = transitions;
    }
}