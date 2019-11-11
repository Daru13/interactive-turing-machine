import { TuringMachine } from "./model/TuringMachine";
import { ViewController } from "./view/ViewController";
import { MenuBar } from "./view/MenuBar";

export class Main{
    turingMachine: TuringMachine;
    viewController: ViewController;
    menuBar: MenuBar;

    constructor() {
        this.menuBar = new MenuBar(this);

        this.turingMachine = new TuringMachine();
        this.viewController = new ViewController(this.turingMachine);
    }

    setTuringMachine(turingMachine: TuringMachine): void {
        this.turingMachine = turingMachine;
        this.viewController.removeHandler();
        this.viewController = new ViewController(this.turingMachine);
        this.viewController.setInteractionStyle(this.menuBar.interactionStyle);
    }
}