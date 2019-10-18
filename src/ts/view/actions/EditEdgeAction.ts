import { Graph } from "../graph/Graph";
import * as d3 from "d3-selection";
import { EdgeEditor } from "../editors/EdgeEditor";
import { NodeEditor } from "../editors/NodeEditor";
import { EdgeSelection } from "../graph/Edge/Edge";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";

export class EditEdgeAction extends Action{
    static do(edge: TransitionEdge, turingMachine: TuringMachine) {
        new EdgeEditor(edge, turingMachine.stateMachine);
    }
}
