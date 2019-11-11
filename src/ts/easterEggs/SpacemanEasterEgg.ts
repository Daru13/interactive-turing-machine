import * as d3 from "d3-selection";
import { addSpaceMan } from "./spaceman";
import { EasterEggs } from "./EasterEggs";

export class SpacemanEasterEgg extends EasterEggs {
    constructor(){ 
        super();
    }

    shouldBeLaunched(text: string): boolean{
        if (text.includes("mars") || text.includes("moon") || text.includes("nasa")){
            return true;
        }
        return false;
    }

    launch(text: string){
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