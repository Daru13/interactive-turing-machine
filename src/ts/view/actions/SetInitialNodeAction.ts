import { Action } from "./Action";
import { TuringMachine } from "../../model/TuringMachine";
import { StateNode } from "../graph/nodes/StateNode";

export class SetInitialNodeAction extends Action {
    static do(node: StateNode, turingMachine: TuringMachine): void {
        turingMachine.stateMachine.setInitialState(node.stateID);
    }
}