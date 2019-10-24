import * as d3 from "d3-selection";
import { addSpaceMan } from "./spaceman";

export class EasterEggs {
    text: string;
    constructor(tape: string[]){
        this.text = this.tapeToString(tape);
        this.launch();
    }

    tapeToString(tape: string[]){
        let s = "";
        tape.forEach(c => s += c);
        return s;
    }

    launch(){
        if (this.text.includes("mars") || this.text.includes("moon") || this.text.includes("nasa")){
            this.spaceman();
        }
    }

    spaceman(){
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