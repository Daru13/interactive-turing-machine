import { TuringMachine } from "../model/TuringMachine";

export class TMError {
    protected readonly turingMachine: TuringMachine;

    protected readonly name: string;
    protected readonly shortName: string; // Used in the small screen of the control panel
    protected readonly description: string;

    constructor(turingMachine: TuringMachine,
                name: string,
                description: string = "",
                shortName: string = name) {
        this.turingMachine = turingMachine;

        this.name = name;
        this.shortName = shortName;
        this.description = description;
    }

    getName() {
        return this.name;
    }

    getShortName() {
        return this.shortName;
    }

    getDescription() {
        return this.description;
    }
}