"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../events/EventManager");
const TapeCellUpdateEvent_1 = require("../events/TapeCellUpdateEvent");
const TapeMoveEvent_1 = require("../events/TapeMoveEvent");
const TapeNewPosEvent_1 = require("../events/TapeNewPosEvent");
const TapeContentUpdateEvent_1 = require("../events/TapeContentUpdateEvent");
var HeadAction;
(function (HeadAction) {
    HeadAction[HeadAction["MoveLeft"] = 0] = "MoveLeft";
    HeadAction[HeadAction["MoveRight"] = 1] = "MoveRight";
    HeadAction[HeadAction["None"] = 2] = "None";
})(HeadAction = exports.HeadAction || (exports.HeadAction = {}));
class Tape {
    constructor(content = []) {
        this.content = content;
        this.resetHeadPosition();
    }
    getHeadPosition() {
        return this.headPosition;
    }
    getSymbolAt(index) {
        return this.content[index];
    }
    setSymbolAt(index, symbol) {
        this.content[index] = symbol;
        this.fillEmptyCellsBefore(index);
        EventManager_1.EventManager.emit(new TapeCellUpdateEvent_1.TapeCellUpdateEvent(symbol, index));
    }
    getCurrentSymbol() {
        return this.getSymbolAt(this.headPosition);
    }
    setCurrentSymbol(symbol) {
        this.setSymbolAt(this.headPosition, symbol);
        EventManager_1.EventManager.emit(new TapeCellUpdateEvent_1.TapeCellUpdateEvent(symbol, this.getHeadPosition()));
    }
    setContent(content) {
        this.content = content;
        EventManager_1.EventManager.emit(new TapeContentUpdateEvent_1.TapeContentUpdateEvent());
    }
    setContentFromString(content) {
        this.setContent(Array.from(content));
    }
    getContent() {
        return this.content;
    }
    getContentAsString() {
        return this.content.join("");
    }
    clearContent() {
        this.content = [];
    }
    fillEmptyCellsBefore(index = this.content.length) {
        for (let i = 0; i < index; i++) {
            if (this.content[i] === undefined) {
                this.content[i] = Tape.EMPTY_CELL_FILLING_CHAR;
            }
        }
    }
    applyHeadAction(action) {
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
        EventManager_1.EventManager.emit(new TapeMoveEvent_1.TapeMoveEvent(action));
    }
    resetHeadPosition() {
        this.headPosition = 0;
        EventManager_1.EventManager.emit(new TapeNewPosEvent_1.TapeNewPosEvent(0));
    }
    toString() {
        return "[head at " + this.headPosition + " ]\n"
            + this.content.toString();
    }
    export() {
        return {
            content: this.content
        };
    }
    static fromExport(tapeExport) {
        return new Tape(tapeExport.content);
    }
}
exports.Tape = Tape;
Tape.EMPTY_CELL_FILLING_CHAR = " ";
//# sourceMappingURL=Tape.js.map