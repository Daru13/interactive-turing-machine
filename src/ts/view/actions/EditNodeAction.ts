import { NodeEditor } from "../editors/NodeEditor";
import {  NodeHandleSelection } from "../graph/Node/Node";
import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

export class EditNodeAction extends Action{
    static do(node: NodeHandleSelection, turingMachine: TuringMachine){
        new NodeEditor(node, turingMachine);
    }
}
