import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Edge, EdgeHandleSelection } from "../graph/Edge";
import { Node, NodeHandleSelection } from "../graph/Node";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateMachine } from "../../model/StateMachine";

export class DeleteNodeAction extends Action{
  static do(node: NodeHandleSelection, tM: TuringMachine){
      tM.stateMachine.removeState(node.datum().stateID);
      console.log(tM.stateMachine.toString());
  }
}
