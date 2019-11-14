import { Event } from './EventManager';
import { State } from '../model/State';

/** A class for an event when a state has been deleted. */
export class DeleteStateEvent implements Event {
  id: string = "deleteState";
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}
