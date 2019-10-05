import { Tape } from "./Tape";
import { ToolBar } from "./ToolBar";
import { ToolManager } from "./ToolManager";
import { Graph } from "./graph/Graph";
import { TuringMachine } from "../model/TuringMachine";
import { TuringMachineButton } from "./TuringMachineButton";
import { EventManager } from "../events/EventManager";
import { TapeCellUpdateEvent } from "../events/TapeCellUpdateEvent";
import { TapeMoveEvent } from "../events/TapeMoveEvent";

export class ViewController{
  graph: Graph;
  toolManager: ToolManager;
  toolBar: ToolBar;
  tape: Tape;
  turingMachine: TuringMachine;
  tmButtons: TuringMachineButton;

  constructor(turingMachine: TuringMachine){
    this.turingMachine = turingMachine;
    this.setupUI();
  }

  setupUI(){
    this.graph = new Graph();

    this.toolManager = new ToolManager(this.graph, this.turingMachine);
    this.toolBar = new ToolBar(this.toolManager);

    this.tape = new Tape();

    this.tmButtons = new TuringMachineButton(this.turingMachine, this.tape);

    this.setupTapeListener()
  }

  setupTapeListener(){
    var tape = this.tape;
    EventManager.registerHandler("tapeCellUpdate", function(e: TapeCellUpdateEvent){
      tape.updateCell(e.symbol, e.index);
    })

    EventManager.registerHandler("tapeMove", function (e: TapeMoveEvent) {
      tape.move(e.headAction);
    })
  }
}
