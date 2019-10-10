import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Edge, EdgeHandleSelection } from "../graph/Edge";
import { Node, NodeHandleSelection } from "../graph/Node";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateMachine } from "../../model/StateMachine";

export class DeleteEdgeAction extends Action{
  static do(edge: EdgeHandleSelection, tM: TuringMachine) {
    tM.stateMachine.removeTransition(edge.datum().transitionID);
    console.log(tM.stateMachine.toString());
  }
}
