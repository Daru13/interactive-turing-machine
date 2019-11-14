import { Event } from './EventManager';
import { State } from '../model/State';

/** A class for an event when intial property of a state changed. */
export class EditInitialStateEvent implements Event {
  id: string = "editInitialState";
  state: State;
  isFirstInitialState: boolean;

  constructor(state: State, isFirstInitialState: boolean) {
    this.state = state;
    this.isFirstInitialState = isFirstInitialState;
  }
}
