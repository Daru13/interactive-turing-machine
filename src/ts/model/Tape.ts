import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";
import { TapeContentUpdateEvent } from "../events/TapeContentUpdateEvent";

/** The type of a symbol of the tape. */
export type TapeSymbol = string;

/** The available actions of the tape head. */
export enum HeadAction {
    MoveLeft,
    MoveRight,
    None
}

/** An exported tape which can be serialised. */
export interface TapeExport {
    content: TapeSymbol[];
}

/**
 * The tape of a Turing machine.
 * It represents a semi-infinite array of cells (to the right),
 * and it has has a head pointing to the current cell.
 */
export class Tape {
    /** The character used to fill empty cells which must be filled. */
    private static readonly EMPTY_CELL_FILLING_CHAR: string = " ";

    /** The content of the tape (one cell per index). */
    private content: TapeSymbol[];

    /** The position of the head (the index in the [[content]] array) */
    private headPosition: number;

    /**
     * Create a new instance of Tape.
     * 
     * @param content The initial content of the tape.
     */
    constructor(content: TapeSymbol[] = []) {
        this.content = content;
        this.resetHeadPosition();
    }

    /**
     * Return the position of the head.
     * 
     * @return The index of the current cell.
     */
    getHeadPosition(): number {
        return this.headPosition;
    }

    /**
     * Return the symbol located at the given position on the tape.
     * 
     * @param index The index of the cell.
     * @return The symbol of the cell (possibly `undefined`).
     */
    getSymbolAt(index: number): TapeSymbol {
        return this.content[index];
    }

    /**
     * Set the symbol located at the given position on the tape.
     * Emit an [[TapeCellUpdateEvent]] when done.
     * 
     * @param index The index of the cell.
     * @param symbol The new symbol.
     */
    setSymbolAt(index: number, symbol: TapeSymbol): void {
        this.content[index] = symbol;
        this.fillEmptyCellsBefore(index);

        EventManager.emit(new TapeCellUpdateEvent(symbol, index));
    }

    /**
     * Return the symbol located at the position of the head (current cell).
     * 
     * @return The symbol of the current cell. 
     */
    getCurrentSymbol(): TapeSymbol {
        return this.getSymbolAt(this.headPosition);
    }

    /**
     * Set the symbol located at the position of the head (current cell).
     * Emit an [[TapeCellUpdateEvent]] when done.
     * 
     * @param symbol The new symbol.
     */
    setCurrentSymbol(symbol: TapeSymbol): void {
        this.setSymbolAt(this.headPosition, symbol);

        EventManager.emit(new TapeCellUpdateEvent(symbol, this.getHeadPosition()));
    }

    /**
     * Set the entire content of the tape.
     * Emit an [[TapeContentUpdateEvent]] when done.
     * 
     * @param content The new content.
     */
    setContent(content: TapeSymbol[]): void {
        this.content = content;

        EventManager.emit(new TapeContentUpdateEvent());
    }

    /**
     * Set the entire content of the tape from a string.
     * The string is transformed into an array of character (one per cell).
     * 
     * @param content The string representing the new content.
     */
    setContentFromString(content: string): void {
        this.setContent(Array.from(content));
    }

    /**
     * Return the content of the tape.
     * 
     * @return An array of symbols.
     */
    getContent(): TapeSymbol[] {
        return this.content;
    }

    /**
     * Return a textual representation of the content of the tape.
     * 
     * @return A string representing the content.
     */
    getContentAsString(): string {
        return this.content.join("");
    }

    /**
     * Empty the content of the tape.
     */
    clearContent(): void {
        this.content = [];
    }

    /**
     * Fill the empty content cells located before the given index with [[EMPTY_CELL_FILLING_CHAR]].
     * 
     * @param index The index of the first cell following the last one to potentially fill.
     */
    private fillEmptyCellsBefore(index: number = this.content.length): void {
        for (let i = 0; i < index; i++) {
            if (this.content[i] === undefined) {
                this.content[i] = Tape.EMPTY_CELL_FILLING_CHAR;
            }
        }
    }

    /**
     * Apply the given action to the head of the cell.
     * Emit an [[TapeMoveEvent]] when done.
     * 
     * @param action The action to apply.
     */
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

    /**
     * Reset the position of the head (to the first cell).
     * Emit an [[TapeNewPosEvent]] when done.
     */
    resetHeadPosition(): void {
        this.headPosition = 0;
         
        EventManager.emit(new TapeNewPosEvent(0));
    }

    /**
     * Return a textual version of the tape.
     * It contains the position of the head and the entire content.
     * 
     * @return A string representing the tape.
     */
    toString(): string {
        return "[head at " + this.headPosition + " ]\n"
             + this.content.toString();
    }

    /**
     * Return an exportable version of the tape.
     * 
     * @return An export object describing the tape.
     */
    export(): TapeExport {
        return {
            content: this.content
        };
    }

    static fromExport(tapeExport: TapeExport): Tape {
        return new Tape(tapeExport.content);
    }
}