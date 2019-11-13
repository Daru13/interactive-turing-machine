import { Tape } from "../model/Tape";

/** An abstract to extend to create easter egg */
export class EasterEgg {
    constructor() { }

    /**
     * Test to know if the easter egg should be launch based on tape content
     * @param tape
     * @returns true if be launched 
     */
    shouldBeLaunched(tape: Tape): boolean { return false; }

    /**
     * Launchs easter egg
     * @param tape 
     */
    launch(tape: Tape): void { }
}