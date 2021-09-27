"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMError_1 = require("./TMError");
class NonDeterministicError extends TMError_1.TMError {
    constructor(turingMachine, state, transitions) {
        super(turingMachine, `State ${state.getLabel()} is not deterministic`, `There are more than one transition going out of state ${state.getLabel()} for the same symbol. This makes the Turing machine <strong>non-deterministic</strong>: it cannot decide which transition to follow!`, `Remove or modify the conflicting transitions going out of state ${state.getLabel()} (you can click on a transition to change the input symbol).`, "Non-deterministic state");
        this.state = state;
        this.transitions = transitions;
    }
    getState() {
        return this.state;
    }
    getTransitions() {
        return this.transitions;
    }
}
exports.NonDeterministicError = NonDeterministicError;
//# sourceMappingURL=NonDeterministicError.js.map