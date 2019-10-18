import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";

export class DeleteEdgeAction extends Action{
    static do(edge: TransitionEdge, tM: TuringMachine) {
        let transitions = edge.transitionIDs.slice();
        transitions.forEach((t) => {
            tM.stateMachine.removeTransition(t);
        });
        console.log(tM.stateMachine.toString());
    }
}
