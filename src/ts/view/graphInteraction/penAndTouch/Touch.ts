import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { NodeTool } from "../tools/NodeTool";

export class Touch{
    nodeTool : NodeTool
    turingMachine: TuringMachine;

    constructor(graph: Graph, turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        this.nodeTool = new NodeTool(graph, turingMachine);
    }

    pointerDown(e: ModifiedPointerEvent) {
        this.nodeTool.pointerDown(e);
    };
    pointerMove(e: ModifiedPointerEvent) {
        this.nodeTool.pointerMove(e);
    };
    pointerUp(e: ModifiedPointerEvent) {
        this.nodeTool.pointerUp(e);
    };
    pointerLeave(e: ModifiedPointerEvent) {
        this.nodeTool.pointerLeave(e);
    };

    click(e: ModifiedPointerEvent){
        this.nodeTool.pointerClick(e);
    }
}