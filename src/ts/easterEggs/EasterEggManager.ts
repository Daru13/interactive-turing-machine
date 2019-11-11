import { EasterEggs } from "./EasterEggs";
import { SpacemanEasterEgg } from "./SpacemanEasterEgg";
import { Tape } from "../model/Tape";

export class EasterEggManager {
    private tape: Tape;
    private tapeMessage: string;
    private easterEggs: EasterEggs[];

    constructor(tape: Tape) {
        this.tape = tape;
        this.tapeMessage = "";
        this.easterEggs = [];

        this.addEasterEggs();
    }

    launch(tape: string[]): void {
        this.tapeMessage = this.tape.getContentAsString();

        this.easterEggs.forEach((easterEgg) => {
            if (easterEgg.shouldBeLaunched(this.tapeMessage)) {
                easterEgg.launch(this.tapeMessage);
            }
        });
    }

    addEasterEggs(): void {
        this.easterEggs.push(new SpacemanEasterEgg());
    }
}