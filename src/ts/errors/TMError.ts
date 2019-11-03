import { TuringMachine } from "../model/TuringMachine";

export class TMError {
    turingMachine: TuringMachine;
    name: string;
    text: string;

    constructor(turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
        this.name = "error";
        this.text = "";
    }
}