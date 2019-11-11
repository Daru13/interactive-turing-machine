import { EasterEggs } from "./EasterEggs";
import { SpacemanEasterEgg } from "./SpacemanEasterEgg";

export class EasterEggManager {
    text: string;
    easterEggs: EasterEggs[];

    constructor(tape: string[]) {
        this.text = this.tapeToString(tape);
        this.easterEggs = [];

        this.addEasterEggs();
        this.launch();
    }

    tapeToString(tape: string[]) {
        let s = "";
        tape.forEach(c => s += c);
        return s;
    }

    launch() {
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