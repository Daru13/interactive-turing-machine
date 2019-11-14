import { Event } from './EventManager';
import { State } from '../model/State';

/** A class for an event when a state became the current state. */
export class NewCurrentStateEvent implements Event {
  id: string = "newCurrentState";
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}
