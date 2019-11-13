import * as d3 from "d3-selection";
import { addSpaceMan } from "./spaceman";
import { EasterEgg } from "./EasterEggs";
import { Tape } from "../model/Tape";

/**
 * A class to make a space man move on the screen if the tape contain space related word
 */
export class SpacemanEasterEgg extends EasterEgg {
    constructor() { 
        super();
    }

    /**
     * Tests if the tape contains some space related word
     * @param tape 
     * @returns true if be launched 
     */
    shouldBeLaunched(tape: Tape): boolean {
        let text = tape.getContentAsString();
        return text.includes("mars")
            || text.includes("moon")
            || text.includes("nasa");
    }

    /**
     * Draw a flying spaceman on the screen
     * @param tape 
     */
    launch(tape: Tape): void {
        let holder = 
            d3.select("body")
                .append("div")
                .classed("spaceman-holder", true);
        addSpaceMan(holder);
        holder.on("animationend", () => {
            holder.remove();
        });
    }
}