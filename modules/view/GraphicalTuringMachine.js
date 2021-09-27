"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InfiniteRoll_1 = require("./InfiniteRoll");
const MouseDispatcher_1 = require("./graph-interaction/tools/MouseDispatcher");
const Graph_1 = require("./Graph");
const ControlPanel_1 = require("./ControlPanel");
const EventManager_1 = require("../events/EventManager");
const PenAndTouchDispatcher_1 = require("./graph-interaction/pen-and-touch/PenAndTouchDispatcher");
const MenuBar_1 = require("./MenuBar");
class GraphicalTuringMachine {
    constructor(turingMachine) {
        this.turingMachine = turingMachine;
        this.setupUI();
        this.setupListeners();
    }
    setupUI() {
        this.graph = new Graph_1.Graph(this.turingMachine);
        this.toolManager = new MouseDispatcher_1.MouseDispatcher(this.graph, this.turingMachine);
        this.penAndTouchManager = new PenAndTouchDispatcher_1.PenAndTouchDispatcher(this.graph, this.turingMachine);
        this.setInteractionStyle(MenuBar_1.InteractionStyles.MOUSE);
        this.roll = new InfiniteRoll_1.InfiniteRoll(this.turingMachine);
        this.tmButtons = new ControlPanel_1.ControlPanel(this.turingMachine, this.roll);
    }
    setupListeners() {
        EventManager_1.EventManager.registerHandler("changeInteractionStyle", (e) => {
            this.setInteractionStyle(e.interactionStyle);
        });
        this.windowHandler = () => {
            this.resize();
        };
        window.addEventListener("resize", this.windowHandler);
    }
    removeHandler() {
        this.graph.removeHandler();
        this.roll.removeEventListeners();
        window.removeEventListener("resize", this.windowHandler);
    }
    resize() {
        this.graph.resize();
        this.roll.resize();
    }
    setInteractionStyle(interactionStyle) {
        switch (interactionStyle) {
            case MenuBar_1.InteractionStyles.MOUSE:
                this.toolManager.activate();
                this.penAndTouchManager.deactivate();
                break;
            case MenuBar_1.InteractionStyles.PEN_AND_TOUCH:
                this.toolManager.deactivate();
                this.penAndTouchManager.activate();
                break;
            default:
                console.error("(ViewController.ts) setInteractionStyle(): interaction style not recognise");
        }
    }
}
exports.GraphicalTuringMachine = GraphicalTuringMachine;
//# sourceMappingURL=GraphicalTuringMachine.js.map