import { Event } from './EventManager';
import { State } from '../model/State';

export class EditStateEvent implements Event {
  id: string = "editState";
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}
