

export type EventID = string;


export interface Event {
	id: EventID;
}


export interface EventHandler<E extends Event> {
	handle: (event: E) => void;
}


export class EventManager {
	
	private static eventHandlers: Map<EventID, EventHandler<any>[]>;

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
			handler.handle(event);
		}
	}

	static registerHandler<E extends Event>(event: E, handler: EventHandler<E>) {
		let eventID = event.id;		

		if (! EventManager.eventHandlers.has(eventID)) {
			EventManager.eventHandlers.set(eventID, []);
		}

		let handlers = EventManager.eventHandlers.get(eventID);
		handlers.push(handler);
	}
}
