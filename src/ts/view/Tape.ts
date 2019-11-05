import * as d3 from "d3-selection";
import { TapeSymbol, HeadAction } from "../model/Tape";
import { EventManager, EventHandler, EventID } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";
import { TuringMachine } from "../model/TuringMachine";

export class Tape{
    tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    origin: number;
    stepMovement: number;
    head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    eventsHandlers: Record<EventID, (EventHandler<any>)>;
    pointerHandlers: Record<any, any>;
    tM: TuringMachine;
    length: number;

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

        let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;

        this.origin = widthHolder / 2 - 2 - 45;
        this.tape.style("left", (this.origin).toString() + "px");
        this.stepMovement = 90 + 2 + 2;
    }

    init(){
        this.length = 0;
        let tapeContent = this.tM.tape.getContent();
        for(var i = 0; i < tapeContent.length; i++){
            this.addCell(i, tapeContent[i]);
        }

        for (var i = tapeContent.length; i < 100 - tapeContent.length; i++) {
            this.addCell(i, "");
        }
    }

    addCell(index, value){
        let cell;
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
            .attr("value", value);
        this.length += 1;
    }

    addNeededCell(l:number){
        let nbDisplayedCell = Math.floor(Math.abs(l - this.origin) / this.stepMovement - 0.5) + 1;
        while(nbDisplayedCell > this.length - 10){
            this.addCell(this.length, "");
        }
    }

    moveTapeBy(n: number) {
        let l = parseInt(this.tape.style("left"));
        let newL = Math.min(l - n, this.origin);
        this.addNeededCell(newL);
        this.tape
            .style("left", (newL).toString() + "px")
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

    toArray(): TapeSymbol[]{
        let tapeSymbols = [];
        this.tape.selectAll("input").each(function(){
            let input = this as HTMLInputElement;
            tapeSymbols.push(input.value);
        })
        return tapeSymbols;
    }

    updateCell(symbol: TapeSymbol, index: number){
        let inputCell = this.tape.select("#cell-"+index).select("input").node() as HTMLInputElement;
        inputCell.value = symbol;
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
            t.moveTapeBy(e.deltaX * 4);
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
}
