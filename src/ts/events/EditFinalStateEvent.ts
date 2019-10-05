import { Event } from './EventManager';
import { State } from '../model/State';

export class EditFinalStateEvent implements Event {
  id: string = "editFinalState";
  state: State;
  isFinal: boolean;

  constructor(state: State, isFinal: boolean) {
    this.state = state;
    this.isFinal = isFinal;
  }
}
