"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TuringMachine_1 = require("./model/TuringMachine");
const GraphicalTuringMachine_1 = require("./view/GraphicalTuringMachine");
const MenuBar_1 = require("./view/MenuBar");
class Main {
    constructor() {
        this.menuBar = new MenuBar_1.MenuBar(this);
        this.turingMachine = new TuringMachine_1.TuringMachine();
        this.viewController = new GraphicalTuringMachine_1.GraphicalTuringMachine(this.turingMachine);
    }
    setTuringMachineFromImport(json) {
        this.viewController.removeHandler();
        this.turingMachine = TuringMachine_1.TuringMachine.fromJSONExport(json);
        this.viewController = new GraphicalTuringMachine_1.GraphicalTuringMachine(this.turingMachine);
        this.viewController.setInteractionStyle(this.menuBar.interactionStyle);
    }
}
exports.Main = Main;
//# sourceMappingURL=Main.js.map