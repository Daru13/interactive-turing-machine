import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

export class CreateNodeAction extends Action{
        static nameState: number = 0;

        static do(x: number, y: number, turingMachine: TuringMachine): void {
                turingMachine.stateMachine.createAndAddState({ x: x, y: y}, CreateNodeAction.nameState.toString());
                CreateNodeAction.nameState += 1;
        }
}
