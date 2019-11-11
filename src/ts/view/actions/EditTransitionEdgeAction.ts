import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";
import { TransitionEdgeEditor } from "../editors/TransitionEdgeEditor";

export class EditTransitionEdgeAction extends Action{
    static do(edge: TransitionEdge, turingMachine: TuringMachine): void {
        new TransitionEdgeEditor(edge, turingMachine);
    }
}
