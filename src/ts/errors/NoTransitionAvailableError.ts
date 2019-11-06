import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { State } from "../model/State";

export class NoTransitionAvailableError extends TMError {
    private readonly state: State;

    constructor(turingMachine: TuringMachine, state: State){
        super(turingMachine,
            `No transition available in ${state.getLabel()}`, 
            `There is <strong>no transition</strong> going out of state ${state.getLabel()} for the symbol ${turingMachine.tape.getCurrentSymbol()}: the Turing machine is <strong>blocked</strong>! To fix the problem, either add more transitions or make state ${state.getLabel()} final to tell the Turing machine it can stop here (click on a state to edit its properties).`
        );

        this.state = state;
    }

    getState(): State {
        return this.state;
    }

}