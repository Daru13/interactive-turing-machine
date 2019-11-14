import * as d3 from "d3-selection";
import { TapeSymbol, HeadAction } from "../model/Tape";
import { EventManager, EventHandler, EventID, Event } from "../events/EventManager";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";
import { TuringMachine } from "../model/TuringMachine";
import { TapeContentEditorPopup } from './popups/TapeContentEditorPopup';

/**
 * A class to display a tape in the view
 */
export class Tape {
    /** minimal number of cell around the current one */
    private static readonly minLength: number = 10;
    /** margin property of the cell */
    private static readonly marginCell: number = 2;
    /** size of the cell */
    private static readonly sizeCell: number = 90;

    /** d3 selection of the div #tapeHolder */
    private tapeHolder: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    /** d3 selection of the div #tape */
    private tape: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    /** d3 selection of the head of the tape */
    private head: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    
    /** Corresponding turing machine */
    private turingMachine: TuringMachine;
    /** initial left property of the tape */
    private origin: number;
    /** pixel to move to go from cell n to cell n +/- 1 */
    private stepMovement: number;
    /** Index of the displayed cells */
    private displayedCellsIndices: {
        minIndex: number, 
        maxIndex: number
    };

    /** Events handlers for event from the tape in the turing machine */
    private internalEventsHandlers: Record<EventID, EventHandler<Event>>;
    /** Events handlers for event from the DOM */
    private DOMEventHandlers: Record<string, (event: any) => void>;

    constructor(turingMachine: TuringMachine) {
        this.tapeHolder = d3.select("#tape-container");
        this.origin = 0;
        this.turingMachine = turingMachine;

        this.init();
    }

    /**
     * Inits tape by displaying minLength cells
     */
    private init(): void {
        this.setupUI();

        this.createEventListeners();
        this.addEventListeners();

        this.displayedCellsIndices = {
            minIndex: 0,
            maxIndex: Tape.minLength - 1
        };
        
        for (let i = 0; i < Tape.minLength; i++) {
            this.addCell(i);
        }

        this.updateCurrentCell();
    }

    /**
     * Setups ui by creating a div #tape, a div #head and actions buttons: import tape content and go to current cell
     */
    private setupUI(): void {
        d3.select("#tape-container").selectAll("*").remove();
        this.head = this.tapeHolder.append("div").attr("id", "head");
        this.tape = this.tapeHolder.append("div").attr("id", "tape");
        this.addActionButtons();

        let widthHolder = document.getElementById("tape-container").getBoundingClientRect().width;

        this.origin = widthHolder / 2 - Tape.marginCell - Tape.sizeCell / 2;
        this.tape.style("left", (this.origin).toString() + "px");
        this.stepMovement = Tape.sizeCell + 2 * Tape.marginCell;
    }

    /**
     * Adds action buttons: import tape content and go to current cell
     */
    private addActionButtons(): void {
        let container = this.tapeHolder.append("div")
            .classed("action-button-container", true);

        // Button to reset the position of the head
        container.append("button")
            .attr("id", "reset-head-button")
            .attr("title", "Scroll the tape to the current cell")
            .on("click", () => {
                this.moveToCell(this.turingMachine.tape.getHeadPosition());
            });

        // Button to edit the content of the tape as text
        container.append("button")
            .attr("id", "set-tape-content-button")
            .attr("title", "Edit the content of the tape as text")
            .on("click", () => {
                new TapeContentEditorPopup(this.turingMachine.tape);
            });
    }

