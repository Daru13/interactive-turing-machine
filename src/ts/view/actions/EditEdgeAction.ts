import { EdgeEditor } from "../editors/EdgeEditor";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";

export class EditEdgeAction extends Action{
    static do(edge: TransitionEdge, turingMachine: TuringMachine) {
        new EdgeEditor(edge, turingMachine.stateMachine);
    }
}
