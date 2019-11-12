import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateNode } from "../graph/nodes/StateNode";

export class DeleteNodeAction extends Action{
        static do(node: StateNode, turingMachine: TuringMachine): void {
                turingMachine.stateMachine.removeState(node.stateID);
    }
}
