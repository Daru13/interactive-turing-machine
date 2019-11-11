import { TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";
import { HeadAction } from "../../model/Tape";
import { Action } from "./Action";
import { StateNode } from "../graph/Node/StateNode";

export class CreateEdgeAction extends Action {
    static do(fromNode: StateNode, toNode: StateNode, turingMachine: TuringMachine){
        turingMachine.stateMachine
            .addTransition(new Transition(
                turingMachine.stateMachine.getState(fromNode.stateID),
                turingMachine.stateMachine.getState(toNode.stateID),
                "",
                "",
                HeadAction.MoveRight));
    }
}
