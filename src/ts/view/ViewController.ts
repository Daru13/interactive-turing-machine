import { Tape } from "./Tape";
import { ToolBar } from "./ToolBar";
import { ToolManager } from "./ToolManager";
import { Graph } from "./graph/Graph";
import { TuringMachine } from "../model/TuringMachine";

export class ViewController{
  graph: Graph;
  toolManager: ToolManager;
  toolBar: ToolBar;
  tape: Tape;
  turingMachine: TuringMachine;

  constructor(turingMachine: TuringMachine){
    this.turingMachine = turingMachine;
    this.setupUI();
  }

  setupUI(){
    this.graph = new Graph();

    this.toolManager = new ToolManager(this.graph, this.turingMachine);
    this.toolBar = new ToolBar(this.toolManager);

    this.tape = new Tape();
  }
}
