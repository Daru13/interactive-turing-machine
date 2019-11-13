import { TuringMachine } from "./model/TuringMachine";
import { ViewController } from "./view/ViewController";
import { MenuBar } from "./view/MenuBar";

/** A class to create our application */
export class Main{
    /** turing machine currently used */
    turingMachine: TuringMachine;
    /** view controller associated to the current turing machine */
    viewController: ViewController;
    /** the menu bar */
    menuBar: MenuBar;

    constructor() {
        this.menuBar = new MenuBar(this);

        this.turingMachine = new TuringMachine();
        this.viewController = new ViewController(this.turingMachine);
    }

    /**
     * Sets the turing machine imported by the user
     * @param json json describing the turing machine
     */
    setTuringMachineFromImport(json: string): void {
        this.viewController.removeHandler();
        this.turingMachine = TuringMachine.fromJSONExport(json);
        this.viewController = new ViewController(this.turingMachine);
        this.viewController.setInteractionStyle(this.menuBar.interactionStyle);
    }
}