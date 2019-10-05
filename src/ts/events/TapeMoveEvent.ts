import { Event } from './EventManager';
import { HeadAction } from "../model/Tape";

export class TapeMoveEvent implements Event {
  id: string = "tapeMove";
  headAction: HeadAction;

  constructor(headAction: HeadAction) {
    this.headAction = headAction;
  }
}