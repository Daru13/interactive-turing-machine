import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";

/**
 * A class to throw an error when the turing machine tries to run but there is no intial state
 */
export class NoInitialStateError extends TMError {
    constructor(turingMachine: TuringMachine) {
        super(turingMachine,
            "No initial state", 
            "There is no <strong>initial state</strong>: the Turing machine does not know where to start!",
            "Draw a transition from the generator (the element with a lightning) to any state to make it initial."
        );
    }
}