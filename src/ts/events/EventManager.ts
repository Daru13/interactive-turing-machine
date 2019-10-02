

export type EventID = string;


export interface Event {
	id: EventID;
}


export type EventHandler<E extends Event> = (event: E) => void;


export class EventManager {

	private static eventHandlers: Map<EventID, EventHandler<any>[]> = new Map();

	//constructor() {
	//	this.eventHandlers = new Map();
	//}

	static emit(event: Event) {
		let eventID = event.id;

		if (! EventManager.eventHandlers.has(eventID)) {
			return;
		}

		let handlers = EventManager.eventHandlers.get(eventID);
		for (let handler of handlers) {
			handler(event);
		}
	}

	static registerHandler<E extends Event>(eventID: EventID, handler: EventHandler<E>) {
		if (! EventManager.eventHandlers.has(eventID)) {
			EventManager.eventHandlers.set(eventID, []);
		}

		let handlers = EventManager.eventHandlers.get(eventID);
		handlers.push(handler);
	}
}
