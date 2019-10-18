import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";

export abstract class Action{
    constructor(graph: Graph, turingMachine: TuringMachine){}
    do(){};
}