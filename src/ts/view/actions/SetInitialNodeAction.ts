import { Action } from "./Action";
import { TuringMachine } from "../../model/TuringMachine";
import { NodeHandleSelection } from "../graph/Node/Node";

export class SetInitialNodeAction extends Action {
    static do(node: NodeHandleSelection, turingMachine: TuringMachine) {
        turingMachine.stateMachine.setInitialState(node.datum().stateID);
    }
}