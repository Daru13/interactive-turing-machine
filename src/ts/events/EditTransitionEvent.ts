import { Event } from './EventManager';
import { Transition } from '../model/Transition';

/** A class for an event when the input symbol, output symbol or head action of a transition changed. */
export class EditTransitionEvent implements Event {
  id: string = "editTransition";
  transition: Transition;

  constructor(transition: Transition) {
    this.transition = transition;
  }
}
