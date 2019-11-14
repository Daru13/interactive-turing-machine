import { Event } from './EventManager';
import { State } from '../model/State';

/** A class for an event when final property of a state has been changed. */
export class EditFinalStateEvent implements Event {
  id: string = "editFinalState";
  state: State;
  isFinal: boolean;

  constructor(state: State, isFinal: boolean) {
    this.state = state;
    this.isFinal = isFinal;
  }
}
