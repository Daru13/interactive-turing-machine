import { Event } from "./EventManager";

/** A class for an event when the content of the tape changed */
export class TapeContentUpdateEvent implements Event {
    id: string = "tapeContentUpdate";
}