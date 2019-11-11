import { ModifiedPointerEvent } from "./events/ModifiedPointerEvent";
import { Graph } from "./view/graph/Graph";

export class Helpers{
    static distance2(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
		return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
	}

    static norm2(v: { x: number, y: number }): number {
		return Math.sqrt(v.x * v.x + v.y * v.y);
	}

    static angleToXAxis(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	}

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
    
	static updateXYSVG(e: ModifiedPointerEvent, graph: Graph): void {
		let pt = graph.getSVGElement().createSVGPoint(), svgP;

		pt.x = e.x;
		pt.y = e.y;
		svgP = pt.matrixTransform(graph.getSVGElement().getScreenCTM().inverse());
		e.x = svgP.x;
		e.y = svgP.y;
	}
}