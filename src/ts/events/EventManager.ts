export type EventID = string;

/** Interface for personalized events. */
export interface Event {
	id: EventID;
}

export type EventHandler<E extends Event> = (event: E) => void;

/** A class to emit events, add event listeners and remove event listeners. */
export class EventManager {

    /** List of event listener per personalized event. */
	private static eventHandlers: Map<EventID, EventHandler<any>[]> = new Map();

    /**
     * Emits an event.
     * @param event event to emit.
     */
    static emit(event: Event): void {
		let eventID = event.id;

		if (! EventManager.eventHandlers.has(eventID)) {
			return;
		}

		let handlers = EventManager.eventHandlers.get(eventID);
		for (let handler of handlers) {
			handler(event);
		}
	}

    /**
     * Registers a handler for an event.
     * @param eventID event that the handler wants to receive.
     * @param handler the handler to register.
     */
    static registerHandler<E extends Event>(eventID: EventID, handler: EventHandler<E>): void {
		if (! EventManager.eventHandlers.has(eventID)) {
			EventManager.eventHandlers.set(eventID, []);
		}

		let handlers = EventManager.eventHandlers.get(eventID);
		handlers.push(handler);
    }
    
    /**
     * Unregisters a handler for an event.
     * @param eventID event that the handler wants to be removed from.
     * @param handler the handler to unregister.
     */
	static unregisterHandler<E extends Event>(eventID: EventID, handler: EventHandler<E>): void {
		let handlers = EventManager.eventHandlers.get(eventID);
		let handlerIndex = handlers.indexOf(handler);

		if (handlerIndex >= 0) {
			handlers.splice(handlerIndex, 1);
		}

		if (handlers.length === 0) {
			EventManager.eventHandlers.delete(eventID);
		}
	}
}
