import { TuringMachine } from "../model/TuringMachine";

/** A generic class to defines errors thrown by a turing machine. */
export class TMError {
    /** Turing machine that throws errors. */
    protected readonly turingMachine: TuringMachine;

    /** The name of the error. */
    protected readonly name: string;
    /** The short name of the error that will be dispaly in the screen of the [[ControlPanel]] . */
    protected readonly shortName: string;
    /** The problem description that created this error. */
    protected readonly problem: string;
    /** The description of a possible solution to solve the problem. */
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

    /**
     * Gets the name of the error.
     * @returns Name of the error.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Gets the short name of the error.
     * @returns Short name of the error.
     */
    getShortName(): string {
        return this.shortName;
    }

    /**
     * Gets the problem description of the error.
     * @returns problem description.
     */
    getProblem(): string {
        return this.problem;
    }

    /**
     * Gets the solution description of the error.
     * @returns solution description.
     */
    getSolution(): string {
        return this.solution;
    }
}