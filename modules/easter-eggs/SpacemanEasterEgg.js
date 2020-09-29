"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const spaceman_1 = require("./spaceman");
const EasterEggs_1 = require("./EasterEggs");
class SpacemanEasterEgg extends EasterEggs_1.EasterEgg {
    constructor() {
        super();
    }
    shouldBeLaunched(tape) {
        let text = tape.getContentAsString();
        return text.includes("mars")
            || text.includes("moon")
            || text.includes("nasa");
    }
    launch(tape) {
        let holder = d3.select("body")
            .append("div")
            .classed("spaceman-holder", true);
        spaceman_1.addSpaceMan(holder);
        holder.on("animationend", () => {
            holder.remove();
        });
    }
}
exports.SpacemanEasterEgg = SpacemanEasterEgg;
//# sourceMappingURL=SpacemanEasterEgg.js.map