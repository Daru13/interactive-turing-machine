import { Popup } from "./Popup";
import { Main } from "../../Main";

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
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":342,"y":323},"label":"0","final":false}],"transitions":[{"id":1,"originID":1,"destinationID":1,"inputSymbol":"","outputSymbol":"","headAction":1}],"initialStateID":1},"tape":{"content":[]}}'
            },

            {
                name: "Unaire soustractor",
                author: "Adrien C.",
                description: "A unaire soustractor that computes a-b with a > b. For the machine to work, add a '#' at the end of the soustraction.",
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":285.04296875,"y":221.36328125},"label":"State 1","final":false},{"id":2,"position":{"x":527.26171875,"y":225.43359375},"label":"State 2","final":false},{"id":3,"position":{"x":830.5,"y":231.51171875},"label":"State 3","final":false},{"id":4,"position":{"x":1106.14453125,"y":240.62109375},"label":"State 4","final":false},{"id":5,"position":{"x":793.453125,"y":425.31640625},"label":"State 5","final":false},{"id":6,"position":{"x":1095.12890625,"y":84.03125},"label":"State 6","final":true}],"transitions":[{"id":1,"originID":1,"destinationID":2,"inputSymbol":"1","outputSymbol":"1","headAction":1},{"id":2,"originID":2,"destinationID":3,"inputSymbol":"-","outputSymbol":"-","headAction":1},{"id":3,"originID":3,"destinationID":4,"inputSymbol":"1","outputSymbol":"*","headAction":0},{"id":4,"originID":4,"destinationID":5,"inputSymbol":"-","outputSymbol":"-","headAction":0},{"id":5,"originID":5,"destinationID":2,"inputSymbol":"1","outputSymbol":"*","headAction":1},{"id":6,"originID":5,"destinationID":5,"inputSymbol":"*","outputSymbol":"*","headAction":0},{"id":7,"originID":3,"destinationID":6,"inputSymbol":"#","outputSymbol":"#","headAction":1},{"id":8,"originID":3,"destinationID":3,"inputSymbol":"*","outputSymbol":"*","headAction":1},{"id":9,"originID":4,"destinationID":4,"inputSymbol":"*","outputSymbol":"*","headAction":0},{"id":10,"originID":2,"destinationID":2,"inputSymbol":"1","outputSymbol":"1","headAction":1},{"id":11,"originID":2,"destinationID":2,"inputSymbol":"*","outputSymbol":"*","headAction":1}],"initialStateID":1},"tape":{"content":["1","1","1","-","1","1","#"]}}'
            },

            {
                name: "Test palindrome word of even length",
                author: "Adrien C.",
                description: "Test if a word of even length in the alphabet {a, b} is a palindrome. Add a '#' at the end of the word for the machine to run",
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":306.73046875,"y":228.70703125},"label":"State 1","final":false},{"id":2,"position":{"x":530.6171875,"y":30.30078125},"label":"State 2","final":false},{"id":3,"position":{"x":823.9765625,"y":27.32421875},"label":"State 3","final":false},{"id":4,"position":{"x":1105.41796875,"y":51.203125},"label":"State 4","final":false},{"id":5,"position":{"x":1267.140625,"y":267.62890625},"label":"State 5","final":true},{"id":6,"position":{"x":1142.140625,"y":428.63671875},"label":"State 6","final":false},{"id":7,"position":{"x":817.64453125,"y":416.72265625},"label":"State 7","final":false},{"id":8,"position":{"x":491.13671875,"y":405.5546875},"label":"State 8","final":false}],"transitions":[{"id":1,"originID":1,"destinationID":2,"inputSymbol":"a","outputSymbol":"*","headAction":1},{"id":2,"originID":2,"destinationID":2,"inputSymbol":"a","outputSymbol":"a","headAction":1},{"id":3,"originID":2,"destinationID":3,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":4,"originID":3,"destinationID":4,"inputSymbol":"a","outputSymbol":"#","headAction":0},{"id":5,"originID":4,"destinationID":4,"inputSymbol":"a","outputSymbol":"a","headAction":0},{"id":6,"originID":4,"destinationID":1,"inputSymbol":"*","outputSymbol":"*","headAction":1},{"id":7,"originID":1,"destinationID":8,"inputSymbol":"b","outputSymbol":"*","headAction":1},{"id":8,"originID":8,"destinationID":7,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":9,"originID":7,"destinationID":6,"inputSymbol":"b","outputSymbol":"#","headAction":0},{"id":10,"originID":6,"destinationID":1,"inputSymbol":"*","outputSymbol":"*","headAction":1},{"id":11,"originID":1,"destinationID":5,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":12,"originID":8,"destinationID":8,"inputSymbol":"a","outputSymbol":"a","headAction":1},{"id":13,"originID":6,"destinationID":6,"inputSymbol":"a","outputSymbol":"a","headAction":0},{"id":14,"originID":2,"destinationID":2,"inputSymbol":"b","outputSymbol":"b","headAction":1},{"id":15,"originID":4,"destinationID":4,"inputSymbol":"b","outputSymbol":"b","headAction":0},{"id":16,"originID":8,"destinationID":8,"inputSymbol":"b","outputSymbol":"b","headAction":1},{"id":17,"originID":6,"destinationID":6,"inputSymbol":"b","outputSymbol":"b","headAction":0}],"initialStateID":1},"tape":{"content":["a","b","b","a","#"]}}'
            },

            {
                name: "Binary addition",
                author: "Adrien C.",
                description: "Binary addition. Put a '#' before the addition, after the addition and to separate both number.",
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":273.26953125,"y":246.640625},"label":"0","final":false},{"id":2,"position":{"x":521.765625,"y":99.88671875},"label":"1","final":false},{"id":3,"position":{"x":692,"y":103.9921875},"label":"3","final":false},{"id":4,"position":{"x":1036.953125,"y":-76.296875},"label":"5","final":false},{"id":5,"position":{"x":490.1328125,"y":521.80859375},"label":"7","final":false},{"id":6,"position":{"x":750.30078125,"y":626.640625},"label":"8","final":false},{"id":8,"position":{"x":593.50390625,"y":350.88671875},"label":"2","final":false},{"id":9,"position":{"x":892.03515625,"y":128.12109375},"label":"4","final":false},{"id":10,"position":{"x":861.96484375,"y":436.92578125},"label":"6","final":false},{"id":11,"position":{"x":1141.80078125,"y":497.12109375},"label":"9","final":false},{"id":15,"position":{"x":1332.26171875,"y":632.08984375},"label":"Done","final":true}],"transitions":[{"id":1,"originID":1,"destinationID":1,"inputSymbol":"#","outputSymbol":"#","headAction":1},{"id":3,"originID":1,"destinationID":2,"inputSymbol":"0","outputSymbol":"0","headAction":1},{"id":4,"originID":1,"destinationID":2,"inputSymbol":"1","outputSymbol":"1","headAction":1},{"id":5,"originID":2,"destinationID":8,"inputSymbol":"#","outputSymbol":"#","headAction":1},{"id":6,"originID":2,"destinationID":2,"inputSymbol":"","outputSymbol":"","headAction":1},{"id":7,"originID":8,"destinationID":3,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":8,"originID":8,"destinationID":8,"inputSymbol":"","outputSymbol":"","headAction":1},{"id":9,"originID":3,"destinationID":11,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":10,"originID":3,"destinationID":9,"inputSymbol":"0","outputSymbol":"#","headAction":0},{"id":11,"originID":3,"destinationID":10,"inputSymbol":"1","outputSymbol":"#","headAction":0},{"id":12,"originID":9,"destinationID":4,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":13,"originID":9,"destinationID":9,"inputSymbol":"","outputSymbol":"","headAction":0},{"id":14,"originID":4,"destinationID":2,"inputSymbol":"0","outputSymbol":"A","headAction":1},{"id":15,"originID":4,"destinationID":2,"inputSymbol":"1","outputSymbol":"B","headAction":1},{"id":16,"originID":4,"destinationID":4,"inputSymbol":"","outputSymbol":"","headAction":0},{"id":17,"originID":10,"destinationID":5,"inputSymbol":"#","outputSymbol":"#","headAction":0},{"id":18,"originID":10,"destinationID":10,"inputSymbol":"","outputSymbol":"","headAction":0},{"id":20,"originID":5,"destinationID":6,"inputSymbol":"1","outputSymbol":"A","headAction":0},{"id":21,"originID":5,"destinationID":5,"inputSymbol":"","outputSymbol":"","headAction":0},{"id":22,"originID":5,"destinationID":2,"inputSymbol":"0","outputSymbol":"B","headAction":1},{"id":23,"originID":6,"destinationID":2,"inputSymbol":"#","outputSymbol":"1","headAction":1},{"id":24,"originID":6,"destinationID":2,"inputSymbol":"0","outputSymbol":"1","headAction":1},{"id":25,"originID":6,"destinationID":6,"inputSymbol":"1","outputSymbol":"0","headAction":0},{"id":26,"originID":11,"destinationID":11,"inputSymbol":"A","outputSymbol":"0","headAction":0},{"id":27,"originID":11,"destinationID":11,"inputSymbol":"B","outputSymbol":"1","headAction":0},{"id":29,"originID":11,"destinationID":15,"inputSymbol":"","outputSymbol":"","headAction":1}],"initialStateID":1},"tape":{"content":["#","0","1","0","0","0","#","1","1","#"]}}'
            },

            {
                name: "Let's go to the moon",
                author: "Adrien C.",
                description: "Makes Elon Musk go to the moon.",
                json: '{"stateMachine":{"states":[{"id":1,"position":{"x":380.65625,"y":195.03125},"label":"State 1","final":false},{"id":2,"position":{"x":790.92578125,"y":202.7734375},"label":"State 2","final":false},{"id":3,"position":{"x":1025.9765625,"y":191.3828125},"label":"State 3","final":false},{"id":5,"position":{"x":1246.69140625,"y":206.02734375},"label":"State 5","final":false},{"id":6,"position":{"x":1104.609375,"y":344.47265625},"label":"State 6","final":false},{"id":7,"position":{"x":696.27734375,"y":339.55078125},"label":"State 7","final":false},{"id":8,"position":{"x":363.42578125,"y":333.33203125},"label":"State 8","final":true},{"id":9,"position":{"x":229.24609375,"y":113.53125},"label":"State 9","final":false}],"transitions":[{"id":2,"originID":1,"destinationID":2,"inputSymbol":"k","outputSymbol":" ","headAction":0},{"id":3,"originID":2,"destinationID":2,"inputSymbol":"","outputSymbol":" ","headAction":0},{"id":4,"originID":2,"destinationID":3,"inputSymbol":".","outputSymbol":"3","headAction":2},{"id":6,"originID":3,"destinationID":3,"inputSymbol":"3","outputSymbol":"2","headAction":2},{"id":7,"originID":3,"destinationID":3,"inputSymbol":"2","outputSymbol":"1","headAction":2},{"id":8,"originID":3,"destinationID":3,"inputSymbol":"1","outputSymbol":"0","headAction":2},{"id":9,"originID":3,"destinationID":5,"inputSymbol":"0","outputSymbol":"m","headAction":1},{"id":10,"originID":5,"destinationID":6,"inputSymbol":"","outputSymbol":"o","headAction":1},{"id":11,"originID":6,"destinationID":7,"inputSymbol":"","outputSymbol":"o","headAction":1},{"id":12,"originID":7,"destinationID":8,"inputSymbol":"","outputSymbol":"n","headAction":1},{"id":13,"originID":1,"destinationID":1,"inputSymbol":"","outputSymbol":" ","headAction":1},{"id":14,"originID":9,"destinationID":1,"inputSymbol":"e","outputSymbol":".","headAction":1}],"initialStateID":9},"tape":{"content":["e","l","o","n"," ","m","u","s","k"]}}'
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