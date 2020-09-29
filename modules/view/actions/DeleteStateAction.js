"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class DeleteStateAction extends Action_1.Action {
    static do(node, turingMachine) {
        turingMachine.stateMachine.removeState(node.stateID);
    }
}
exports.DeleteStateAction = DeleteStateAction;
//# sourceMappingURL=DeleteStateAction.js.map