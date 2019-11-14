import { Graph } from "../Graph";
import { TuringMachine } from "../../model/TuringMachine";

/**
 * Abstract class for an action. An action allow to apply changes on a Turing machine
 */
export abstract class Action{
    constructor(graph: Graph, turingMachine: TuringMachine) { }

    /** Do action on the turing machine */
    do(): void { }
}