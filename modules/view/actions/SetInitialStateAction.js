"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class SetInitialStateAction extends Action_1.Action {
    static do(node, turingMachine) {
        turingMachine.stateMachine.setInitialState(node.stateID);
    }
}
exports.SetInitialStateAction = SetInitialStateAction;
//# sourceMappingURL=SetInitialStateAction.js.map