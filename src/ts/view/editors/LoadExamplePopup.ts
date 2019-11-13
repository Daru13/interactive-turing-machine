import { Popup } from "./Popup";
import { Main } from "../../main";

interface ExampleMachine {
    readonly name: string;
    readonly author: string;
    readonly description: string;
    readonly json: string;
}

/** a pop up to load predefined turing machine */
export class LoadExamplePopup extends Popup {
    /** the application */
    private main: Main;
    /** list of predefined turing machines */
    private examples: ExampleMachine[];

    constructor(main: Main) {
        super();
        this.main = main;

        this.init();
    }

    /**
     * Inits the load example popup
     */
    private init(): void {
        this.setTitle("Load an example machine");
        this.holder.attr("id", "load-example-machine-popup");

        this.initExamples();
        this.addExampleList();

        this.center();
    }

    /**
     * Inits predefined turing machine
     */
    private initExamples(): void {
        this.examples = [
            // Add loadable machines here
            {
                name: "A Test Turing Machine!",
                author: "Camille G.",
                description: "Looping over a single state, indefinitely.",
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":342,"y":323},"label":"0","final":false}],"transitions":[{"id":1,"fromStateID":1,"toStateID":1,"onSymbol":"","outputSymbol":"","headAction":1}],"initialStateID":1},"tape":{"content":[]}}'
            },
        ];
    }

    /**
     * Display the list of possible predefined turing machine
     */
    private addExampleList(): void {
        let list = this.content.append("div")
            .attr("id", "example-machine-list");

        for (let example of this.examples) {
            let item = list.append("div")
                .classed("example-machine", true);
            
            item.append("h4")
                .classed("title", true)
                .text(example.name);
            item.append("span")
                .classed("author", true)
                .text(example.author);
            item.append("p")
                .classed("description", true)
                .text(example.description);
            item.append("button")
                .classed("load-button", true)
                .text("Load machine")
                .on("click", () => {
                    this.main.setTuringMachineFromImport(example.json);
                    this.close();
                });
        }
    }
}