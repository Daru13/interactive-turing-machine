import * as d3 from "d3-selection";
import { EdgeHandleSelection } from "../graph/Edge";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

export class DeleteEdgeAction extends Action{
    static do(edge: EdgeHandleSelection, tM: TuringMachine) {
        tM.stateMachine.removeTransition(edge.datum().transitionID);
        console.log(tM.stateMachine.toString());
    }
}
