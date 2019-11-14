import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { Helpers } from "../../helpers";
import { ModifiedPointerEvent } from "./ModifiedPointerEvent";

/** An abstract class to defines a dispatcher of pointer event happening on a graph. */
export abstract class GraphEventDispatcher {
    /** graph where the events are happening. */
    readonly graph: Graph;
    /** turing machine associated to the graph. */
    readonly turingMachine: TuringMachine;
    /** should this dispatcher process the events. */
    isActivated: boolean;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isActivated = false;
        this.setInteraction();
    }

    /**
     * Sets pointer events on the graph
     */
    setInteraction(): void {
        let timeDown: Record<number, number> = { };

        this.graph.getSVGElement()
            .addEventListener("pointerdown", (e) => {
                if (this.isActivated) {
                    timeDown[e.pointerId] = new Date().getTime();
                    this.dispatchDownEvent(Helpers.transformEvent(e));
                }
            });

        this.graph.getSVGElement()
            .addEventListener("pointermove", (e) => {
                if (this.isActivated) {
                    this.dispatchMoveEvent(Helpers.transformEvent(e));
                }
            });

        this.graph.getSVGElement()
            .addEventListener("pointerup", (e) => {
                if (this.isActivated) {
                    this.dispatchUpEvent(Helpers.transformEvent(e));
                    if (Math.abs(new Date().getTime() - timeDown[e.pointerId]) < 200) {
                        this.dispatchClickEvent(Helpers.transformEvent(e));
                    }
                }
            });

        this.graph.getSVGElement()
            .addEventListener("pointerleave", (e) => {
                if (this.isActivated) {
                    this.dispatchLeaveEvent(Helpers.transformEvent(e));
                }
            });

        this.graph.getSVGElement()
            .addEventListener("pointercancel", (e) => {
                if (this.isActivated) {
                    console.log("cancel");
                }
            });
    }

    /**
     * Dispatchs down event
     * @param e 
     */
    dispatchDownEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    /**
     * Dispatchs move event
     * @param e 
     */
    dispatchMoveEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    /**
     * Dispatchs up event
     * @param e 
     */
    dispatchUpEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    /**
     * Dispatchs leave event
     * @param e 
     */
    dispatchLeaveEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    /**
     * Dispatchs click event
     * @param e 
     */
    dispatchClickEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    /**
     * Activates the graph event dispatcher
     */
    activate(): void {
        this.isActivated = true;
    }

    /**
     * Deactivates the graph event dispatcher
     */
    deactivate(): void {
        this.isActivated = false;
    }
}