import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";

export class NoTransitionAvailableError extends TMError {
    state: State;

    constructor(turingMachine: TuringMachine, state: State){
        super(turingMachine);
        this.text = "no transition available";
        this.state = state;
    }
}