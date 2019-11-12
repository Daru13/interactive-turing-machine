import { TuringMachine } from "../../../model/TuringMachine";
import { Graph } from "../../graph/Graph";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { ToolBar } from "./ToolBar";
import { EdgeTool } from "./EdgeTool";
import { NodeTool } from "./NodeTool";
import { GraphEventDispatcher } from "../GraphEventDispatcher";


export enum toolName {
    NODE_TOOL = "nodeTool",
    EDGE_TOOL = "edgeTool"
}

type Tool = NodeTool | EdgeTool;

export class MouseDispatcher extends GraphEventDispatcher{
    selectedTool: toolName;
    readonly toolToInteraction: Record<toolName, Tool>;
    toolBar: ToolBar;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        super(graph, turingMachine);
        this.toolToInteraction = { } as Record<toolName, Tool>;
        this.toolBar = new ToolBar(this);
        this.setTool(graph, turingMachine);
    }

    setTool(graph: Graph, turingMachine: TuringMachine): void {
        this.toolToInteraction[toolName.NODE_TOOL] = new NodeTool(graph, turingMachine);
        this.toolToInteraction[toolName.EDGE_TOOL] = new EdgeTool(graph, turingMachine);
    }

    selectTool(tool: toolName): void {
        this.selectedTool = tool;
    }

    getTool(): toolName {
        return this.selectedTool;
    }

    dispatchDownEvent(e: ModifiedPointerEvent): void {
        super.dispatchDownEvent(e);
        this.toolToInteraction[this.selectedTool].pointerDown(e);
    }

    dispatchMoveEvent(e: ModifiedPointerEvent): void {
        super.dispatchMoveEvent(e);        
        this.toolToInteraction[this.selectedTool].pointerMove(e);
    }

    dispatchUpEvent(e: ModifiedPointerEvent): void {
        super.dispatchUpEvent(e);
        this.toolToInteraction[this.selectedTool].pointerUp(e);
    }

    dispatchLeaveEvent(e: ModifiedPointerEvent): void {
        super.dispatchLeaveEvent(e);
        this.toolToInteraction[this.selectedTool].pointerLeave(e);
    }

    dispatchClickEvent(e: ModifiedPointerEvent): void {
        super.dispatchClickEvent(e);
        this.toolToInteraction[this.selectedTool].pointerClick(e);
    }

    activate(): void {
        super.activate();
        this.toolBar.display();
    }

    deactivate(): void {
        super.deactivate();
        this.toolBar.hide();
    }
}
