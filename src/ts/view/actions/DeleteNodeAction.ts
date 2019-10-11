import {  NodeHandleSelection } from "../graph/Node";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

export class DeleteNodeAction extends Action{
        static do(node: NodeHandleSelection, tM: TuringMachine){
                tM.stateMachine.removeState(node.datum().stateID);
                console.log(tM.stateMachine.toString());
    }
}
