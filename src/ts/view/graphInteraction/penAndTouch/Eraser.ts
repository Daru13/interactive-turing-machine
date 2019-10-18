import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import * as d3 from "d3-selection";
import { DeleteEdgeAction } from "../../actions/DeleteEdgeAction";
import { DeleteNodeAction } from "../../actions/DeleteNodeAction";
import { TransitionEdge } from "../../graph/Edge/TransitionEdge";
import { StateNode } from "../../graph/Node/StateNode";

export class Eraser{
    tM: TuringMachine;
    target: d3.BaseType;

    constructor(graph: Graph, turingMachine: TuringMachine){
        this.tM = turingMachine;
    }

    pointerDown(e: ModifiedPointerEvent) { 
        this.target = e.target as d3.BaseType;
    };
    pointerMove(e: ModifiedPointerEvent) { 
    };
    pointerUp(e: ModifiedPointerEvent) { 
        let targetSelection = d3.select(this.target);

        if (StateNode.isStateNode(targetSelection)) {
            DeleteNodeAction.do(StateNode.getStateNode(targetSelection), this.tM)
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            DeleteEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.tM);
        }
    };
    pointerLeave(e: ModifiedPointerEvent) { 
    };
    click(e: ModifiedPointerEvent) { }
}
