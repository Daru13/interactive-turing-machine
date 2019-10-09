import { Tape } from "./Tape";
import { ToolManager } from "./tools/ToolManager";
import { Graph } from "./graph/Graph";
import { TuringMachine } from "../model/TuringMachine";
import { TuringMachineButton } from "./TuringMachineButton";
import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import * as d3 from "d3-selection";
import { TapeMoveEvent } from "../events/TapeMoveEvent";
import { PenAndTouchManager } from "./penAndTouch/PenAndTouchManager";
import { TapeNewPosEvent } from "../events/TapeNewPosEvent";

export class ViewController{
  graph: Graph;
  tape: Tape;
  turingMachine: TuringMachine;
  tmButtons: TuringMachineButton;
  
  toolManager: ToolManager;
  penAndTouchManager: PenAndTouchManager;

  constructor(turingMachine: TuringMachine){
    this.turingMachine = turingMachine;
    this.setupUI();
  }

  setupUI(){
    this.graph = new Graph(this.turingMachine);

    this.toolManager = new ToolManager(this.graph, this.turingMachine);
    this.penAndTouchManager = new PenAndTouchManager(this.graph, this.turingMachine);

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
      tape.setPos(e.headPos);
    })

    
  }

  setupMenu(){
    var t = this;
    this.toolManager.activate();
    this.penAndTouchManager.deactivate();
    d3.select("#menu").append("button").text("toggle Interaction").on("click", function(){
      if (t.penAndTouchManager.isActivated){
        t.toolManager.activate();
        t.penAndTouchManager.deactivate();
      }else{
        t.toolManager.deactivate();
        t.penAndTouchManager.activate();
      }
    })
  }
}
