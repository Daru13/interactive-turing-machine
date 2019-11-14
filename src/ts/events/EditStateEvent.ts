import { Event } from './EventManager';
import { State } from '../model/State';

/** A class for an event when the label of state changed. */
export class EditStateEvent implements Event {
  id: string = "editState";
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}
