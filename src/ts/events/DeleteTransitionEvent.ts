import { Event } from './EventManager';
import { Transition } from '../model/Transition';

/** A class for an event when a transition was deleted */
export class DeleteTransitionEvent implements Event {
  id: string = "deleteTransition";
  transition: Transition;

  constructor(transition: Transition) {
    this.transition = transition;
  }
}
