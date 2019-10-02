import { Event } from './EventManager';
import { Transition } from '../model/Transition';

export class DeleteTransitionEvent implements Event {
  id: string = "deleteTransition";
  transition: Transition;

  constructor(transition: Transition) {
    this.transition = transition;
  }
}
