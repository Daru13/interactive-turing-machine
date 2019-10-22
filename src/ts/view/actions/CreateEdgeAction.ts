import {    TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";
import { HeadAction } from "../../model/Tape";
import { Action } from "./Action";
import { StateNode } from "../graph/Node/StateNode";

export class CreateEdgeAction extends Action {
    static do(fromNode: StateNode, toNode: StateNode, tM: TuringMachine){
        tM.stateMachine
            .addTransition(new Transition(
                tM.stateMachine.getState(fromNode.stateID),
                tM.stateMachine.getState(toNode.stateID),
                "",
                "",
                HeadAction.MoveRight));
        console.log(tM.stateMachine.toString());
    }
}
