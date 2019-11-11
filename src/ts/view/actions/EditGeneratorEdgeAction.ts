import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { GeneratorEdgeEditor } from "../editors/GeneratorEdgeEditor";
import { GeneratorEdge } from "../graph/Edge/GeneratorEdge";

export class EditGeneratorEdgeAction extends Action{
    static do(edge: GeneratorEdge, turingMachine: TuringMachine): void {
        new GeneratorEdgeEditor(edge, turingMachine.stateMachine);
    }
}
