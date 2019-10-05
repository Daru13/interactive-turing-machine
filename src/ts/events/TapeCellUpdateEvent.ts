import { Event } from './EventManager';
import { Transition } from '../model/Transition';
import { TapeSymbol } from '../model/Tape';

export class TapeCellUpdateEvent implements Event {
  id: string = "tapeCellUpdate";
  symbol: TapeSymbol;
  index: number;

  constructor(symbol: TapeSymbol, index: number) {
    this.symbol = symbol;
    this.index = index;
  }
}
