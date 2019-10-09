import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../events/ModifiedPointerEvent";
import { DeleteAction } from "../actions/DeleteAction";

export class Eraser{
  deleteTool: DeleteAction;

  constructor(graph: Graph, turingMachine: TuringMachine){
    this.deleteTool = new DeleteAction(graph, turingMachine);
  }

  pointerDown(e: ModifiedPointerEvent) { 
    this.deleteTool.pointerDown(e);
  };
  pointerMove(e: ModifiedPointerEvent) { 
    this.deleteTool.pointerMove(e);
  };
  pointerUp(e: ModifiedPointerEvent) { 
    this.deleteTool.pointerUp(e);
  };
  pointerLeave(e: ModifiedPointerEvent) { 
    this.deleteTool.pointerLeave(e);    
  };
}
