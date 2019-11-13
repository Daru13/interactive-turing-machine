import { Event } from './EventManager';
import { State } from '../model/State';

/** A class for an event when a state was created */
export class NewStateEvent implements Event {
  id: string = "newState";
  state: State;
  x: number;
  y: number;

  constructor(state: State) {
    this.state = state;
  }
}
