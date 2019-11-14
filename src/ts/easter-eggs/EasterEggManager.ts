import { EasterEgg } from "./EasterEggs";
import { SpacemanEasterEgg } from "./SpacemanEasterEgg";
import { Tape } from "../model/Tape";

/** A class to manage the different easter eggs. */
export class EasterEggManager {
    /** list of the possible easter eggs. */
    private easterEggs: EasterEgg[];

    constructor() {
        this.easterEggs = [];

        this.addEasterEggs();
    }

    /**
     * Launchs easter eggs that should be launch based on the content of the tape.
     * @param tape the tape to get content from.
     */
    launch(tape: Tape): void {
        this.easterEggs.forEach((easterEgg) => {
            if (easterEgg.shouldBeLaunched(tape)) {
                easterEgg.launch(tape);
            }
        });
    }

    /**
     * Adds easter eggs to this.easterEggs.
     */
    addEasterEggs(): void {
        this.easterEggs.push(new SpacemanEasterEgg());
    }
}