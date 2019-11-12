import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import * as d3 from "d3-selection";
import { DeleteEdgeAction } from "../../actions/DeleteEdgeAction";
import { DeleteNodeAction } from "../../actions/DeleteNodeAction";
import { TransitionEdge } from "../../graph/edges/TransitionEdge";
import { StateNode } from "../../graph/nodes/StateNode";

export class Eraser{
    turingMachine: TuringMachine;
    target: d3.BaseType;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
    }

    pointerDown(e: ModifiedPointerEvent): void { 
        this.target = e.target as d3.BaseType;
    }

    pointerMove(e: ModifiedPointerEvent): void { 
    }

    pointerUp(e: ModifiedPointerEvent): void { 
        let targetSelection = d3.select(this.target);

        if (StateNode.isStateNode(targetSelection)) {
            DeleteNodeAction.do(StateNode.getStateNode(targetSelection), this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            DeleteEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
    }

    pointerLeave(e: ModifiedPointerEvent): void { 
    }

    click(e: ModifiedPointerEvent): void { }
}
