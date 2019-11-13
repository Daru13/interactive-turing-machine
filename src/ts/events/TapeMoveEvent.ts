import { Event } from './EventManager';
import { HeadAction } from "../model/Tape";

/** A class for an event when the tape moved */
export class TapeMoveEvent implements Event {
  id: string = "tapeMove";
  headAction: HeadAction;

  constructor(headAction: HeadAction) {
    this.headAction = headAction;
  }
}