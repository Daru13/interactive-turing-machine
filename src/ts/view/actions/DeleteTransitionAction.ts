import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { TransitionEdge } from "../edges/TransitionEdge";

/** A class with a static property to delete a transition in a turing machine */
export class DeleteTransitionAction extends Action{
    static do(edge: TransitionEdge, turingMachine: TuringMachine): void {
        let transitionIDs = edge.transitionIDs.slice();
        transitionIDs.forEach((transitionID) => {
            turingMachine.stateMachine.removeTransition(transitionID);
        });
    }
}
