import { TuringMachine } from "../../../model/TuringMachine";
import { Graph } from "../../graph/Graph";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { Pen } from "./Pen";
import { Eraser } from "./Eraser";
import { Touch } from "./Touch";
import { GraphEventDispatcher } from "../GraphEventDispatcher";

export class PenAndTouchDispatcher extends GraphEventDispatcher{
    readonly idToPenAndTouch: Record<string, any>;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        super(graph, turingMachine);
        this.idToPenAndTouch = { } as Record<string, any>;
    }

    dispatchDownEvent(e: ModifiedPointerEvent): void {
        super.dispatchDownEvent(e);
        switch (e.pointerType) {
            case "touch":
                this.idToPenAndTouch[e.pointerId] = new Touch(this.graph, this.turingMachine);
                break;
            case "pen":
                this.idToPenAndTouch[e.pointerId] = new Pen(this.graph, this.turingMachine);
                break;
            case "eraser":
                this.idToPenAndTouch[e.pointerId] = new Eraser(this.graph, this.turingMachine);
                break;
            case "modify":
            default:
        }
        this.idToPenAndTouch[e.pointerId].pointerDown(e);
    }

    dispatchMoveEvent(e: ModifiedPointerEvent): void {
        super.dispatchMoveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerMove(e);
        }
    }

    dispatchUpEvent(e: ModifiedPointerEvent): void {
        super.dispatchUpEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerUp(e);
        }
    }

    dispatchLeaveEvent(e: ModifiedPointerEvent): void {
        super.dispatchLeaveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerLeave(e);
        }
    }

    dispatchClickEvent(e: ModifiedPointerEvent): void {
        super.dispatchClickEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].click(e);
        }
    }
}
