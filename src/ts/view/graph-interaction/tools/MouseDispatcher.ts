import { TuringMachine } from "../../../model/TuringMachine";
import { Graph } from "../../graph/Graph";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { ToolBar } from "./ToolBar";
import { EdgeTool } from "./EdgeTool";
import { NodeTool } from "./NodeTool";
import { GraphEventDispatcher } from "../GraphEventDispatcher";

/**
 * Enumerates the possible tools
 */
export enum toolName {
    NODE_TOOL = "nodeTool",
    EDGE_TOOL = "edgeTool"
}

type Tool = NodeTool | EdgeTool;

/**
 * A class to dispatch event based on the selected tool
 */
export class MouseDispatcher extends GraphEventDispatcher{
    /** current tool used by the user. */
    selectedTool: toolName;
    /** tool name to an actual tool (EdgeTool.ts or NodeTool.ts).. */
    readonly toolToInteraction: Record<toolName, Tool>;
    /** the tool bar on the graph. */
    toolBar: ToolBar;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        super(graph, turingMachine);
        this.toolToInteraction = { } as Record<toolName, Tool>;
        this.toolBar = new ToolBar(this);
        this.setTool(graph, turingMachine);
    }

    /**
     * Creates on tool per tool name in the enum
     * @param graph 
     * @param turingMachine 
     */
    setTool(graph: Graph, turingMachine: TuringMachine): void {
        this.toolToInteraction[toolName.NODE_TOOL] = new NodeTool(graph, turingMachine);
        this.toolToInteraction[toolName.EDGE_TOOL] = new EdgeTool(graph, turingMachine);
    }

    /**
     * Set the current tool
     * @param tool current tool
     */
    selectTool(tool: toolName): void {
        this.selectedTool = tool;
    }

    /**
     * Gets the current tool
     * @returns current tool 
     */
    getTool(): toolName {
        return this.selectedTool;
    }

    /**
     * Dispatchs down event to the current tool
     * @param e 
     */
    dispatchDownEvent(e: ModifiedPointerEvent): void {
        super.dispatchDownEvent(e);
        this.toolToInteraction[this.selectedTool].pointerDown(e);
    }

    /**
     * Dispatchs move event to the current tool
     * @param e 
     */
    dispatchMoveEvent(e: ModifiedPointerEvent): void {
        super.dispatchMoveEvent(e);        
        this.toolToInteraction[this.selectedTool].pointerMove(e);
    }

    /**
     * Dispatchs up event to the current tool
     * @param e 
     */
    dispatchUpEvent(e: ModifiedPointerEvent): void {
        super.dispatchUpEvent(e);
        this.toolToInteraction[this.selectedTool].pointerUp(e);
    }

    /**
     * Dispatchs leave event to the current tool
     * @param e 
     */
    dispatchLeaveEvent(e: ModifiedPointerEvent): void {
        super.dispatchLeaveEvent(e);
        this.toolToInteraction[this.selectedTool].pointerLeave(e);
    }

    /**
     * Dispatchs click event to the current tool
     * @param e 
     */
    dispatchClickEvent(e: ModifiedPointerEvent): void {
        super.dispatchClickEvent(e);
        this.toolToInteraction[this.selectedTool].pointerClick(e);
    }

    /**
     * Activates the mouse interaction on the graph and display the tool bar
     */
    activate(): void {
        super.activate();
        this.toolBar.display();
    }

    /**
     * Deactivates the mouse interaction on the graph and hide the tool bar
     */
    deactivate(): void {
        super.deactivate();
        this.toolBar.hide();
    }
}
