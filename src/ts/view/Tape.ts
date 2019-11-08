import * as d3 from "d3-selection";
import { TapeSymbol, HeadAction } from "../model/Tape";
import { EventManager, EventHandler, EventID } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";
import { TuringMachine } from "../model/TuringMachine";

export class Tape{
    static minLength = 10;
    static marginCell = 2;
    static sizeCell = 90;
    tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    origin: number;
    stepMovement: number;
    head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    eventsHandlers: Record<EventID, (EventHandler<any>)>;
    pointerHandlers: Record<any, any>;
    tM: TuringMachine;
    cellsDisplayed: {minIndex: number, maxIndex:number}

    constructor(tM: TuringMachine) {
        this.origin = 0;
        this.tapeHolder = d3.select("#tapeHolder");
        this.eventsHandlers = {};
        this.pointerHandlers = {};
        this.tM = tM;
        this.setupUI();
        this.setupListener();
        this.init();
    }

    setupUI(){
        d3.select("#tapeHolder").selectAll("*").remove();
        this.head = this.tapeHolder.append("div").attr("id", "head");
        this.tape = this.tapeHolder.append("div").attr("id", "tape");

        this.tapeHolder.append("button").attr("id", "reset-head-button");
        this.tapeHolder.append("button").attr("id", "set-tape-content-button");

        let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;

        this.origin = widthHolder / 2 - Tape.marginCell - Tape.sizeCell / 2;
        this.tape.style("left", (this.origin).toString() + "px");
        this.stepMovement = Tape.sizeCell + 2 * Tape.marginCell;
    }

    init(){
        this.cellsDisplayed = {minIndex: 0, maxIndex: Tape.minLength - 1};
        for (var i = 0; i < Tape.minLength; i++) {
            this.addCell(i);
        }
    }

    private addCell(index){
        let cell, value;
        let tapeContent = this.tM.tape.getContent();

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
                this.tM.tape.setSymbolAt(index, cell.select("input").node().value);
            })
        return cell;
    }

    private addCellAtTheBeginning() {
        this.cellsDisplayed.minIndex -= 1;
        this.addCell(this.cellsDisplayed.minIndex).lower();
        this.tape.style("padding-left", (this.cellsDisplayed.minIndex * this.stepMovement).toString() + "px");
    }

    private addCellAtTheEnd() {
        this.cellsDisplayed.maxIndex += 1;
        this.addCell(this.cellsDisplayed.maxIndex);
    }

    private removeCell(index){
        if(!d3.select(`#cell-${index}`).empty()){
            d3.select(`#cell-${index}`).remove();
        }
    }

    private removeCellAtTheBeginning() {
        this.removeCell(this.cellsDisplayed.minIndex);
        this.cellsDisplayed.minIndex += 1;
        this.tape.style("padding-left", (this.cellsDisplayed.minIndex * this.stepMovement).toString() + "px");
    }

    private removeCellAtTheEnd() {
        this.removeCell(this.cellsDisplayed.maxIndex);
        this.cellsDisplayed.maxIndex -= 1;
    }

    private updateDisplayedCell(l:number){
        let displayedCellIndex = Math.floor(Math.abs(l - this.origin) / this.stepMovement - 0.5) + 1;

        while(this.cellsDisplayed.minIndex < Math.max(0, displayedCellIndex - Tape.minLength)){
            this.removeCellAtTheBeginning();
        }
        while (this.cellsDisplayed.minIndex > Math.max(0, displayedCellIndex - Tape.minLength)) {
            this.addCellAtTheBeginning();
        }

        while (this.cellsDisplayed.maxIndex > displayedCellIndex + Tape.minLength) {
            this.removeCellAtTheEnd();
        }
        while (this.cellsDisplayed.maxIndex < displayedCellIndex + Tape.minLength) {
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

    move(action: HeadAction){
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

    updateCell(symbol: TapeSymbol, index: number){
        let inputCell = this.tape.select("#cell-"+index).select("input").node() as HTMLInputElement;
        inputCell.value = symbol;
    }

    updateContent(){
        let tapeContent = this.tM.tape.getContent();
        let symbol;
        for(var i = this.cellsDisplayed.minIndex; i <= this.cellsDisplayed.maxIndex; i++){
            if(i < tapeContent.length){
                symbol = tapeContent[i];
            } else {
                symbol = "";
            }
            this.updateCell(symbol, i);
        }
    }

    setupListener(){
        let isDown = false;
        let previousX = 0;
        let t = this;

        //pointer down
        this.pointerHandlers["pointerdown"] = function (e: PointerEvent) {
            isDown = true;
            previousX = e.clientX;
        }
        this.tapeHolder.node().addEventListener("pointerdown", this.pointerHandlers["pointerdown"]);

        //pointer move
        this.pointerHandlers["pointermove"] = function (e: PointerEvent) {
            if (isDown) {
                t.moveTapeBy(-(e.clientX - previousX));
                previousX = e.clientX;
            }
        }
        this.tapeHolder.node().addEventListener("pointermove", this.pointerHandlers["pointermove"]);

        //pointer up
        this.pointerHandlers["pointerup"] = function (e: PointerEvent) {
            isDown = false;
        }
        this.tapeHolder.node().addEventListener("pointerup", this.pointerHandlers["pointerup"]);

        //pointer leave
        this.pointerHandlers["pointerleave"] = function (e: PointerEvent) {
            isDown = false;
        }
        this.tapeHolder.node().addEventListener("pointerleave", this.pointerHandlers["pointerleave"] );

        //wheel
        this.pointerHandlers["wheel"] = function (e: WheelEvent) {
            t.moveTapeBy(e.deltaY * 4);
        }
        this.tapeHolder.node().addEventListener("wheel", this.pointerHandlers["wheel"]);

        //tape cell update
        this.eventsHandlers["tapeCellUpdate"] = (e: TapeCellUpdateEvent) => {
            this.updateCell(e.symbol, e.index);
        }
        EventManager.registerHandler("tapeCellUpdate", this.eventsHandlers["tapeCellUpdate"])

        //tape move
        this.eventsHandlers["tapeMove"] = (e: TapeMoveEvent) => {
            this.move(e.headAction);
        };
        EventManager.registerHandler("tapeMove", this.eventsHandlers["tapeMove"]);

        //tape new pos
        this.eventsHandlers["tapeNewPos"] = (e: TapeNewPosEvent) => {
            this.moveToCell(e.headPos);
        };
        EventManager.registerHandler("tapeNewPos", this.eventsHandlers["tapeNewPos"])
    }

    removeHandler(){
        for (var eventId of Object.keys(this.eventsHandlers)) {
            EventManager.unregisterHandler(eventId, this.eventsHandlers[eventId]);
        }

        for (var pevent of Object.keys(this.pointerHandlers)) {
            this.tapeHolder.node().removeEventListener(pevent, this.pointerHandlers[eventId]);
        }
    }

    resize(){
        let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;
        let previousOrigin = this.origin;
        this.origin = widthHolder / 2 - Tape.marginCell - Tape.sizeCell / 2;
        this.moveTapeBy(previousOrigin - this.origin);
    }
}
