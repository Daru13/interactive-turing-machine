import { Event } from './EventManager';

/** A class for an event when the tape position changed. */
export class TapeNewPosEvent implements Event {
  id: string = "tapeNewPos";
  headPos: number;

  constructor(headPos: number) {
    this.headPos = headPos;
  }
}