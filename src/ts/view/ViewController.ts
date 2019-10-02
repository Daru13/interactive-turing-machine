import { Tape } from "./Tape";
import { ToolBar } from "./ToolBar";
import { ToolManager } from "./ToolManager";
import { Graph } from "./graph/Graph";

export class ViewController{
  graph: Graph;
  toolManager: ToolManager;
  toolBar: ToolBar;
  tape: Tape;

  constructor(){
    this.setupUI();
  }

  setupUI(){
    this.graph = new Graph();

    this.toolManager = new ToolManager(this.graph);
    this.toolBar = new ToolBar(this.toolManager);

    this.tape = new Tape();
  }
}
