import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";

export type TapeSymbol = string;


export enum HeadAction {
    MoveLeft,
    MoveRight,
    None
}


export class Tape {

    private content: TapeSymbol[];
    private headPosition: number;

    constructor(content: TapeSymbol[] = []) {
        this.content = content;
        this.resetHeadPosition();
    }

    getHeadPosition(): number {
        return this.headPosition;
    }

    getSymbolAt(index: number) {
        return this.content[index];
    }

    setSymbolAt(index: number, symbol: TapeSymbol) {
        this.content[index] = symbol;
        EventManager.emit(new TapeCellUpdateEvent(symbol, index));
    }

    getCurrentSymbol(): TapeSymbol {
        return this.getSymbolAt(this.headPosition);
    }

    setCurrentSymbol(symbol: TapeSymbol) {
        this.setSymbolAt(this.headPosition, symbol);
        EventManager.emit(new TapeCellUpdateEvent(symbol, this.getHeadPosition()));
    }

    setContent(content: TapeSymbol[]) {
        this.content = content;
    }

    getContent(): TapeSymbol[] {
        return this.content;
    }

    applyHeadAction(action: HeadAction) {
        switch (action) {
            case HeadAction.MoveLeft:
                Math.max(0, this.headPosition--);
                break;

            case HeadAction.MoveRight:
                this.headPosition++;
                break;

            case HeadAction.None:
            default:
                break;
        }

        EventManager.emit(new TapeMoveEvent(action));
    }

    resetHeadPosition() {
        this.headPosition = 0;
         
        EventManager.emit(new TapeNewPosEvent(0));
    }

    toString() {
        return "[head at " + this.headPosition + " ]\n"
             + this.content.toString();
    }
}