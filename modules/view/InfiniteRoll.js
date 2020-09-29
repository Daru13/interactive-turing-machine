"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Tape_1 = require("../model/Tape");
const EventManager_1 = require("../events/EventManager");
const TapeContentEditorPopup_1 = require("./popups/TapeContentEditorPopup");
class InfiniteRoll {
    constructor(turingMachine) {
        this.tapeHolder = d3.select("#tape-container");
        this.origin = 0;
        this.turingMachine = turingMachine;
        this.init();
    }
    init() {
        this.setupUI();
        this.createEventListeners();
        this.addEventListeners();
        this.displayedCellsIndices = {
            minIndex: 0,
            maxIndex: InfiniteRoll.minLength - 1
        };
        for (let i = 0; i < InfiniteRoll.minLength; i++) {
            this.addCell(i);
        }
        this.updateCurrentCell();
    }
    setupUI() {
        d3.select("#tape-container").selectAll("*").remove();
        this.head = this.tapeHolder.append("div").attr("id", "head");
        this.tape = this.tapeHolder.append("div").attr("id", "tape");
        this.addActionButtons();
        let widthHolder = document.getElementById("tape-container").getBoundingClientRect().width;
        this.origin = widthHolder / 2 - InfiniteRoll.marginCell - InfiniteRoll.sizeCell / 2;
        this.tape.style("left", (this.origin).toString() + "px");
        this.stepMovement = InfiniteRoll.sizeCell + 2 * InfiniteRoll.marginCell;
    }
    addActionButtons() {
        let container = this.tapeHolder.append("div")
            .classed("action-button-container", true);
        container.append("button")
            .attr("id", "reset-head-button")
            .attr("title", "Scroll the tape to the current cell")
            .on("click", () => {
            this.moveToCell(this.turingMachine.tape.getHeadPosition());
        });
        container.append("button")
            .attr("id", "set-tape-content-button")
            .attr("title", "Edit the content of the tape as text")
            .on("click", () => {
            new TapeContentEditorPopup_1.TapeContentEditorPopup(this.turingMachine.tape);
        });
    }
    addCell(index) {
        let cell, value;
        let tapeContent = this.turingMachine.tape.getContent();
        value = (index < tapeContent.length) ? tapeContent[index] : "";
        cell = this.tape.append("div")
            .attr("id", `cell-${index}`)
            .classed("cell", true);
        cell.append("label")
            .attr("for", `cell-${index}-input`)
            .text(index + 1);
        cell.append("input")
            .attr("type", "text")
            .attr("id", `cell-${index}-input`)
            .attr("maxlength", "1")
            .attr("value", value)
            .on("change", () => {
            this.turingMachine.tape.setSymbolAt(index, cell.select("input").node().value);
        });
        return cell;
    }
    addCellAtTheBeginning() {
        this.displayedCellsIndices.minIndex -= 1;
        this.addCell(this.displayedCellsIndices.minIndex).lower();
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }
    addCellAtTheEnd() {
        this.displayedCellsIndices.maxIndex += 1;
        this.addCell(this.displayedCellsIndices.maxIndex);
    }
    removeCell(index) {
        if (!d3.select(`#cell-${index}`).empty()) {
            d3.select(`#cell-${index}`).remove();
        }
    }
    removeCellAtTheBeginning() {
        this.removeCell(this.displayedCellsIndices.minIndex);
        this.displayedCellsIndices.minIndex += 1;
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }
    removeCellAtTheEnd() {
        this.removeCell(this.displayedCellsIndices.maxIndex);
        this.displayedCellsIndices.maxIndex -= 1;
    }
    updateDisplayedCell(l) {
        let displayedCellIndex = Math.floor(Math.abs(l - this.origin) / this.stepMovement - 0.5) + 1;
        while (this.displayedCellsIndices.minIndex < Math.max(0, displayedCellIndex - InfiniteRoll.minLength)) {
            this.removeCellAtTheBeginning();
        }
        while (this.displayedCellsIndices.minIndex > Math.max(0, displayedCellIndex - InfiniteRoll.minLength)) {
            this.addCellAtTheBeginning();
        }
        while (this.displayedCellsIndices.maxIndex > displayedCellIndex + InfiniteRoll.minLength) {
            this.removeCellAtTheEnd();
        }
        while (this.displayedCellsIndices.maxIndex < displayedCellIndex + InfiniteRoll.minLength) {
            this.addCellAtTheEnd();
        }
        this.updateCurrentCell();
    }
    moveTapeBy(n) {
        let left = parseInt(this.tape.style("left"));
        let newLeft = Math.min(left - n, this.origin);
        this.tape
            .style("left", (newLeft).toString() + "px");
        this.updateDisplayedCell(newLeft);
    }
    moveTapeByNCell(n) {
        this.moveTapeBy(n * this.stepMovement);
    }
    moveToCell(index) {
        this.tape
            .style("left", (this.origin).toString() + "px");
        this.moveTapeByNCell(index);
    }
    move(action) {
        switch (action) {
            case Tape_1.HeadAction.MoveLeft:
                this.moveTapeByNCell(-1);
                break;
            case Tape_1.HeadAction.MoveRight:
                this.moveTapeByNCell(1);
                break;
            case Tape_1.HeadAction.None:
            default:
                break;
        }
        this.updateCurrentCell();
    }
    updateCell(symbol, index) {
        let cell = this.tape.select("#cell-" + index);
        let inputElement = cell.select("input").node();
        inputElement.value = symbol;
    }
    updateCurrentCell() {
        let currentCellIndex = this.turingMachine.tape.getHeadPosition();
        this.tape.select(".current-cell").classed("current-cell", false);
        this.tape.select("#cell-" + currentCellIndex)
            .classed("current-cell", true);
    }
    updateContent() {
        let tapeContent = this.turingMachine.tape.getContent();
        for (let i = this.displayedCellsIndices.minIndex; i <= this.displayedCellsIndices.maxIndex; i++) {
            let symbol = i < tapeContent.length ? tapeContent[i] : "";
            this.updateCell(symbol, i);
        }
    }
    createEventListeners() {
        let isDown = false;
        let previousX = 0;
        this.DOMEventHandlers = {
            "pointerdown": (e) => {
                isDown = true;
                previousX = e.clientX;
            },
            "pointermove": (e) => {
                if (isDown) {
                    this.moveTapeBy(-(e.clientX - previousX));
                    previousX = e.clientX;
                }
            },
            "pointerup": (e) => {
                isDown = false;
            },
            "wheel": (e) => {
                this.moveTapeBy(e.deltaY * 4);
            }
        };
        this.internalEventsHandlers = {
            "tapeCellUpdate": () => {
                this.updateContent();
            },
            "tapeContentUpdate": () => {
                this.updateContent();
            },
            "tapeMove": (e) => {
                this.move(e.headAction);
            },
            "tapeNewPos": (e) => {
                this.moveToCell(e.headPos);
            }
        };
    }
    addEventListeners() {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager_1.EventManager.registerHandler(id, this.internalEventsHandlers[id]);
        }
        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().addEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }
    removeEventListeners() {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager_1.EventManager.unregisterHandler(id, this.internalEventsHandlers[id]);
        }
        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().removeEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }
    resize() {
        let widthHolder = document.getElementById("tape-container").getBoundingClientRect().width;
        let previousOrigin = this.origin;
        this.origin = widthHolder / 2 - InfiniteRoll.marginCell - InfiniteRoll.sizeCell / 2;
        this.moveTapeBy(previousOrigin - this.origin);
    }
}
exports.InfiniteRoll = InfiniteRoll;
InfiniteRoll.minLength = 10;
InfiniteRoll.marginCell = 2;
InfiniteRoll.sizeCell = 90;
//# sourceMappingURL=InfiniteRoll.js.map