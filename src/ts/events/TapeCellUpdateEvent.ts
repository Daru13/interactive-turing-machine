import { Event } from './EventManager';
import { TapeSymbol } from '../model/Tape';

/** A class for an event when value of a cell in the tape changed. */
export class TapeCellUpdateEvent implements Event {
  id: string = "tapeCellUpdate";
  symbol: TapeSymbol;
  index: number;

  constructor(symbol: TapeSymbol, index: number) {
    this.symbol = symbol;
    this.index = index;
  }
}
