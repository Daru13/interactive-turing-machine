import { Graph } from "../graph/Graph";
import { TuringMachine } from "../../model/TuringMachine";
import { State } from "../../model/State";
import { Action } from "./Action";

export class CreateNodeAction extends Action{
        static nameState: number = 0;

        static do(x: number, y: number, turingMachine: TuringMachine){
                turingMachine.stateMachine.createAndAddState({x: x, y: y}, CreateNodeAction.nameState.toString());
                CreateNodeAction.nameState += 1;
        }
}
