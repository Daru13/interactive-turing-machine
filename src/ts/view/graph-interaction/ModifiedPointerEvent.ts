/** New type of pointer event by selecting needed attributes */
export interface ModifiedPointerEvent {
   pointerId: number; 
   pointerType: PointerEvent["pointerType"]; 
   x: number; 
   y: number; 
   offsetX: number; 
   offsetY: number; 
   pageX: number;
   pageY: number;
   originEvent: Event; 
   target: EventTarget;
}