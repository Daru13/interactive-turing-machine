"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventManager {
    static emit(event) {
        let eventID = event.id;
        if (!EventManager.eventHandlers.has(eventID)) {
            return;
        }
        let handlers = EventManager.eventHandlers.get(eventID);
        for (let handler of handlers) {
            handler(event);
        }
    }
    static registerHandler(eventID, handler) {
        if (!EventManager.eventHandlers.has(eventID)) {
            EventManager.eventHandlers.set(eventID, []);
        }
        let handlers = EventManager.eventHandlers.get(eventID);
        handlers.push(handler);
    }
    static unregisterHandler(eventID, handler) {
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
exports.EventManager = EventManager;
EventManager.eventHandlers = new Map();
//# sourceMappingURL=EventManager.js.map