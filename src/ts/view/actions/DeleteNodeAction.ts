import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateNode } from "../graph/Node/StateNode";

export class DeleteNodeAction extends Action{
        static do(node: StateNode, tM: TuringMachine){
                tM.stateMachine.removeState(node.stateID);
                console.log(tM.stateMachine.toString());
    }
}
