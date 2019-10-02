import { Event } from './EventManager';
import { Transition } from '../model/Transition';

export class EditTransitionEvent implements Event {
  id: string = "editTransition";
  transition: Transition;

  constructor(transition: Transition) {
    this.transition = transition;
  }
}
