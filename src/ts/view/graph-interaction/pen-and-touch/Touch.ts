import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { NodeTool } from "../tools/NodeTool";

/**
 * A class to define actions to do when a user uses touch
 */
export class Touch{
    /** node tool associated to touch. */
    nodeTool : NodeTool;
    /** turing machine to pass to the node tool. */
    turingMachine: TuringMachine;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
        this.nodeTool = new NodeTool(graph, turingMachine);
    }

    /**
     * Action when the touch is down
     * @param e
     */
    pointerDown(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerDown(e);
    }

    /**
     * Action when the touch moves
     * @param e
     */
    pointerMove(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerMove(e);
    }

    /**
     * Action when the touch is up
     * @param e
     */
    pointerUp(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerUp(e);
    }

    /**
     * Action when the touch leaves
     * @param e
     */
    pointerLeave(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerLeave(e);
    }

    /**
     * Action when the touch clicks
     * @param e
     */
    click(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerClick(e);
    }
}