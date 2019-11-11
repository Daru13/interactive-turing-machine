import { EasterEggs } from "./EasterEggs";
import { SpacemanEasterEgg } from "./SpacemanEasterEgg";

export class EasterEggManager {
    text: string;
    easterEggs: EasterEggs[];

    constructor() {
        this.text = "";
        this.easterEggs = [];

        this.addEasterEggs();
    }

    tapeToString(tape: string[]) {
        let s = "";
        tape.forEach(c => s += c);
        return s;
    }

    launch(tape: string[]) {
        this.text = this.tapeToString(tape);
        this.easterEggs.forEach((easterEgg) => {
            if(easterEgg.shouldBeLaunched(this.text)){
                easterEgg.launch(this.text);
            }
        })
    }

    addEasterEggs(){
        this.easterEggs.push(new SpacemanEasterEgg());
    }
}