import { TuringMachine } from "../../model/TuringMachine";
import { Action } from "./Action";

/** A class with a static property to add a state in a turing machine. */
export class CreateStateAction extends Action{
        static nameState: number = 1;

        static do(x: number, y: number, turingMachine: TuringMachine): void {
                turingMachine.stateMachine.createAndAddState({ x: x, y: y}, "State " + CreateStateAction.nameState.toString());
                CreateStateAction.nameState += 1;
        }
}
