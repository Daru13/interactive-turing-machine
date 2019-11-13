import { Event } from './EventManager';
import { InteractionStyles } from '../view/MenuBar';

/** A class for an event when the interaction style changed */
export class ChangeInteractionStyle implements Event {
    id: string = "changeInteractionStyle";
    interactionStyle: InteractionStyles;

    constructor(interactionStyle: InteractionStyles) {
        this.interactionStyle = interactionStyle;
    }
}