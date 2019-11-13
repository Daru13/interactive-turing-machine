import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { EdgeTool } from "../tools/EdgeTool";
import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";

/**
 * A class to define actions to do when a user uses a pen
 */
export class Pen {
    /** edge tool associated to the pen */
    edgeTool: EdgeTool;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.edgeTool = new EdgeTool(graph, turingMachine);
    }

    /**
     * Action when the pen is down
     * @param e
     */
    pointerDown(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerDown(e);
    }

    /**
     * Action when the pen moves
     * @param e
     */
    pointerMove(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerMove(e);
    }

    /**
     * Action when the pen is up
     * @param e
     */
    pointerUp(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerUp(e);
    }

    /**
     * Action when the pen leaves
     * @param e
     */
    pointerLeave(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerLeave(e);
    }

    /**
     * Action when the pen cliks
     * @param e
     */
    click(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerClick(e);
    }
}