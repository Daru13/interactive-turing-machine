import { Graph } from "../graph/Graph";
import * as d3 from "d3-selection";
import { EdgeEditor } from "../editors/EdgeEditor";
import { NodeEditor } from "../editors/NodeEditor";
import { Node, NodeHandleSelection } from "../graph/Node";
import { Edge } from "../graph/Edge";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

export class EditNodeAction extends Action{
  static do(node: NodeHandleSelection, turingMachine: TuringMachine){
    new NodeEditor(node, turingMachine);
  }
}
