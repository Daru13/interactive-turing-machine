import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateNode } from "../graph/nodes/StateNode";

/** A class with a static property to delete a state in a turing machine */
export class DeleteStateAction extends Action{
        static do(node: StateNode, turingMachine: TuringMachine): void {
                turingMachine.stateMachine.removeState(node.stateID);
    }
}
