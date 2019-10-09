import { Graph } from "../graph/Graph";
import * as d3 from "d3-selection";
import { EdgeEditor } from "../editors/EdgeEditor";
import { NodeEditor } from "../editors/NodeEditor";
import { Node } from "../graph/Node";
import { Edge, EdgeHandleSelection } from "../graph/Edge";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

export class EditEdgeAction extends Action{
  static do(edge: EdgeHandleSelection, turingMachine: TuringMachine) {
    new EdgeEditor(edge, turingMachine.stateMachine);
  }
}
