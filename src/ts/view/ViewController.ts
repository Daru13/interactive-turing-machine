import { Tape } from "./Tape";
import { MouseDispatcher, toolName } from "./graphInteraction/tools/MouseDispatcher";
import { Graph } from "./graph/Graph";
import { TuringMachine } from "../model/TuringMachine";
import { ControlPanel } from "./ControlPanel";
import { EventManager } from "../events/EventManager";
import { PenAndTouchDispatcher } from "./graphInteraction/penAndTouch/PenAndTouchDispatcher";
import { ChangeInteractionStyle } from "../events/ChangeInteractionStyleEvent";
import { InteractionStyles } from "./MenuBar";

export class ViewController{
    graph: Graph;
    tape: Tape;
    turingMachine: TuringMachine;
    tmButtons: ControlPanel;
    
    toolManager: MouseDispatcher;
    penAndTouchManager: PenAndTouchDispatcher;

    constructor(turingMachine: TuringMachine){
        this.turingMachine = turingMachine;
        this.setupUI();
        this.setupListeners();
    }

    setupUI(){
        this.graph = new Graph(this.turingMachine);

        this.toolManager = new MouseDispatcher(this.graph, this.turingMachine);
        this.penAndTouchManager = new PenAndTouchDispatcher(this.graph, this.turingMachine);
        this.setInteractionStyle(InteractionStyles.MOUSE);

        this.tape = new Tape();
        this.tmButtons = new ControlPanel(this.turingMachine, this.tape);
    }

    setupListeners() {
        EventManager.registerHandler("changeInteractionStyle", (e: ChangeInteractionStyle) => {
            this.setInteractionStyle(e.interactionStyle)
        })
    }

    setInteractionStyle(interactionStyle: InteractionStyles) {
        switch(interactionStyle){
            case InteractionStyles.MOUSE:
                this.toolManager.activate();
                this.penAndTouchManager.deactivate();
                break;
            case InteractionStyles.PEN_AND_TOUCH:
                this.toolManager.deactivate();
                this.penAndTouchManager.activate();
                break;
            default:
                console.error("(ViewController.ts) setInteractionStyle(): interaction style not recognise")
        }
    }
}
