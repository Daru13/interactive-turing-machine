"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class CreateStateAction extends Action_1.Action {
    static do(x, y, turingMachine) {
        turingMachine.stateMachine.createAndAddState({ x: x, y: y }, "State " + CreateStateAction.nameState.toString());
        CreateStateAction.nameState += 1;
    }
}
exports.CreateStateAction = CreateStateAction;
CreateStateAction.nameState = 1;
//# sourceMappingURL=CreateStateAction.js.map