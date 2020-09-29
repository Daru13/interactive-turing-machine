"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transition_1 = require("../../model/Transition");
const Tape_1 = require("../../model/Tape");
const Action_1 = require("./Action");
class CreateTransitionAction extends Action_1.Action {
    static do(originNode, destinationNode, turingMachine) {
        turingMachine.stateMachine
            .addTransition(new Transition_1.Transition(turingMachine.stateMachine.getState(originNode.stateID), turingMachine.stateMachine.getState(destinationNode.stateID), "", "", Tape_1.HeadAction.MoveRight));
    }
}
exports.CreateTransitionAction = CreateTransitionAction;
//# sourceMappingURL=CreateTransitionAction.js.map