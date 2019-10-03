export interface ModifiedPointerEvent{
   pointerId: number, 
   pointerType: PointerEvent["pointerType"], 
   x: number, 
   y: number, 
   offsetX: number, 
   offsetY: number, 
   originEvent: Event, 
   target: EventTarget
};