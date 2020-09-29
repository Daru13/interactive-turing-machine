"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class MoveStateAction extends Action_1.Action {
    static do(node, x, y, turingMachine) {
        let state = turingMachine.stateMachine.getState(node.stateID);
        state.setPosition({ x: x, y: y });
    }
}
exports.MoveStateAction = MoveStateAction;
//# sourceMappingURL=MoveStateAction.js.map