import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { StateNode } from "../view/graph/Node/StateNode";

export class NoInitialStateError extends TMError {
    node: StateNode;

    constructor(turingMachine: TuringMachine) {
        super(turingMachine);
        this.name = "No initial state";
        this.text = "Draw an edge from the generator on the left to a state to make that state the initial state";
    }
}