import { TuringMachine } from "../model/TuringMachine";

/** A generic class to defines errors thrown by a turing machine */
export class TMError {
    protected readonly turingMachine: TuringMachine;

    protected readonly name: string;
    protected readonly shortName: string; // Used in the small screen of the control panel
    protected readonly problem: string;
    protected readonly solution: string;

    constructor(turingMachine: TuringMachine,
                name: string,
                problem: string,
                solution: string,
                shortName: string = name) {
        this.turingMachine = turingMachine;

        this.name = name;
        this.shortName = shortName;
        this.problem = problem;
        this.solution = solution;
    }

    getName(): string {
        return this.name;
    }

    getShortName(): string {
        return this.shortName;
    }

    getProblem(): string {
        return this.problem;
    }

    getSolution(): string {
        return this.solution;
    }
}