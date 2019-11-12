import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { Helpers } from "../../helpers";
import { ModifiedPointerEvent } from "./ModifiedPointerEvent";

export abstract class GraphEventDispatcher {
    readonly graph: Graph;
    readonly turingMachine: TuringMachine;
    isActivated: boolean;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isActivated = false;
        this.setInteraction();
    }

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

    dispatchDownEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    dispatchMoveEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    dispatchUpEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    dispatchLeaveEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    dispatchClickEvent(e: ModifiedPointerEvent): void {
        Helpers.updateXYSVG(e, this.graph);
    }

    activate(): void {
        this.isActivated = true;
    }

    deactivate(): void {
        this.isActivated = false;
    }
}