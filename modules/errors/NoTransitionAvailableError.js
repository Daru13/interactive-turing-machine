"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMError_1 = require("./TMError");
class NoTransitionAvailableError extends TMError_1.TMError {
    constructor(turingMachine, state) {
        super(turingMachine, `No transition available in state ${state.getLabel()}`, `There is no transition going out of state ${state.getLabel()} for symbol "${turingMachine.tape.getCurrentSymbol()}": the Turing machine is stuck!`, `Either add more transitions or make state ${state.getLabel()} final to tell the Turing machine it can stop here (you can click on a state to change whether it is final or not).`, "No transition available");
        this.state = state;
    }
    getState() {
        return this.state;
    }
}
exports.NoTransitionAvailableError = NoTransitionAvailableError;
//# sourceMappingURL=NoTransitionAvailableError.js.map