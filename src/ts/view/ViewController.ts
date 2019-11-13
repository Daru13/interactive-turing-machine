import { Tape } from "./Tape";
import { MouseDispatcher } from "./graph-interaction/tools/MouseDispatcher";
import { Graph } from "./graph/Graph";
import { TuringMachine } from "../model/TuringMachine";
import { ControlPanel } from "./ControlPanel";
import { EventManager } from "../events/EventManager";
import { PenAndTouchDispatcher } from "./graph-interaction/pen-and-touch/PenAndTouchDispatcher";
import { ChangeInteractionStyle } from "../events/ChangeInteractionStyleEvent";
import { InteractionStyles } from "./MenuBar";

/** A class to manage a graph and a tape. It is the equivalent of the turing machine in the model */
export class ViewController{
    /** graph managed by the controller */
    graph: Graph;
    /** view managed by the controller */
    tape: Tape;
    /** Associated turing machine */
    turingMachine: TuringMachine;
    /** Control button to control the turing machine */
    tmButtons: ControlPanel;
    /** window resize event handler */
    windowHandler: () => void;
    
    /** tool manager for the graph */
    toolManager: MouseDispatcher;
    /** pen and touch interaction for the graph */
    penAndTouchManager: PenAndTouchDispatcher;

    constructor(turingMachine: TuringMachine) {
        this.turingMachine = turingMachine;
        this.setupUI();
        this.setupListeners();
    }

    /**
     * Setups the ui with a graph, a tape and control buttons. Sets the interaction to Mouse interaction
     */
    setupUI(): void {
        this.graph = new Graph(this.turingMachine);

        this.toolManager = new MouseDispatcher(this.graph, this.turingMachine);
        this.penAndTouchManager = new PenAndTouchDispatcher(this.graph, this.turingMachine);
        this.setInteractionStyle(InteractionStyles.MOUSE);

        this.tape = new Tape(this.turingMachine);
        this.tmButtons = new ControlPanel(this.turingMachine, this.tape);
    }

    /**
     * Setups listeners for when the interaction style changes and when the window is resized
     */
    setupListeners(): void {
        EventManager.registerHandler("changeInteractionStyle", (e: ChangeInteractionStyle) => {
            this.setInteractionStyle(e.interactionStyle);
        });

        this.windowHandler = () => {
            this.resize();
        };
        window.addEventListener("resize", this.windowHandler);
    }


    /**
     * Removes handler
     */
    removeHandler(): void {
        this.graph.removeHandler();
        this.tape.removeEventListeners();
        window.removeEventListener("resize", this.windowHandler);
    }

    /**
     * Function called when the windows is resized
     */
    resize(): void {
        this.graph.resize();
        this.tape.resize();
    }

    /**
     * Sets the current interaction style
     * @param interactionStyle interaction style to use
     */
    setInteractionStyle(interactionStyle: InteractionStyles): void {
        switch (interactionStyle){
            case InteractionStyles.MOUSE:
                this.toolManager.activate();
                this.penAndTouchManager.deactivate();
                break;
            case InteractionStyles.PEN_AND_TOUCH:
                this.toolManager.deactivate();
                this.penAndTouchManager.activate();
                break;
            default:
                console.error("(ViewController.ts) setInteractionStyle(): interaction style not recognise");
        }
    }
}
