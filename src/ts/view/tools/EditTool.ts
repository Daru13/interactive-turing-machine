import { Graph } from "../graph/Graph";
import * as d3 from "d3-selection";
import { EdgeEditor } from "../EdgeEditor";
import { NodeEditor } from "../NodeEditor";
import { Node } from "../graph/Node";
import { Edge } from "../graph/Edge";
import { TuringMachine } from "../../model/TuringMachine";
import { Tool } from "./Tool";

export class EditTool extends Tool{
  graph: Graph;
  edge: any;
  node: any;
  turingMachine: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    super(graph, turingMachine);
    this.graph = graph;
    this.turingMachine = turingMachine;
  }

  pointerDown(e: any){
    let target = d3.select(e.target as any);
    this.edge = undefined;
    this.node = undefined;
    if(Node.isNode(d3.select(e.target as any))){
      this.node = Node.getHandle(d3.select(e.target as any));
    }else if(Edge.isAnEdge(d3.select(e.target as any))){
      this.edge = Edge.getHandle(d3.select(e.target as any));
    }
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    if(this.node !== undefined){
      new NodeEditor(this.node);
    }
    if(this.edge !== undefined){
      new EdgeEditor(this.edge);
    }
  }
}
