import * as d3 from "d3-selection";
import { TapeSymbol, HeadAction } from "../model/Tape";
import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";

export class Tape{
    tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    origin: number;
    stepMovement: number;
    head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    constructor() {
        d3.select("#tapeHolder").selectAll("*").remove()

        this.origin = 0;
        this.tapeHolder = d3.select("#tapeHolder");
        this.tape = this.addTape();
        this.head = this.addHead();
        this.setupListener();
    }

    addTape(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any>{
        let tape = this.tapeHolder.append("div").attr("id", "tape");
        let cell;
        for(var i = 0; i < 100; i++){
            cell = tape.append("div")
                .attr("id", `cell-${i}`)
                .classed("cell", true);
            cell.append("label")
                .attr("for", `cell-${i}-input`)
                .text(i);
            cell.append("input")
                .attr("type", "text")
                .attr("id", `cell-${i}-input`)
                .attr("maxlength", "1");
        }

        let widthHolder = document.getElementById("tapeHolder").getBoundingClientRect().width;

        this.origin = widthHolder / 2 - 2 - 45;
        tape.style("left", (this.origin).toString() + "px");

        this.stepMovement = 90 + 2 + 2;
        return tape;
    }

    addHead(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any>{
        return this.tapeHolder.append("div").attr("id", "head")
    }

    moveTapeByNCell(n: number){
        let l = parseInt(this.tape.style("left"));
        this.tape
            .style("left", (l - n * this.stepMovement).toString() + "px")
    }

    moveTapeBy(n: number) {
        let l = parseInt(this.tape.style("left"));
        this.tape
            .style("left", (l-n).toString() + "px")
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

        this.tapeHolder.node().addEventListener("pointerdown", function(e: PointerEvent) { 
            isDown = true;
            previousX = e.clientX;
        });
        this.tapeHolder.node().addEventListener("pointermove", function(e: PointerEvent) { 
            if(isDown){
                t.moveTapeBy(-(e.clientX - previousX));
                previousX = e.clientX;
            }
        });
        this.tapeHolder.node().addEventListener("pointerup", function(e: PointerEvent) { 
            isDown = false;
        });
        this.tapeHolder.node().addEventListener("pointerleave", function(e: PointerEvent) {
            isDown = false;
        });

        this.tapeHolder.node().addEventListener("wheel", function(e: WheelEvent){
            t.moveTapeBy(e.deltaX * 4);
        });

        EventManager.registerHandler("tapeCellUpdate", (e: TapeCellUpdateEvent) => {
            this.updateCell(e.symbol, e.index);
        })

        EventManager.registerHandler("tapeMove", (e: TapeMoveEvent) => {
            this.move(e.headAction);
        })

        EventManager.registerHandler("tapeNewPos", (e: TapeNewPosEvent) => {
            this.moveToCell(e.headPos);
        })
    }
}
