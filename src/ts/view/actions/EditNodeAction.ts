import { NodeEditor } from "../editors/NodeEditor";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";
import { StateNode } from "../graph/Node/StateNode";

export class EditNodeAction extends Action{
    static do(node: StateNode, turingMachine: TuringMachine){
        new NodeEditor(node, turingMachine);
    }
}
