import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { EdgeTool } from "../tools/EdgeTool";
import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";

export class Pen {
    edgeTool: EdgeTool;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.edgeTool = new EdgeTool(graph, turingMachine);
    }

    pointerDown(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerDown(e);
    }
    pointerMove(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerMove(e);
    }
    pointerUp(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerUp(e);
    }
    pointerLeave(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerLeave(e);
    }
    click(e: ModifiedPointerEvent): void {
        this.edgeTool.pointerClick(e);
    }
}