import { Popup } from "./Popup";
import { Main } from "../../main";

interface ExampleMachine {
    readonly name: string;
    readonly author: string;
    readonly description: string;
    readonly json: string;
}

export class LoadExamplePopup extends Popup {
    private main: Main;
    private examples: ExampleMachine[];

    constructor(main: Main) {
        super();
        this.main = main;

        this.init();
    }

    private init(): void {
        this.setTitle("Load an example machine");
        this.holder.attr("id", "load-example-machine-popup");

        this.initExamples();
        this.addExampleList();

        this.center();
    }

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