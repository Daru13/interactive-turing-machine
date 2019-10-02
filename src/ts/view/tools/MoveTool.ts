import * as d3 from "d3-selection";
import { Graph } from "../graph/Graph";
import { Node, NodeHandleSelection } from "../graph/Node";
import { Edge } from "../graph/Edge";
import { TuringMachine } from "../../model/TuringMachine";


export class MoveTool{
  previousX: number;
  previousY: number;
  node: NodeHandleSelection;
  graph: Graph;
  turingMachine: TuringMachine;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.previousX = 0;
    this.previousY = 0;
    this.graph = graph;
    this.turingMachine = turingMachine;
  }

  pointerDown(e: any){
    this.previousX = e.x;
    this.previousY = e.y;

    if(Node.isNode(d3.select(e.target as any))) {
      this.node = Node.getHandle(d3.select(e.target as any));
      this.node.classed("move", true);
      this.node.raise();
    } else {
      this.node = undefined
    }
  }

  pointerMove(e: any){
    if(this.node !== undefined){
      Node.translate(this.node, e.x - this.previousX, e.y - this.previousY);

      console.log("TODO: get all edges from a node")
    }

    this.previousX = e.x;
    this.previousY = e.y;
  }

  pointerUp(e: any){
    if(this.node !== undefined){
      this.node.classed("move", false);
      this.node = undefined;
    }
  }
}
