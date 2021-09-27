"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpacemanEasterEgg_1 = require("./SpacemanEasterEgg");
class EasterEggManager {
    constructor() {
        this.easterEggs = [];
        this.addEasterEggs();
    }
    launch(tape) {
        this.easterEggs.forEach((easterEgg) => {
            if (easterEgg.shouldBeLaunched(tape)) {
                easterEgg.launch(tape);
            }
        });
    }
    addEasterEggs() {
        this.easterEggs.push(new SpacemanEasterEgg_1.SpacemanEasterEgg());
    }
}
exports.EasterEggManager = EasterEggManager;
//# sourceMappingURL=EasterEggManager.js.map