import { Helpers } from "../../helpers";
import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Node, NodeHandleSelection } from "../graph/Node";
import {    TuringMachine } from "../../model/TuringMachine";
import { Transition } from "../../model/Transition";
import { HeadAction } from "../../model/Tape";
import { Action } from "./Action";
import { StateMachine } from "../../model/StateMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";

export class CreateEdgeAction extends Action{
    static do(fromNode: NodeHandleSelection, toNode: NodeHandleSelection, tM: TuringMachine){
        tM.stateMachine
            .addTransition(new Transition(
                tM.stateMachine.getState(fromNode.datum().stateID),
                tM.stateMachine.getState(toNode.datum().stateID),
                "unknown",
                "unknown",
                HeadAction.None));
        console.log(tM.stateMachine.toString());
    }
}
