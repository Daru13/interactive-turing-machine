import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";

/**
 * A class to throw an error when the turing machine tries to run but there is no available transition.
 */
export class NoTransitionAvailableError extends TMError {
    private readonly state: State;

    constructor(turingMachine: TuringMachine, state: State) {
        super(turingMachine,
            `No transition available in state ${state.getLabel()}`, 
            `There is no transition going out of state ${state.getLabel()} for symbol "${turingMachine.tape.getCurrentSymbol()}": the Turing machine is stuck!`,
            `Either add more transitions or make state ${state.getLabel()} final to tell the Turing machine it can stop here (you can click on a state to change whether it is final or not).`,
            "No transition available"
        );

        this.state = state;
    }

    getState(): State {
        return this.state;
    }

}