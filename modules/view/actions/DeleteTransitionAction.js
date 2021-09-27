"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class DeleteTransitionAction extends Action_1.Action {
    static do(edge, turingMachine) {
        let transitionIDs = edge.transitionIDs.slice();
        transitionIDs.forEach((transitionID) => {
            turingMachine.stateMachine.removeTransition(transitionID);
        });
    }
}
exports.DeleteTransitionAction = DeleteTransitionAction;
//# sourceMappingURL=DeleteTransitionAction.js.map