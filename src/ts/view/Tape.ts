import * as d3 from "d3-selection";
import { TapeSymbol, HeadAction } from "../model/Tape";
import { EventManager, EventHandler, EventID, Event } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";
import { TuringMachine } from "../model/TuringMachine";
import { TapeContentEditorPopup } from './editors/TapeContentEditorPopup';

export class Tape {
    private static readonly minLength = 10;
    private static readonly marginCell = 2;
    private static readonly sizeCell = 90;

    private tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    
    private tm: TuringMachine;
    private origin: number;
    private stepMovement: number;
    private displayedCellsIndices: {minIndex: number, maxIndex: number};

    private internalEventsHandlers: Record<EventID, EventHandler<Event>>;
    private DOMEventHandlers: Record<string, (event: any) => void>;

    constructor(tm: TuringMachine) {
        this.tapeHolder = d3.select("#tapeHolder");
        this.origin = 0;
        this.tm = tm;

        this.init();
    }

    private init() {
        this.setupUI();

        this.createEventListeners();
        this.addEventListeners();

        this.displayedCellsIndices = {minIndex: 0, maxIndex: Tape.minLength - 1};
        for (var i = 0; i < Tape.minLength; i++) {
            this.addCell(i);
        }
    }

    private setupUI() {
        d3.select("#tapeHolder").selectAll("*").remove();
        this.head = this.tapeHolder.append("div").attr("id", "head");
        this.tape = this.tapeHolder.append("div").attr("id", "tape");
        this.addActionButtons();

        let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;

        this.origin = widthHolder / 2 - Tape.marginCell - Tape.sizeCell / 2;
        this.tape.style("left", (this.origin).toString() + "px");
        this.stepMovement = Tape.sizeCell + 2 * Tape.marginCell;
    }

    private addActionButtons() {
        let container = this.tapeHolder.append("div")
            .classed("action-button-container", true);

        // Button to reset the position of the head
        container.append("button")
            .attr("id", "reset-head-button")
            .on("click", () => {
                this.moveToCell(this.tm.tape.getHeadPosition());
            });

        // Button to edit the content of the tape as text
        container.append("button")
            .attr("id", "set-tape-content-button")
            .on("click", () => {
                new TapeContentEditorPopup(this.tm.tape);
            });
    }

    private addCell(index: number) {
        let cell, value;
        let tapeContent = this.tm.tape.getContent();

        value = (index < tapeContent.length)? tapeContent[index] : "";
        
        cell = this.tape.append("div")
            .attr("id", `cell-${index}`)
            .classed("cell", true);
        cell.append("label")
            .attr("for", `cell-${index}-input`)
            .text(index);
        cell.append("input")
            .attr("type", "text")
            .attr("id", `cell-${index}-input`)
            .attr("maxlength", "1")
            .attr("value", value)
            .on("change", () => {
                this.tm.tape.setSymbolAt(index, cell.select("input").node().value);
            })
        return cell;
    }

    private addCellAtTheBeginning() {
        this.displayedCellsIndices.minIndex -= 1;
        this.addCell(this.displayedCellsIndices.minIndex).lower();
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }

    private addCellAtTheEnd() {
        this.displayedCellsIndices.maxIndex += 1;
        this.addCell(this.displayedCellsIndices.maxIndex);
    }

    private removeCell(index: number) {
        if(!d3.select(`#cell-${index}`).empty()){
            d3.select(`#cell-${index}`).remove();
        }
    }

    private removeCellAtTheBeginning() {
        this.removeCell(this.displayedCellsIndices.minIndex);
        this.displayedCellsIndices.minIndex += 1;
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }

    private removeCellAtTheEnd() {
        this.removeCell(this.displayedCellsIndices.maxIndex);
        this.displayedCellsIndices.maxIndex -= 1;
    }

    private updateDisplayedCell(l:number){
        let displayedCellIndex = Math.floor(Math.abs(l - this.origin) / this.stepMovement - 0.5) + 1;

        while(this.displayedCellsIndices.minIndex < Math.max(0, displayedCellIndex - Tape.minLength)){
            this.removeCellAtTheBeginning();
        }
        while (this.displayedCellsIndices.minIndex > Math.max(0, displayedCellIndex - Tape.minLength)) {
            this.addCellAtTheBeginning();
        }

        while (this.displayedCellsIndices.maxIndex > displayedCellIndex + Tape.minLength) {
            this.removeCellAtTheEnd();
        }
        while (this.displayedCellsIndices.maxIndex < displayedCellIndex + Tape.minLength) {
            this.addCellAtTheEnd();
        }
    }

    moveTapeBy(n: number) {
        let left = parseInt(this.tape.style("left"));
        let newLeft = Math.min(left - n, this.origin);
        this.tape
            .style("left", (newLeft).toString() + "px");
        this.updateDisplayedCell(newLeft);
    }

    moveTapeByNCell(n: number) {
        this.moveTapeBy(n * this.stepMovement)
    }

    moveToCell(pos: number) {
        this.tape
            .style("left", (this.origin).toString() + "px")
        this.moveTapeByNCell(pos);
    }

    move(action: HeadAction) {
        switch (action) {
            case HeadAction.MoveLeft:
                this.moveTapeByNCell(-1);
                break;

            case HeadAction.MoveRight:
                this.moveTapeByNCell(1);
                break;

            case HeadAction.None:
            default:
                break;
        }
    }

    updateCell(symbol: TapeSymbol, index: number) {
        let inputCell = this.tape.select("#cell-"+index).select("input").node() as HTMLInputElement;
        inputCell.value = symbol;
    }

    updateContent() {
        let tapeContent = this.tm.tape.getContent();
        let symbol;
        for(var i = this.displayedCellsIndices.minIndex; i <= this.displayedCellsIndices.maxIndex; i++){
            if(i < tapeContent.length){
                symbol = tapeContent[i];
            } else {
                symbol = "";
            }
            this.updateCell(symbol, i);
        }
    }

    private createEventListeners() {
        let isDown = false;
        let previousX = 0;

        this.DOMEventHandlers = {
            "pointerdown": (e: PointerEvent) => {
                isDown = true;
                previousX = e.clientX;
            },

            "pointermove": (e: PointerEvent) => {
                if (isDown) {
                    this.moveTapeBy(-(e.clientX - previousX));
                    previousX = e.clientX;
                }
            },

            "pointerup": (e: PointerEvent) => {
                isDown = false;
            },

            "wheel": (e: WheelEvent) => {
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
            
            "tapeMove": (e: TapeMoveEvent) => {
                this.move(e.headAction);
            },
            
            "tapeNewPos": (e: TapeNewPosEvent) => {
                this.moveToCell(e.headPos);
            }
        };
    }

    addEventListeners() {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager.registerHandler(id, this.internalEventsHandlers[id]);
        }

        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().addEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }

    removeEventListeners() {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager.unregisterHandler(id, this.internalEventsHandlers[id]);
        }

        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().removeEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }

    resize() {
        let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;
        let previousOrigin = this.origin;
        this.origin = widthHolder / 2 - Tape.marginCell - Tape.sizeCell / 2;
        this.moveTapeBy(previousOrigin - this.origin);
    }
}
