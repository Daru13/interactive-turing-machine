export function distance2(p1, p2){
	return Math.sqrt((p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y))
}

function norm2(v){
	return Math.sqrt(v.x*v.x + v.y*v.y)
}

export function angleToXAxis(p1, p2){
	return Math.atan2(p2.y-p1.y, p2.x-p1.x)
}

export function transformEvent(e: PointerEvent){
	e.preventDefault()
	e.stopPropagation()
	var pointerType = e.pointerType;
	if(e.pointerType === "mouse") {
		pointerType = "touch";
	}

	if(e.altKey && e.pointerType === "mouse") {
		pointerType = "pen";
	}

	if((e.pointerType === "pen" && e.button === 5) || (e.shiftKey && e.pointerType === "mouse")) {
		pointerType = "eraser";
	}

	if((e.pointerType === "pen" || e.pointerType === "mouse") && e.button === 2) {
		pointerType = "modify";
	}

	return {"pointerId":e.pointerId, "pointerType": pointerType, "x": e.clientX,"y": e.clientY, offsetX:e.offsetX, offsetY:e.offsetY, "originEvent": e, target:e.target};
}
