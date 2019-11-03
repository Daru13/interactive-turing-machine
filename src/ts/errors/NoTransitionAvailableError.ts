import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";

export class NoTransitionAvailableError extends TMError {
    state: State;

    constructor(turingMachine: TuringMachine, state: State){
        super(turingMachine);
        this.name = "No transition available"
        this.text = `There is no transition going out of state ${state.getLabel()} with the symbol ${turingMachine.tape.getCurrentSymbol()}.`;
        this.state = state;
    }
}