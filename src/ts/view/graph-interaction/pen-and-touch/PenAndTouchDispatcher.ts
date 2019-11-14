import { TuringMachine } from "../../../model/TuringMachine";
import { Graph } from "../../Graph";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { Pen } from "./Pen";
import { Eraser } from "./Eraser";
import { Touch } from "./Touch";
import { GraphEventDispatcher } from "../GraphEventDispatcher";

/**
 * A class to dispatch event based on type of the pointer used in Pen and touch interaction
 */
export class PenAndTouchDispatcher extends GraphEventDispatcher{
    /** Event id to the corresponding pen, touch or eraser. */
    readonly idToPenAndTouch: Record<string, any>;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        super(graph, turingMachine);
        this.idToPenAndTouch = { } as Record<string, any>;
    }

    /**
     * Dispatchs down event
     * @param e 
     */
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

    /**
     * Dispatchs move event
     * @param e 
     */
    dispatchMoveEvent(e: ModifiedPointerEvent): void {
        super.dispatchMoveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerMove(e);
        }
    }

    /**
     * Dispatchs up event
     * @param e 
     */
    dispatchUpEvent(e: ModifiedPointerEvent): void {
        super.dispatchUpEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerUp(e);
        }
    }

    /**
     * Dispatchs leave event
     * @param e 
     */
    dispatchLeaveEvent(e: ModifiedPointerEvent): void {
        super.dispatchLeaveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerLeave(e);
        }
    }

    /**
     * Dispatchs click event
     * @param e 
     */
    dispatchClickEvent(e: ModifiedPointerEvent): void {
        super.dispatchClickEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].click(e);
        }
    }
}
