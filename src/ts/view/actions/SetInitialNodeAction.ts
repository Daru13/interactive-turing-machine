import { Action } from "./Action";
import { TuringMachine } from "../../model/TuringMachine";
import { StateNode } from "../graph/Node/StateNode";

export class SetInitialNodeAction extends Action {
    static do(node: StateNode, turingMachine: TuringMachine) {
        turingMachine.stateMachine.setInitialState(node.stateID);
    }
}