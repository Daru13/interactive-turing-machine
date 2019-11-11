import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";

export class DeleteEdgeAction extends Action{
    static do(edge: TransitionEdge, turingMachine: TuringMachine) {
        let transitionIDs = edge.transitionIDs.slice();
        transitionIDs.forEach((transitionID) => {
            turingMachine.stateMachine.removeTransition(transitionID);
        });
    }
}
