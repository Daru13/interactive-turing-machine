import { TMError } from "./TMError";
import { TuringMachine } from "../model/TuringMachine";
import { StateNode } from "../view/graph/Node/StateNode";

export class NoInitialStateError extends TMError {
    node: StateNode;

    constructor(turingMachine: TuringMachine) {
        super(turingMachine);
        this.text = "no initial state";
    }
}