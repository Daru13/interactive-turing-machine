import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { NodeTool } from "../tools/NodeTool";

export class Touch{
    nodeTool : NodeTool;
    turingMachine: TuringMachine;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
        this.nodeTool = new NodeTool(graph, turingMachine);
    }

    pointerDown(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerDown(e);
    }
    pointerMove(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerMove(e);
    }
    pointerUp(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerUp(e);
    }
    pointerLeave(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerLeave(e);
    }

    click(e: ModifiedPointerEvent): void {
        this.nodeTool.pointerClick(e);
    }
}