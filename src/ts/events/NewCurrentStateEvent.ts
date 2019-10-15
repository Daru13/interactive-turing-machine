import { Event } from './EventManager';
import { State } from '../model/State';

export class NewCurrentStateEvent implements Event {
  id: string = "newCurrentState";
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}
