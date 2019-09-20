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
    }

    getCurrentSymbol(): TapeSymbol {
        return this.getSymbolAt(this.headPosition);
    }

    setCurrentSymbol(symbol: TapeSymbol) {
        this.setSymbolAt(this.headPosition, symbol);
    }

    setContent(content: TapeSymbol[]) {
        this.content = content;
    }

    applyHeadAction(action: HeadAction) {
        switch (action) {
            case HeadAction.MoveLeft:
                this.headPosition--;
                break;

            case HeadAction.MoveRight:
                this.headPosition++;
                break;

            case HeadAction.None:
            default:
                break;
        }
    }

    moveHeadLeft() {
        this.headPosition--;
    }

    resetHeadPosition() {
        this.headPosition = 0;
    }

    toString() {
        return "[head at " + this.headPosition + " ]\n"
             + this.content.toString();
    }
}