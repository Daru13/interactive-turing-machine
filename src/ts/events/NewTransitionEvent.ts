import { Event } from './EventManager';
import { Transition } from '../model/Transition';

export class NewTransitionEvent implements Event {
  id: string = "newTransition";
  transition: Transition;

  constructor(transition: Transition) {
    this.transition = transition;
  }
}
