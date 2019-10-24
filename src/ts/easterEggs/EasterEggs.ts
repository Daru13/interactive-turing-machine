import * as d3 from "d3-selection";
import { addSpaceMan } from "./spaceman";

export class EasterEggs {
    constructor(){

    }

    static spaceman(){
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