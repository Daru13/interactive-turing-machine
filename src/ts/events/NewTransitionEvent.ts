import { Event } from './EventManager';
import { Transition } from '../model/Transition';

/** A class for an event when a transition has been added */
export class NewTransitionEvent implements Event {
  id: string = "newTransition";
  transition: Transition;

  constructor(transition: Transition) {
    this.transition = transition;
  }
}
