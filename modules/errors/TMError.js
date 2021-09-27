"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TMError {
    constructor(turingMachine, name, problem, solution, shortName = name) {
        this.turingMachine = turingMachine;
        this.name = name;
        this.shortName = shortName;
        this.problem = problem;
        this.solution = solution;
    }
    getName() {
        return this.name;
    }
    getShortName() {
        return this.shortName;
    }
    getProblem() {
        return this.problem;
    }
    getSolution() {
        return this.solution;
    }
}
exports.TMError = TMError;
//# sourceMappingURL=TMError.js.map