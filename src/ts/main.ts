import { TuringMachine } from "./model/TuringMachine";
import { ViewController } from "./view/ViewController";
import { MenuBar } from "./view/MenuBar";

export class Main{
    turingMachine: TuringMachine;
    viewController: ViewController;
    menuBar: MenuBar;

    constructor(){
        this.menuBar = new MenuBar(this);

        this.turingMachine = new TuringMachine();
        this.viewController = new ViewController(this.turingMachine);
    }

    setTuringMachine(turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        console.log(this.turingMachine.toString());
        this.viewController.removeHandler();
        this.viewController = new ViewController(this.turingMachine);
        this.viewController.setInteractionStyle(this.menuBar.interactionStyle);
    }
}