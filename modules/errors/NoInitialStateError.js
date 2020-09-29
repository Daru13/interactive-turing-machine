"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMError_1 = require("./TMError");
class NoInitialStateError extends TMError_1.TMError {
    constructor(turingMachine) {
        super(turingMachine, "No initial state", "There is no <strong>initial state</strong>: the Turing machine does not know where to start!", "Draw a transition from the generator (the element with a lightning) to any state to make it initial.");
    }
}
exports.NoInitialStateError = NoInitialStateError;
//# sourceMappingURL=NoInitialStateError.js.map