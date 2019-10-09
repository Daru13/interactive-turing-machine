import { Event } from './EventManager';
import { HeadAction } from "../model/Tape";

export class TapeNewPosEvent implements Event {
  id: string = "tapeNewPos";
  headPos: number;

  constructor(headPos: number) {
    this.headPos = headPos;
  }
}