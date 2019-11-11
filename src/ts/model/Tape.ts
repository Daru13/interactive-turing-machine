import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";
import { TapeContentUpdateEvent } from "../events/TapeContentUpdateEvent";

export type TapeSymbol = string;

export enum HeadAction {
    MoveLeft,
    MoveRight,
    None
}

export interface TapeExport {
    content: TapeSymbol[];
}

export class Tape {
    private static readonly EMPTY_CELL_FILLING_CHAR: string = " ";

    private content: TapeSymbol[];
    private headPosition: number;

    constructor(content: TapeSymbol[] = []) {
        this.content = content;
        this.resetHeadPosition();
    }

    getHeadPosition(): number {
        return this.headPosition;
    }

    getSymbolAt(index: number): TapeSymbol {
        return this.content[index];
    }

    setSymbolAt(index: number, symbol: TapeSymbol): void {
        this.content[index] = symbol;
        this.fillEmptyCellsBefore(index);

        EventManager.emit(new TapeCellUpdateEvent(symbol, index));
    }

    getCurrentSymbol(): TapeSymbol {
        return this.getSymbolAt(this.headPosition);
    }

    setCurrentSymbol(symbol: TapeSymbol): void {
        this.setSymbolAt(this.headPosition, symbol);

        EventManager.emit(new TapeCellUpdateEvent(symbol, this.getHeadPosition()));
    }

    setContent(content: TapeSymbol[]): void {
        this.content = content;

        EventManager.emit(new TapeContentUpdateEvent());
    }

    setContentFromString(content: string): void {
        this.setContent(Array.from(content));
    }

    getContent(): TapeSymbol[] {
        return this.content;
    }

    getContentAsString(): string {
        return this.content.join("");
    }

    clearContent(): void {
        this.content = [];
    }

    private fillEmptyCellsBefore(index: number = this.content.length): void {
        for (let i = 0; i < index; i++) {
            if (this.content[i] === undefined) {
                this.content[i] = Tape.EMPTY_CELL_FILLING_CHAR;
            }
        }
    }

    applyHeadAction(action: HeadAction): void {
        switch (action) {
            case HeadAction.MoveLeft:
                this.headPosition = Math.max(0, this.headPosition - 1);
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

    resetHeadPosition(): void {
        this.headPosition = 0;
         
        EventManager.emit(new TapeNewPosEvent(0));
    }

    toString(): string {
        return "[head at " + this.headPosition + " ]\n"
             + this.content.toString();
    }

    export(): TapeExport {
        return {
            content: this.content
        };
    }

    static fromExport(tapeExport: TapeExport): Tape {
        return new Tape(tapeExport.content);
    }
}