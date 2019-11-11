import * as d3 from "d3-selection";
import { addSpaceMan } from "./spaceman";
import { Tape } from "../model/Tape";

export class EasterEggs {
    private tape: Tape;

    constructor(tape: Tape) {
        this.tape = tape;
        this.launch();
    }

    private launch(): void {
        let tapeContent = this.tape.getContentAsString();
        if (tapeContent.includes("mars") || tapeContent.includes("moon") || tapeContent.includes("nasa")) {
            this.spaceman();
        }
    }

    private spaceman(): void {
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