import { Tape } from "./Tape";
import { MouseDispatcher, toolName } from "./graphInteraction/tools/MouseDispatcher";
import { Graph } from "./graph/Graph";
import { TuringMachine } from "../model/TuringMachine";
import { TuringMachineButton } from "./TuringMachineButton";
import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import * as d3 from "d3-selection";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { PenAndTouchDispatcher } from "./graphInteraction/penAndTouch/PenAndTouchDispatcher";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";

export class ViewController{
    graph: Graph;
    tape: Tape;
    turingMachine: TuringMachine;
    tmButtons: TuringMachineButton;
    
    toolManager: MouseDispatcher;
    penAndTouchManager: PenAndTouchDispatcher;

    constructor(turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        this.setupUI();
    }

    setupUI(){
        this.graph = new Graph(this.turingMachine);

        this.toolManager = new MouseDispatcher(this.graph, this.turingMachine);
        this.penAndTouchManager = new PenAndTouchDispatcher(this.graph, this.turingMachine);
        this.useDefaultInteractionStyle();

        this.tape = new Tape();

        this.tmButtons = new TuringMachineButton(this.turingMachine, this.tape);

        this.setupTapeListener();
        this.setupMenu();
    }

    setupTapeListener(){
        var tape = this.tape;
        EventManager.registerHandler("tapeCellUpdate", function(e: TapeCellUpdateEvent){
            tape.updateCell(e.symbol, e.index);
        })

        EventManager.registerHandler("tapeMove", function (e: TapeMoveEvent) {
            tape.move(e.headAction);
        })

        EventManager.registerHandler("tapeNewPos", function (e: TapeNewPosEvent) {
            tape.moveToCell(e.headPos);
        })
    }

    useDefaultInteractionStyle() {
        this.toolManager.activate();
        this.penAndTouchManager.deactivate();
    }

    switchInteractionStyle() {
        if (this.penAndTouchManager.isActivated) {
            this.toolManager.activate();
            this.penAndTouchManager.deactivate();
        }
        else {
            this.toolManager.deactivate();
            this.penAndTouchManager.activate();
        }
    }

    setupMenu(){
        let t = this;
        let menuBar = d3.select("#menu");

        // Title
        menuBar.append("h1")
            .attr("id", "app-title")
            .text("Interactive Turing Machine");

        // Interaction style switch
        function getInteractionStyleSwitchText() {
            return t.penAndTouchManager.isActivated
            ? "Use Mouse interactions"
            : "Use Pen&Touch interactions";
        }

        let interactionStyleSwitch = menuBar.append("button")
            .attr("id", "switch-interaction-style-button")
            .text(getInteractionStyleSwitchText())
            .on("click", () => {
                this.switchInteractionStyle();
                interactionStyleSwitch.text(getInteractionStyleSwitchText());
            });
        
        // Import and export
        menuBar.append("button")
            .attr("id", "import-model-button")
            .text("Import")
            .on("click", () => {
                // TODO
            });
            
        menuBar.append("button")
            .attr("id", "export-model-button")
            .text("Export")
            .on("click", () => {
                // TODO
            });

        // Loading
        let predefinedModelsList = menuBar.append("select")
            .attr("id", "predefined-models-list")
            .on("change", () => {
                // TODO
            });

        // TODO: fetch actual, predefined models from somewhere
        let models = ["Test 1", "Test 2", "Test 3"];
        for (let model of models) {
            predefinedModelsList.append("option")
                .text(model);
        }
    }
}
