import { Event } from './EventManager';
import { State, Position } from '../model/State';

/** A class for an event when the position of a state changed */
export class moveStateEvent implements Event {
    id: string = "moveState";
    position: Position;
    state: State;

    constructor(state: State, position: Position) {
        this.state = state;
        this.position = position;
    }
}