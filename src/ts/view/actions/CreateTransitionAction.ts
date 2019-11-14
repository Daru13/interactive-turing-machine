import { TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";
import { HeadAction } from "../../model/Tape";
import { Action } from "./Action";
import { StateNode } from "../nodes/StateNode";

/** A class with a static property to add a transition in a turing machine. */
export class CreateTransitionAction extends Action {
    static do(originNode: StateNode, destinationNode: StateNode, turingMachine: TuringMachine): void {
        turingMachine.stateMachine
            .addTransition(new Transition(
                turingMachine.stateMachine.getState(originNode.stateID),
                turingMachine.stateMachine.getState(destinationNode.stateID),
                "",
                "",
                HeadAction.MoveRight));
    }
}
