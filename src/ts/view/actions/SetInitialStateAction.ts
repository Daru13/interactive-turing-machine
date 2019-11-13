import { Action } from "./Action";
import { TuringMachine } from "../../model/TuringMachine";
import { StateNode } from "../graph/nodes/StateNode";

/** A class with a static property to set the initial state of a turing machine */
export class SetInitialStateAction extends Action {
    static do(node: StateNode, turingMachine: TuringMachine): void {
        turingMachine.stateMachine.setInitialState(node.stateID);
    }
}