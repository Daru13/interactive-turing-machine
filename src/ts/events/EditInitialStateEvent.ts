import { Event } from './EventManager';
import { State } from '../model/State';

export class EditInitialStateEvent implements Event {
  id: string = "editInitialState";
  state: State;
  isInitial: boolean;

  constructor(state: State, isInitial: boolean) {
    this.state = state;
    this.isInitial = isInitial;
  }
}
