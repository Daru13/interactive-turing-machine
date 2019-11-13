import { Action } from "./Action";
import { StateNode } from "../graph/nodes/StateNode";
import { TuringMachine } from "../../model/TuringMachine";

/** A class with a static property to move a state */
export class MoveStateAction extends Action{
    static do(node: StateNode, x: number, y: number, turingMachine: TuringMachine): void { 
        let state = turingMachine.stateMachine.getState(node.stateID);
        state.setPosition({ x: x, y: y });
    }
}
