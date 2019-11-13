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

            {
                name: "Let's go to the moon",
                author: "Adrien C.",
                description: "Makes Elon Musk go to the moon.",
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":380.65625,"y":195.03125},"label":"State 1","final":false},{"id":2,"position":{"x":790.92578125,"y":202.7734375},"label":"State 2","final":false},{"id":3,"position":{"x":1025.9765625,"y":191.3828125},"label":"State 3","final":false},{"id":5,"position":{"x":1246.69140625,"y":206.02734375},"label":"State 5","final":false},{"id":6,"position":{"x":1104.609375,"y":344.47265625},"label":"State 6","final":false},{"id":7,"position":{"x":696.27734375,"y":339.55078125},"label":"State 7","final":false},{"id":8,"position":{"x":363.42578125,"y":333.33203125},"label":"State 8","final":true},{"id":9,"position":{"x":229.24609375,"y":113.53125},"label":"State 9","final":false}],"transitions":[{"id":2,"fromStateID":1,"toStateID":2,"onSymbol":"k","outputSymbol":" ","headAction":0},{"id":3,"fromStateID":2,"toStateID":2,"onSymbol":"","outputSymbol":" ","headAction":0},{"id":4,"fromStateID":2,"toStateID":3,"onSymbol":".","outputSymbol":"3","headAction":2},{"id":6,"fromStateID":3,"toStateID":3,"onSymbol":"3","outputSymbol":"2","headAction":2},{"id":7,"fromStateID":3,"toStateID":3,"onSymbol":"2","outputSymbol":"1","headAction":2},{"id":8,"fromStateID":3,"toStateID":3,"onSymbol":"1","outputSymbol":"0","headAction":2},{"id":9,"fromStateID":3,"toStateID":5,"onSymbol":"0","outputSymbol":"m","headAction":1},{"id":10,"fromStateID":5,"toStateID":6,"onSymbol":"","outputSymbol":"o","headAction":1},{"id":11,"fromStateID":6,"toStateID":7,"onSymbol":"","outputSymbol":"o","headAction":1},{"id":12,"fromStateID":7,"toStateID":8,"onSymbol":"","outputSymbol":"n","headAction":1},{"id":13,"fromStateID":1,"toStateID":1,"onSymbol":"","outputSymbol":" ","headAction":1},{"id":14,"fromStateID":9,"toStateID":1,"onSymbol":"e","outputSymbol":".","headAction":1}],"initialStateID":9},"tape":{"content":["e","l","o","n"," ","m","u","s","k"]}}'
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