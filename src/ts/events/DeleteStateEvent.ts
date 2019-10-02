import { Event } from './EventManager';
import { State } from '../model/State';

export class DeleteStateEvent implements Event {
  id: string = "deleteState";
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}
