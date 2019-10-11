import { Event } from './EventManager';
import { State } from '../model/State';

export class NewStateEvent implements Event {
  id: string = "newState";
  state: State;
  x: number;
  y: number;

  constructor(state: State) {
    this.state = state;
  }
}
