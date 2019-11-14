import { Graph } from "../../Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import * as d3 from "d3-selection";
import { DeleteTransitionAction } from "../../actions/DeleteTransitionAction";
import { DeleteStateAction } from "../../actions/DeleteStateAction";
import { TransitionEdge } from "../../edges/TransitionEdge";
import { StateNode } from "../../nodes/StateNode";

/**
 * A class to defines action to do when a user uses the eraser of the microsoft pen.
 */
export class Eraser{
    /** Turing machine to modify. */
    turingMachine: TuringMachine;
    /** Target touched by the eraser. */
    target: d3.BaseType;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
    }

    /**
     * Action when the eraser is down.
     * @param e 
     */
    pointerDown(e: ModifiedPointerEvent): void { 
        this.target = e.target as d3.BaseType;
    }

    /**
     * Action when the eraser moves.
     * @param e
     */
    pointerMove(e: ModifiedPointerEvent): void { 
    }

    /**
     * Action when the eraser is up.
     * @param e
     */
    pointerUp(e: ModifiedPointerEvent): void { 
        let targetSelection = d3.select(this.target);

        if (StateNode.isStateNode(targetSelection)) {
            DeleteStateAction.do(StateNode.getStateNode(targetSelection), this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            DeleteTransitionAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
    }

    /**
     * Action when the eraser leaves.
     * @param e
     */
    pointerLeave(e: ModifiedPointerEvent): void { 
    }

    /**
     * Action when the eraser clicks.
     * @param e
     */
    click(e: ModifiedPointerEvent): void { }
}
