import { TuringMachine } from "../model/TuringMachine";

export class TMError {
    turingMachine: TuringMachine;
    text: string;

    constructor(turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
        this.text = "";
    }
}