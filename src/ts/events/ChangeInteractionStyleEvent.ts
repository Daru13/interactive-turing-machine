import { Event } from './EventManager';
import { InteractionStyles } from '../view/MenuBar';

export class ChangeInteractionStyle implements Event {
    id: string = "changeInteractionStyle";
    interactionStyle: InteractionStyles;

    constructor(interactionStyle: InteractionStyles) {
        this.interactionStyle = interactionStyle;
    }
}