import * as d3 from "d3-selection";
import { addSpaceMan } from "./spaceman";
import { EasterEggs } from "./EasterEggs";

export class SpacemanEasterEgg extends EasterEggs {
    constructor() { 
        super();
    }

    shouldBeLaunched(text: string): boolean {
        return text.includes("mars")
            || text.includes("moon")
            || text.includes("nasa");
    }

    launch(text: string): void {
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