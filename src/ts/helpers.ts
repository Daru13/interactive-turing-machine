import { ModifiedPointerEvent } from "./view/graph-interaction/ModifiedPointerEvent";
import { Graph } from "./view/Graph";

/** Redefines d3 selection type to have shorter version. */
export interface Selection<
	E extends Element,
	P extends Element = Element,
	EDatum extends object = object,
	PDatum extends object = object
> extends d3.Selection<E, EDatum, P, PDatum> { }

/** defines a point. */
export interface Point {
	x: number;
	y: number;
}

/** a class with various function to help. */
export class Helpers{
    /**
     * Compute distance between two points
     * @param p1
     * @param p2
     * @returns the distance between p1 and p2 for the norm 2
     */
    static distance2(p1: Point, p2: Point): number {
		return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
	}

    /**
     * Compute the norm 2 of a vector
     * @param v a vector
     * @returns return the norm 2 of v 
     */
    static norm2(v: Point): number {
		return Math.sqrt(v.x * v.x + v.y * v.y);
	}

    /**
     * Returns the angle between a vector and the x axis
     * @param p1 start point of the vector
     * @param p2 end point of the vecotr
     * @returns the angle between p1->p2 and the x axis
     */
    static angleToXAxis(p1: Point, p2: Point): number {
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	}

    /**
     * Transforms pointer event in modified pointer event
     * @param e 
     * @returns return a modified pointer event based on e
     */
    static transformEvent(e: PointerEvent): ModifiedPointerEvent {
		e.preventDefault();
        e.stopPropagation();
		let pointerType = e.pointerType;
		if (e.pointerType === "mouse") {
			pointerType = "touch";
		}

		if (e.altKey && e.pointerType === "mouse") {
			pointerType = "pen";
		}

		if ((e.pointerType === "pen" && e.button === 5) || (e.shiftKey && e.pointerType === "mouse")) {
			pointerType = "eraser";
		}

		if ((e.pointerType === "pen" || e.pointerType === "mouse") && e.button === 2) {
			pointerType = "modify";
		}

		return { "pointerId": e.pointerId, "pointerType": pointerType, "x": e.clientX, "y": e.clientY, offsetX: e.offsetX, offsetY: e.offsetY, pageX: e.clientX, pageY: e.clientY, "originEvent": e, target: e.target};
    }
    
    /**
     * Updates the x and y position of an event on the window to the x and y position in the graph
     * @param e event with x and y
     * @param graph
     */
    static updateXYSVG(e: ModifiedPointerEvent, graph: Graph): void {
		let pt = graph.getSVGElement().createSVGPoint(), svgP;

		pt.x = e.x;
		pt.y = e.y;
		svgP = pt.matrixTransform(graph.getSVGElement().getScreenCTM().inverse());
		e.x = svgP.x;
		e.y = svgP.y;
	}
}