    /**
     * Adds a cell in the tape
     * @param index of the cell
     * @returns return the added cell 
     */
    private addCell(index: number): d3.Selection<HTMLDivElement, any, any, any> {
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

    /**
     * Adds a cell at the beginning of the tape
     */
    private addCellAtTheBeginning(): void {
        this.displayedCellsIndices.minIndex -= 1;
        this.addCell(this.displayedCellsIndices.minIndex).lower();
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }

    /**
     * Adds a cell at the end of the tape
     */
    private addCellAtTheEnd(): void {
        this.displayedCellsIndices.maxIndex += 1;
        this.addCell(this.displayedCellsIndices.maxIndex);
    }

    /**
     * Removes a cell from the tape
     * @param index index of the cell to remove
     */
    private removeCell(index: number): void {
        if (!d3.select(`#cell-${index}`).empty()) {
            d3.select(`#cell-${index}`).remove();
        }
    }

   /**
    * Removes the cell at the beginning of the tape
    */
   private removeCellAtTheBeginning(): void {
        this.removeCell(this.displayedCellsIndices.minIndex);
        this.displayedCellsIndices.minIndex += 1;
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }

    /**
     * Removes the cell at the end of the tape
     */
    private removeCellAtTheEnd(): void {
        this.removeCell(this.displayedCellsIndices.maxIndex);
        this.displayedCellsIndices.maxIndex -= 1;
    }

    /**
     * Updates the displayed cell on the tape
     * @param l left property of the tape
     */
    private updateDisplayedCell(l: number): void {
        let displayedCellIndex = Math.floor(Math.abs(l - this.origin) / this.stepMovement - 0.5) + 1;

        while (this.displayedCellsIndices.minIndex < Math.max(0, displayedCellIndex - Tape.minLength)) {
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

        this.updateCurrentCell();
    }

    /**
     * Moves the tape by n pixels
     * @param n number of pixels to move by
     */
    moveTapeBy(n: number): void {
        let left = parseInt(this.tape.style("left"));
        let newLeft = Math.min(left - n, this.origin);
        this.tape
            .style("left", (newLeft).toString() + "px");
        this.updateDisplayedCell(newLeft);
    }

    /**
     * Moves tape by n cell
     * @param n number of cell to move by
     */
    moveTapeByNCell(n: number): void {
        this.moveTapeBy(n * this.stepMovement);
    }

    /**
     * Moves tape to cell
     * @param index index of the cell
     */
    moveToCell(index: number): void {
        this.tape
            .style("left", (this.origin).toString() + "px");
        this.moveTapeByNCell(index);
    }

    /**
     * Moves the tape according to a head action from the turing machine
     * @param action an Head action
     */
    move(action: HeadAction): void {
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

        this.updateCurrentCell();
    }

    /**
     * Update the value of the cell at the given index.
     * 
     * @param symbol The new value of the cell.
     * @param index The index of the cell to update.
     */
    updateCell(symbol: TapeSymbol, index: number): void {
        let cell = this.tape.select("#cell-" + index);
        let inputElement = cell.select("input").node() as HTMLInputElement;

        inputElement.value = symbol;
    }

    /**
     * Update the style of the current cell (below the tape head).
     */
    updateCurrentCell(): void {
        let currentCellIndex = this.turingMachine.tape.getHeadPosition();

        this.tape.select(".current-cell").classed("current-cell", false);
        this.tape.select("#cell-" + currentCellIndex)
            .classed("current-cell", true);
    }

    /**
     * Update the content and the style of the tape.
     */
    updateContent(): void {
        let tapeContent = this.turingMachine.tape.getContent();
        
        // Cancel the style of the current cell (if any)
        

        // Update the style and the content of all the displayed cells
        for (let i = this.displayedCellsIndices.minIndex; i <= this.displayedCellsIndices.maxIndex; i++) {
            let symbol = i < tapeContent.length ? tapeContent[i] : "";
            this.updateCell(symbol, i);
        }
    }

    /**
     * Creates event listeners for events from the turing machine and the DOM
     */
    private createEventListeners(): void {
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

    /**
     * Adds the event listeners
     */
    addEventListeners(): void {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager.registerHandler(id, this.internalEventsHandlers[id]);
        }

        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().addEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }

    /**
     * Removes the event listeners
     */
    removeEventListeners(): void {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager.unregisterHandler(id, this.internalEventsHandlers[id]);
        }

        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().removeEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }

    /**
     * When the windows is resized, adapt the position of the tape inside the tapeHolder
     */
    resize(): void {
        let widthHolder = document.getElementById("tape-container").getBoundingClientRect().width;
        let previousOrigin = this.origin;
        this.origin = widthHolder / 2 - Tape.marginCell - Tape.sizeCell / 2;
        this.moveTapeBy(previousOrigin - this.origin);
    }
}
