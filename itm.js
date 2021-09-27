(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TuringMachine_1 = require("./model/TuringMachine");
const GraphicalTuringMachine_1 = require("./view/GraphicalTuringMachine");
const MenuBar_1 = require("./view/MenuBar");
class Main {
    constructor() {
        this.menuBar = new MenuBar_1.MenuBar(this);
        this.turingMachine = new TuringMachine_1.TuringMachine();
        this.viewController = new GraphicalTuringMachine_1.GraphicalTuringMachine(this.turingMachine);
    }
    setTuringMachineFromImport(json) {
        this.viewController.removeHandler();
        this.turingMachine = TuringMachine_1.TuringMachine.fromJSONExport(json);
        this.viewController = new GraphicalTuringMachine_1.GraphicalTuringMachine(this.turingMachine);
        this.viewController.setInteractionStyle(this.menuBar.interactionStyle);
    }
}
exports.Main = Main;

},{"./model/TuringMachine":32,"./view/GraphicalTuringMachine":35,"./view/MenuBar":37}],2:[function(require,module,exports){
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

},{"./SpacemanEasterEgg":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EasterEgg {
    constructor() { }
    shouldBeLaunched(tape) { return false; }
    launch(tape) { }
}
exports.EasterEgg = EasterEgg;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const spaceman_1 = require("./spaceman");
const EasterEggs_1 = require("./EasterEggs");
class SpacemanEasterEgg extends EasterEggs_1.EasterEgg {
    constructor() {
        super();
    }
    shouldBeLaunched(tape) {
        let text = tape.getContentAsString();
        return text.includes("mars")
            || text.includes("moon")
            || text.includes("nasa");
    }
    launch(tape) {
        let holder = d3.select("body")
            .append("div")
            .classed("spaceman-holder", true);
        spaceman_1.addSpaceMan(holder);
        holder.on("animationend", () => {
            holder.remove();
        });
    }
}
exports.SpacemanEasterEgg = SpacemanEasterEgg;

},{"./EasterEggs":3,"./spaceman":5,"d3-selection":72}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addSpaceMan(holder) {
    holder.node().innerHTML = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86.3 264.27"><defs><style>.cls-1{fill:#ff5b48;}.cls-2{fill:#932d6f;}.cls-3{fill:#6b82ff;}.cls-4{fill:#90ff3f;}.cls-5{fill:#ffea47;}.cls-6{fill:#ccc;}.cls-10,.cls-11,.cls-6,.cls-7,.cls-8,.cls-9{stroke:#000;stroke-width:6px;}.cls-10,.cls-11,.cls-6{stroke-miterlimit:10;}.cls-7{fill:#999;}.cls-12,.cls-13,.cls-7,.cls-8,.cls-9{stroke-linecap:round;stroke-linejoin:round;}.cls-10,.cls-14,.cls-8{fill:#fff;}.cls-12,.cls-9{fill:none;}.cls-11{fill:#9bc5ef;}.cls-12{stroke:#fff;stroke-width:2px;}.cls-13{fill:blue;stroke:#de0000;}.cls-15{fill:#ff0;}</style></defs><title>spaceman</title><rect class="cls-1" x="21.93" y="119.2" width="8.49" height="102.99"/><rect class="cls-2" x="55.88" y="119.2" width="8.49" height="102.99"/><rect class="cls-3" x="47.39" y="119.2" width="8.49" height="102.99"/><rect class="cls-4" x="38.9" y="119.2" width="8.49" height="102.99"/><rect class="cls-5" x="30.42" y="119.2" width="8.49" height="102.99"/><path class="cls-6" d="M78,80.44V52.23c0-10.38-13.63-17.94-22.16-17.94H24.47c-8.54,0-22.16,7.56-22.16,17.94V80.44Z" transform="translate(3 1.31)"/><circle class="cls-7" cx="74.89" cy="101.64" r="8.41"/><circle class="cls-7" cx="11.66" cy="101.64" r="8.41"/><path class="cls-8" d="M66.41,62.6H13.64C5.61,62.6,0,67.79,0,75.49,0,86.85.25,98.36.25,98.36H16l-.17-21.64s.73,41.08.9,51.21,12.5,10.14,12.5,10.14,9.93.28,11.08-8.13c1.15,8.41,11.08,8.13,11.08,8.13s12.33,0,12.5-10.14.4-51.21.4-51.21l.26,21.64H80.3s-.25-11.51-.25-22.87C80.05,67.79,74.44,62.6,66.41,62.6ZM40.52,118.2s-.06,4.53-.25,11.74c-.18-7.21-.25-11.74-.25-11.74l-10.83-.3H51.35Z" transform="translate(3 1.31)"/><path class="cls-9" d="M40.16,95.27c-.06-9.29,0-32.67,0-32.67" transform="translate(3 1.31)"/><circle class="cls-10" cx="43.15" cy="37.16" r="34.16"/><path class="cls-11" d="M60,23.85H20.33C15.86,27,13.12,31.31,13.12,36c0,9.89,12.1,17.9,27,17.9s27-8,27-17.9C67.17,31.31,64.44,27,60,23.85Z" transform="translate(3 1.31)"/><path class="cls-12" d="M55.15,28.7s4.94,3.3,4.94,7.57S55.15,43,55.15,43" transform="translate(3 1.31)"/><path class="cls-12" d="M24.61,28.7s-4.94,3.3-4.94,7.57S24.61,43,24.61,43" transform="translate(3 1.31)"/><ellipse class="cls-13" cx="55.64" cy="83.16" rx="6.42" ry="6.49"/><polygon class="cls-14" points="53.55 79.1 53.21 78.93 52.88 79.12 52.93 78.75 52.66 78.49 53.03 78.42 53.18 78.08 53.36 78.41 53.73 78.45 53.47 78.73 53.55 79.1"/><polygon class="cls-14" points="52.67 83.62 51.93 83.43 51.36 83.94 51.31 83.17 50.66 82.78 51.37 82.5 51.54 81.75 52.02 82.34 52.77 82.27 52.37 82.92 52.67 83.62"/><polygon class="cls-14" points="60.67 82.96 59.92 83.2 59.7 83.96 59.24 83.32 58.46 83.34 58.92 82.7 58.66 81.96 59.41 82.2 60.03 81.73 60.02 82.52 60.67 82.96"/><polygon class="cls-15" points="54.47 87.22 54.44 86.58 53.9 86.25 54.49 86.03 54.63 85.41 55.03 85.9 55.65 85.85 55.31 86.38 55.55 86.97 54.95 86.81 54.47 87.22"/><polygon class="cls-14" points="55 81.5 54.44 81.36 54.01 81.75 53.97 81.17 53.47 80.88 54 80.66 54.12 80.09 54.49 80.53 55.07 80.47 54.77 80.97 55 81.5"/><ellipse class="cls-15" cx="50.9" cy="86.47" rx="1.06" ry="0.59" transform="translate(-46.01 97.04) rotate(-64.81)"/><path class="cls-14" d="M53.42,82.67l.46-1.16c2-5.12.32-5.85-1.71-.69L51.71,82c-.22-.17-.62-.24-.71,0l-1.21,3c-.09.23.25.46.53.49l-.08.2c-.14.36,1.6,1,1.71.69l.08-.2c.23.17.62.25.72,0l1.2-3C54.05,82.92,53.71,82.7,53.42,82.67Z" transform="translate(3 1.31)"/><polygon class="cls-14" points="58.68 86.43 58.34 86.27 58.02 86.45 58.07 86.08 57.79 85.82 58.16 85.76 58.31 85.41 58.49 85.75 58.86 85.79 58.6 86.06 58.68 86.43"/><g id="circle"><circle class="cls-5" cx="44.35" cy="240.22" r="24.05"><animate     attributeName="r"    values="20; 30; 20" dur="1s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-1" cx="32.38" cy="219.71" r="8.58"><animate     attributeName="r"    values="6;10;6"  dur="1.2s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-2" cx="22.14" cy="231.53" r="13.09"><animate     attributeName="r"   values="10;16;10"     dur="1.4s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-2" cx="64.16" cy="228.28" r="6.56"><animate     attributeName="r"    values="4;8;4"     dur="1.1s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-3" cx="35.93" cy="234.17" r="6.56"><animate     attributeName="r"    values="4;8;4"    dur="1s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-4" cx="49.13" cy="223.41" r="11.45"><animate     attributeName="r"    values="8;14;8"    dur="0.5s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-1" cx="64.16" cy="245.89" r="13.09"><animate     attributeName="r"    values="10;16;10"      dur="1.5s"    begin="0s"    repeatCount="indefinite"/></circle><circle class="cls-3" cx="62.57" cy="234.86" r="6.56"><animate     attributeName="r"    values="4;8;4"   dur="2s"    begin="0s"    repeatCount="indefinite"/></circle></g></svg>';
}
exports.addSpaceMan = addSpaceMan;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMError_1 = require("./TMError");
class NoInitialStateError extends TMError_1.TMError {
    constructor(turingMachine) {
        super(turingMachine, "No initial state", "There is no <strong>initial state</strong>: the Turing machine does not know where to start!", "Draw a transition from the generator (the element with a lightning) to any state to make it initial.");
    }
}
exports.NoInitialStateError = NoInitialStateError;

},{"./TMError":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMError_1 = require("./TMError");
class NoTransitionAvailableError extends TMError_1.TMError {
    constructor(turingMachine, state) {
        super(turingMachine, `No transition available in state ${state.getLabel()}`, `There is no transition going out of state ${state.getLabel()} for symbol "${turingMachine.tape.getCurrentSymbol()}": the Turing machine is stuck!`, `Either add more transitions or make state ${state.getLabel()} final to tell the Turing machine it can stop here (you can click on a state to change whether it is final or not).`, "No transition available");
        this.state = state;
    }
    getState() {
        return this.state;
    }
}
exports.NoTransitionAvailableError = NoTransitionAvailableError;

},{"./TMError":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMError_1 = require("./TMError");
class NonDeterministicError extends TMError_1.TMError {
    constructor(turingMachine, state, transitions) {
        super(turingMachine, `State ${state.getLabel()} is not deterministic`, `There are more than one transition going out of state ${state.getLabel()} for the same symbol. This makes the Turing machine <strong>non-deterministic</strong>: it cannot decide which transition to follow!`, `Remove or modify the conflicting transitions going out of state ${state.getLabel()} (you can click on a transition to change the input symbol).`, "Non-deterministic state");
        this.state = state;
        this.transitions = transitions;
    }
    getState() {
        return this.state;
    }
    getTransitions() {
        return this.transitions;
    }
}
exports.NonDeterministicError = NonDeterministicError;

},{"./TMError":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TMError {
    constructor(turingMachine, name, problem, solution, shortName = name) {
        this.turingMachine = turingMachine;
        this.name = name;
        this.shortName = shortName;
        this.problem = problem;
        this.solution = solution;
    }
    getName() {
        return this.name;
    }
    getShortName() {
        return this.shortName;
    }
    getProblem() {
        return this.problem;
    }
    getSolution() {
        return this.solution;
    }
}
exports.TMError = TMError;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChangeInteractionStyle {
    constructor(interactionStyle) {
        this.id = "changeInteractionStyle";
        this.interactionStyle = interactionStyle;
    }
}
exports.ChangeInteractionStyle = ChangeInteractionStyle;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeleteStateEvent {
    constructor(state) {
        this.id = "deleteState";
        this.state = state;
    }
}
exports.DeleteStateEvent = DeleteStateEvent;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeleteTransitionEvent {
    constructor(transition) {
        this.id = "deleteTransition";
        this.transition = transition;
    }
}
exports.DeleteTransitionEvent = DeleteTransitionEvent;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditFinalStateEvent {
    constructor(state, isFinal) {
        this.id = "editFinalState";
        this.state = state;
        this.isFinal = isFinal;
    }
}
exports.EditFinalStateEvent = EditFinalStateEvent;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditInitialStateEvent {
    constructor(state, isFirstInitialState) {
        this.id = "editInitialState";
        this.state = state;
        this.isFirstInitialState = isFirstInitialState;
    }
}
exports.EditInitialStateEvent = EditInitialStateEvent;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditStateEvent {
    constructor(state) {
        this.id = "editState";
        this.state = state;
    }
}
exports.EditStateEvent = EditStateEvent;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditTransitionEvent {
    constructor(transition) {
        this.id = "editTransition";
        this.transition = transition;
    }
}
exports.EditTransitionEvent = EditTransitionEvent;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventManager {
    static emit(event) {
        let eventID = event.id;
        if (!EventManager.eventHandlers.has(eventID)) {
            return;
        }
        let handlers = EventManager.eventHandlers.get(eventID);
        for (let handler of handlers) {
            handler(event);
        }
    }
    static registerHandler(eventID, handler) {
        if (!EventManager.eventHandlers.has(eventID)) {
            EventManager.eventHandlers.set(eventID, []);
        }
        let handlers = EventManager.eventHandlers.get(eventID);
        handlers.push(handler);
    }
    static unregisterHandler(eventID, handler) {
        let handlers = EventManager.eventHandlers.get(eventID);
        let handlerIndex = handlers.indexOf(handler);
        if (handlerIndex >= 0) {
            handlers.splice(handlerIndex, 1);
        }
        if (handlers.length === 0) {
            EventManager.eventHandlers.delete(eventID);
        }
    }
}
exports.EventManager = EventManager;
EventManager.eventHandlers = new Map();

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class moveStateEvent {
    constructor(state, position) {
        this.id = "moveState";
        this.state = state;
        this.position = position;
    }
}
exports.moveStateEvent = moveStateEvent;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NewCurrentStateEvent {
    constructor(state) {
        this.id = "newCurrentState";
        this.state = state;
    }
}
exports.NewCurrentStateEvent = NewCurrentStateEvent;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NewStateEvent {
    constructor(state) {
        this.id = "newState";
        this.state = state;
    }
}
exports.NewStateEvent = NewStateEvent;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NewTransitionEvent {
    constructor(transition) {
        this.id = "newTransition";
        this.transition = transition;
    }
}
exports.NewTransitionEvent = NewTransitionEvent;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TapeCellUpdateEvent {
    constructor(symbol, index) {
        this.id = "tapeCellUpdate";
        this.symbol = symbol;
        this.index = index;
    }
}
exports.TapeCellUpdateEvent = TapeCellUpdateEvent;

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TapeContentUpdateEvent {
    constructor() {
        this.id = "tapeContentUpdate";
    }
}
exports.TapeContentUpdateEvent = TapeContentUpdateEvent;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TapeMoveEvent {
    constructor(headAction) {
        this.id = "tapeMove";
        this.headAction = headAction;
    }
}
exports.TapeMoveEvent = TapeMoveEvent;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TapeNewPosEvent {
    constructor(headPos) {
        this.id = "tapeNewPos";
        this.headPos = headPos;
    }
}
exports.TapeNewPosEvent = TapeNewPosEvent;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    static distance2(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }
    static norm2(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    static angleToXAxis(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }
    static transformEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        let pointerType = e.pointerType;
        if (e.pointerType === "mouse") {
            pointerType = "touch";
        }
        if (e.altKey && e.pointerType === "mouse") {
            pointerType = "pen";
        }
        if ((e.pointerType === "pen" && e.button === 5) || (e.shiftKey && e.pointerType === "mouse")) {
            pointerType = "eraser";
        }
        if ((e.pointerType === "pen" || e.pointerType === "mouse") && e.button === 2) {
            pointerType = "modify";
        }
        return { "pointerId": e.pointerId, "pointerType": pointerType, "x": e.clientX, "y": e.clientY, offsetX: e.offsetX, offsetY: e.offsetY, pageX: e.clientX, pageY: e.clientY, "originEvent": e, target: e.target };
    }
    static updateXYSVG(e, graph) {
        let pt = graph.getSVGElement().createSVGPoint(), svgP;
        pt.x = e.x;
        pt.y = e.y;
        svgP = pt.matrixTransform(graph.getSVGElement().getScreenCTM().inverse());
        e.x = svgP.x;
        e.y = svgP.y;
    }
}
exports.Helpers = Helpers;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("./Main");
new Main_1.Main();

},{"./Main":1}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transition_1 = require("./Transition");
const EventManager_1 = require("../events/EventManager");
const EditStateEvent_1 = require("../events/EditStateEvent");
const EditFinalStateEvent_1 = require("../events/EditFinalStateEvent");
const MoveStateEvent_1 = require("../events/MoveStateEvent");
class State {
    constructor(position, label, final = false) {
        this.id = State.nextStateID;
        State.nextStateID++;
        this.position = position;
        this.label = label;
        this.final = final;
        this.inTransitions = new Map();
        this.outTransitions = new Map();
        this.symbolsToOutTransitions = new Map();
    }
    getPosition() {
        return this.position;
    }
    setPosition(position) {
        this.position = position;
        EventManager_1.EventManager.emit(new MoveStateEvent_1.moveStateEvent(this, this.position));
    }
    getLabel() {
        return this.label;
    }
    setLabel(label) {
        this.label = label;
        EventManager_1.EventManager.emit(new EditStateEvent_1.EditStateEvent(this));
    }
    isFinal() {
        return this.final;
    }
    setFinal(final) {
        this.final = final;
        EventManager_1.EventManager.emit(new EditFinalStateEvent_1.EditFinalStateEvent(this, final));
    }
    addInTransition(transition) {
        if (transition.destination !== this) {
            console.error("The transition could not be added: state and destination do not match.");
            return;
        }
        this.inTransitions.set(transition.id, transition);
    }
    removeInTransition(transition) {
        let id = transition.id;
        if (!this.inTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }
        this.inTransitions.delete(transition.id);
    }
    addOutTransition(transition) {
        if (transition.origin !== this) {
            console.error("The transition could not be added: state and origin do not match.");
            return;
        }
        let inputSymbol = transition.getInputSymbol();
        if (!this.symbolsToOutTransitions.has(inputSymbol)) {
            this.symbolsToOutTransitions.set(inputSymbol, new Set());
        }
        this.symbolsToOutTransitions.get(transition.getInputSymbol()).add(transition);
        this.outTransitions.set(transition.id, transition);
    }
    removeOutTransition(transition) {
        let id = transition.id;
        if (!this.outTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }
        let inputSymbol = transition.getInputSymbol();
        let transitions = this.symbolsToOutTransitions.get(inputSymbol);
        transitions.delete(transition);
        this.outTransitions.delete(id);
        if (this.symbolsToOutTransitions.get(inputSymbol).size === 0) {
            this.symbolsToOutTransitions.delete(inputSymbol);
        }
    }
    hasOutTransitionTo(state) {
        for (let transition of this.outTransitions.values()) {
            if (transition.destination === state) {
                return true;
            }
        }
        return false;
    }
    getOutTransitionsTo(state) {
        return [...this.outTransitions.values()]
            .filter((t) => {
            return t.destination === state;
        });
    }
    hasOutTransitionForSymbol(symbol) {
        return this.symbolsToOutTransitions.has(symbol)
            || this.symbolsToOutTransitions.has(Transition_1.READ_ANY_SYMBOL);
    }
    getOutTransitionsForSymbol(symbol) {
        let transitions = this.symbolsToOutTransitions.get(symbol);
        return transitions === undefined
            ? [...this.symbolsToOutTransitions.get(Transition_1.READ_ANY_SYMBOL)]
            : [...transitions];
    }
    editOutTransitionInputSymbol(transition, oldSymbol, newSymbol) {
        if (oldSymbol === newSymbol) {
            return;
        }
        let oldSymbolTransitions = this.symbolsToOutTransitions.get(oldSymbol);
        oldSymbolTransitions.delete(transition);
        if (oldSymbolTransitions.size === 0) {
            this.symbolsToOutTransitions.delete(oldSymbol);
        }
        if (!this.symbolsToOutTransitions.has(newSymbol)) {
            this.symbolsToOutTransitions.set(newSymbol, new Set());
        }
        this.symbolsToOutTransitions.get(newSymbol).add(transition);
    }
    getInTransitions() {
        return [...this.inTransitions.values()];
    }
    getOutTransitions() {
        return [...this.outTransitions.values()];
    }
    getNonDeterministicOutTransitions() {
        let nonDeterministicTransitions = [];
        for (let transitions of this.symbolsToOutTransitions.values()) {
            if (transitions.size > 1) {
                nonDeterministicTransitions.push(...transitions.values());
            }
        }
        return nonDeterministicTransitions;
    }
    isDeterministic() {
        for (let transitions of this.symbolsToOutTransitions.values()) {
            if (transitions.size > 1) {
                return false;
            }
        }
        return true;
    }
    toString(useLabels = true) {
        return useLabels ? this.label : this.id.toString();
    }
    outTransitionsToString(useLabels = true) {
        return [...this.outTransitions.values()]
            .map((t) => t.toString(useLabels))
            .reduce((str, t) => str + "\n" + t, "");
    }
    export() {
        return {
            id: this.id,
            position: this.position,
            label: this.label,
            final: this.final
        };
    }
    static fromExport(stateExport) {
        let state = new State(stateExport.position, stateExport.label, stateExport.final);
        state.id = stateExport.id;
        State.ensureIDIsAbove(stateExport.id);
        return state;
    }
    static ensureIDIsAbove(minID) {
        if (State.nextStateID <= minID) {
            State.nextStateID = minID + 1;
        }
    }
}
exports.State = State;
State.nextStateID = 1;

},{"../events/EditFinalStateEvent":13,"../events/EditStateEvent":15,"../events/EventManager":17,"../events/MoveStateEvent":18,"./Transition":31}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const Transition_1 = require("./Transition");
const EventManager_1 = require("../events/EventManager");
const NewStateEvent_1 = require("../events/NewStateEvent");
const DeleteStateEvent_1 = require("../events/DeleteStateEvent");
const NewTransitionEvent_1 = require("../events/NewTransitionEvent");
const DeleteTransitionEvent_1 = require("../events/DeleteTransitionEvent");
const EditInitialStateEvent_1 = require("../events/EditInitialStateEvent");
const NewCurrentStateEvent_1 = require("../events/NewCurrentStateEvent");
const NO_INITIAL_STATE_ID = -1;
class StateMachine {
    constructor() {
        this.states = new Map();
        this.transitions = new Map();
        this.currentState = null;
        this.initialState = null;
    }
    addState(state) {
        if (this.states.has(state.id)) {
            console.error("The state could not be added: already added.");
            return;
        }
        this.states.set(state.id, state);
        EventManager_1.EventManager.emit(new NewStateEvent_1.NewStateEvent(state));
    }
    createAndAddState(position, label, final = false) {
        let state = new State_1.State(position, label, final);
        this.addState(state);
        return state;
    }
    hasState(id) {
        return this.states.has(id);
    }
    getState(id) {
        return this.hasState(id) ? this.states.get(id) : null;
    }
    getStates() {
        return [...this.states.values()];
    }
    removeState(id) {
        let state = this.states.get(id);
        state.getInTransitions().forEach((t) => { this.removeTransition(t.id); });
        state.getOutTransitions().forEach((t) => { this.removeTransition(t.id); });
        this.states.delete(id);
        EventManager_1.EventManager.emit(new DeleteStateEvent_1.DeleteStateEvent(state));
    }
    removeAllStates() {
        for (let id of this.states.keys()) {
            this.removeState(id);
        }
    }
    getInitialState() {
        return this.initialState;
    }
    getCurrentState() {
        return this.currentState;
    }
    setInitialState(id) {
        if (!this.hasState(id)) {
            console.error("The state could not be set as initial: unknown state.");
            return;
        }
        this.resetInitialState();
        this.initialState = this.states.get(id);
        EventManager_1.EventManager.emit(new EditInitialStateEvent_1.EditInitialStateEvent(this.initialState, true));
    }
    resetInitialState() {
        if (this.initialState === null) {
            return;
        }
        let currentInitialState = this.initialState;
        this.initialState = null;
        EventManager_1.EventManager.emit(new EditInitialStateEvent_1.EditInitialStateEvent(currentInitialState, false));
    }
    setCurrentState(id) {
        if (!this.hasState(id)) {
            console.error("The state could not be set as current: unknown state.");
            return;
        }
        this.currentState = this.states.get(id);
        EventManager_1.EventManager.emit(new NewCurrentStateEvent_1.NewCurrentStateEvent(this.currentState));
    }
    resetCurrentState() {
        this.currentState = null;
        EventManager_1.EventManager.emit(new NewCurrentStateEvent_1.NewCurrentStateEvent(this.currentState));
    }
    addTransition(transition) {
        let origin = transition.origin;
        let destination = transition.destination;
        if (!(this.hasState(origin.id) && this.hasState(destination.id))) {
            console.error("The transition could not be added: unknown origin or destination state.");
            return;
        }
        if (this.transitions.has(transition.id)) {
            console.error("The transition could not be added: already added.");
            return;
        }
        destination.addInTransition(transition);
        origin.addOutTransition(transition);
        this.transitions.set(transition.id, transition);
        EventManager_1.EventManager.emit(new NewTransitionEvent_1.NewTransitionEvent(transition));
    }
    hasTransition(id) {
        return this.transitions.has(id);
    }
    hasTransitionBetween(state1, state2) {
        return state1.hasOutTransitionTo(state2)
            || state2.hasOutTransitionTo(state1);
    }
    getTransition(id) {
        return this.transitions.has(id) ? this.transitions.get(id) : null;
    }
    getTransitions() {
        return [...this.transitions.values()];
    }
    removeTransition(id) {
        if (!this.transitions.has(id)) {
            console.error("The transition could not be removed: unknown transition.");
            return;
        }
        let transition = this.transitions.get(id);
        this.transitions.delete(id);
        transition.destination.removeInTransition(transition);
        transition.origin.removeOutTransition(transition);
        EventManager_1.EventManager.emit(new DeleteTransitionEvent_1.DeleteTransitionEvent(transition));
    }
    removeAllTransitions() {
        for (let id of this.transitions.keys()) {
            this.removeTransition(id);
        }
    }
    getNonDeterministicTransitions() {
        let nonDeterministicTransitions = [];
        for (let state of this.states.values()) {
            nonDeterministicTransitions.push(...state.getNonDeterministicOutTransitions());
        }
        return nonDeterministicTransitions;
    }
    isDeterministic() {
        for (let state of this.states.values()) {
            if (!state.isDeterministic()) {
                return false;
            }
        }
        return true;
    }
    getStatesAsString(useLabels = true) {
        return [...this.states.values()]
            .map((s) => s.toString(useLabels))
            .reduce((str, s) => str + "\n" + s, "");
    }
    getTransitionsAsString(useLabels = true) {
        return [...this.states.values()]
            .map((s) => s.outTransitionsToString(useLabels))
            .reduce((str, t) => str + "\n\n" + t, "");
    }
    toString(useLabels = true) {
        let str = "";
        for (let state of this.states.values()) {
            str += state.toString(useLabels);
            if (this.currentState === state) {
                str += " (current)";
            }
            if (this.initialState === state) {
                str += " (init)";
            }
            str += state.outTransitionsToString(useLabels);
            str += "\n\n";
        }
        return str;
    }
    export() {
        let exportedStates = [...this.states.values()].map((s) => s.export());
        let exportedTransitions = [...this.transitions.values()].map((t) => t.export());
        let initialStateID = this.initialState === null ? NO_INITIAL_STATE_ID : this.initialState.id;
        return {
            states: exportedStates,
            transitions: exportedTransitions,
            initialStateID: initialStateID
        };
    }
    static fromExport(stateMachineExport) {
        let stateMachine = new StateMachine();
        for (let stateExport of stateMachineExport.states) {
            let state = State_1.State.fromExport(stateExport);
            stateMachine.addState(state);
        }
        for (let transitionExport of stateMachineExport.transitions) {
            let transition = Transition_1.Transition.fromExport(transitionExport, stateMachine.states);
            stateMachine.addTransition(transition);
        }
        if (stateMachineExport.initialStateID !== NO_INITIAL_STATE_ID) {
            stateMachine.setInitialState(stateMachineExport.initialStateID);
        }
        return stateMachine;
    }
}
exports.StateMachine = StateMachine;

},{"../events/DeleteStateEvent":11,"../events/DeleteTransitionEvent":12,"../events/EditInitialStateEvent":14,"../events/EventManager":17,"../events/NewCurrentStateEvent":19,"../events/NewStateEvent":20,"../events/NewTransitionEvent":21,"./State":28,"./Transition":31}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../events/EventManager");
const TapeCellUpdateEvent_1 = require("../events/TapeCellUpdateEvent");
const TapeMoveEvent_1 = require("../events/TapeMoveEvent");
const TapeNewPosEvent_1 = require("../events/TapeNewPosEvent");
const TapeContentUpdateEvent_1 = require("../events/TapeContentUpdateEvent");
var HeadAction;
(function (HeadAction) {
    HeadAction[HeadAction["MoveLeft"] = 0] = "MoveLeft";
    HeadAction[HeadAction["MoveRight"] = 1] = "MoveRight";
    HeadAction[HeadAction["None"] = 2] = "None";
})(HeadAction = exports.HeadAction || (exports.HeadAction = {}));
class Tape {
    constructor(content = []) {
        this.content = content;
        this.resetHeadPosition();
    }
    getHeadPosition() {
        return this.headPosition;
    }
    getSymbolAt(index) {
        return this.content[index];
    }
    setSymbolAt(index, symbol) {
        this.content[index] = symbol;
        this.fillEmptyCellsBefore(index);
        EventManager_1.EventManager.emit(new TapeCellUpdateEvent_1.TapeCellUpdateEvent(symbol, index));
    }
    getCurrentSymbol() {
        return this.getSymbolAt(this.headPosition);
    }
    setCurrentSymbol(symbol) {
        this.setSymbolAt(this.headPosition, symbol);
        EventManager_1.EventManager.emit(new TapeCellUpdateEvent_1.TapeCellUpdateEvent(symbol, this.getHeadPosition()));
    }
    setContent(content) {
        this.content = content;
        EventManager_1.EventManager.emit(new TapeContentUpdateEvent_1.TapeContentUpdateEvent());
    }
    setContentFromString(content) {
        this.setContent(Array.from(content));
    }
    getContent() {
        return this.content;
    }
    getContentAsString() {
        return this.content.join("");
    }
    clearContent() {
        this.content = [];
    }
    fillEmptyCellsBefore(index = this.content.length) {
        for (let i = 0; i < index; i++) {
            if (this.content[i] === undefined) {
                this.content[i] = Tape.EMPTY_CELL_FILLING_CHAR;
            }
        }
    }
    applyHeadAction(action) {
        switch (action) {
            case HeadAction.MoveLeft:
                this.headPosition = Math.max(0, this.headPosition - 1);
                break;
            case HeadAction.MoveRight:
                this.headPosition++;
                break;
            case HeadAction.None:
            default:
                break;
        }
        EventManager_1.EventManager.emit(new TapeMoveEvent_1.TapeMoveEvent(action));
    }
    resetHeadPosition() {
        this.headPosition = 0;
        EventManager_1.EventManager.emit(new TapeNewPosEvent_1.TapeNewPosEvent(0));
    }
    toString() {
        return "[head at " + this.headPosition + " ]\n"
            + this.content.toString();
    }
    export() {
        return {
            content: this.content
        };
    }
    static fromExport(tapeExport) {
        return new Tape(tapeExport.content);
    }
}
exports.Tape = Tape;
Tape.EMPTY_CELL_FILLING_CHAR = " ";

},{"../events/EventManager":17,"../events/TapeCellUpdateEvent":22,"../events/TapeContentUpdateEvent":23,"../events/TapeMoveEvent":24,"../events/TapeNewPosEvent":25}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tape_1 = require("./Tape");
const EventManager_1 = require("../events/EventManager");
const EditTransitionEvent_1 = require("../events/EditTransitionEvent");
exports.READ_ANY_SYMBOL = "";
exports.WRITE_NO_SYMBOL = "";
class Transition {
    constructor(origin, destination, inputSymbol, outputSymbol, headAction) {
        this.id = Transition.nextTransitionID;
        Transition.nextTransitionID++;
        this.origin = origin;
        this.destination = destination;
        this.inputSymbol = inputSymbol;
        this.outputSymbol = outputSymbol;
        this.headAction = headAction;
    }
    getInputSymbol() {
        return this.inputSymbol;
    }
    setInputSymbol(symbol) {
        let oldSymbol = this.inputSymbol;
        this.inputSymbol = symbol;
        this.origin.editOutTransitionInputSymbol(this, oldSymbol, symbol);
        EventManager_1.EventManager.emit(new EditTransitionEvent_1.EditTransitionEvent(this));
    }
    getOutputSymbol() {
        return this.outputSymbol;
    }
    setOutputSymbol(symbol) {
        this.outputSymbol = symbol;
        EventManager_1.EventManager.emit(new EditTransitionEvent_1.EditTransitionEvent(this));
    }
    getHeadAction() {
        return this.headAction;
    }
    setHeadAction(action) {
        this.headAction = action;
        EventManager_1.EventManager.emit(new EditTransitionEvent_1.EditTransitionEvent(this));
    }
    toString(useLabels = true) {
        let actionAsString = "";
        switch (this.headAction) {
            case Tape_1.HeadAction.MoveLeft:
                actionAsString = "◀";
                break;
            case Tape_1.HeadAction.MoveRight:
                actionAsString = "▶";
                break;
            case Tape_1.HeadAction.None:
                actionAsString = "▽";
                break;
            default:
                actionAsString = "<unknown action>";
                break;
        }
        return this.origin.toString(useLabels)
            + " → "
            + this.destination.toString(useLabels)
            + " ("
            + (this.inputSymbol === exports.READ_ANY_SYMBOL ? "<any>" : this.inputSymbol)
            + " / "
            + (this.outputSymbol === exports.WRITE_NO_SYMBOL ? "<none>" : this.outputSymbol)
            + ", "
            + actionAsString
            + ")";
    }
    export() {
        return {
            id: this.id,
            originID: this.origin.id,
            destinationID: this.destination.id,
            inputSymbol: this.inputSymbol,
            outputSymbol: this.outputSymbol,
            headAction: this.headAction
        };
    }
    static fromExport(transitionExport, states) {
        let origin = states.get(transitionExport.originID);
        let destination = states.get(transitionExport.destinationID);
        if (origin === undefined || destination === undefined) {
            console.error("The transition could not be created from an export: unknown state.");
        }
        let transition = new Transition(origin, destination, transitionExport.inputSymbol, transitionExport.outputSymbol, transitionExport.headAction);
        transition.id = transitionExport.id;
        Transition.ensureIDIsAbove(transitionExport.id);
        return transition;
    }
    static ensureIDIsAbove(minID) {
        if (Transition.nextTransitionID <= minID) {
            Transition.nextTransitionID = minID + 1;
        }
    }
}
exports.Transition = Transition;
Transition.nextTransitionID = 1;

},{"../events/EditTransitionEvent":16,"../events/EventManager":17,"./Tape":30}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tape_1 = require("./Tape");
const StateMachine_1 = require("./StateMachine");
const NoInitialStateError_1 = require("../errors/NoInitialStateError");
const NoTransitionAvailableError_1 = require("../errors/NoTransitionAvailableError");
const NonDeterministicError_1 = require("../errors/NonDeterministicError");
const Transition_1 = require("./Transition");
var TuringMachineState;
(function (TuringMachineState) {
    TuringMachineState["READY"] = "Ready";
    TuringMachineState["RUNNING"] = "Running";
    TuringMachineState["STOPPED"] = "Stopped";
    TuringMachineState["FAULTY"] = "Faulty";
})(TuringMachineState = exports.TuringMachineState || (exports.TuringMachineState = {}));
class TuringMachine {
    constructor() {
        console.log("A Turing machine was created.");
        this.stateMachine = new StateMachine_1.StateMachine();
        this.tape = new Tape_1.Tape();
        this.currentStep = 0;
        this.state = TuringMachineState.READY;
    }
    getCurrentStep() {
        return this.currentStep;
    }
    getState() {
        return this.state;
    }
    isRunnable() {
        return this.state === TuringMachineState.READY
            || this.state === TuringMachineState.RUNNING;
    }
    runOneStep() {
        let currentState = this.stateMachine.getCurrentState();
        if (currentState === null) {
            let initialState = this.stateMachine.getInitialState();
            if (initialState === null) {
                this.state = TuringMachineState.FAULTY;
                console.error("The machine could not be ran: no initial state.");
                throw new NoInitialStateError_1.NoInitialStateError(this);
            }
            currentState = initialState;
        }
        if (this.state === TuringMachineState.STOPPED) {
            return;
        }
        if (currentState.isFinal()) {
            this.state = TuringMachineState.STOPPED;
            return;
        }
        this.state = TuringMachineState.RUNNING;
        let currentSymbol = this.tape.getCurrentSymbol();
        if (!currentState.hasOutTransitionForSymbol(currentSymbol)) {
            this.state = TuringMachineState.FAULTY;
            console.error("The machine could not be ran: no transition available.");
            throw new NoTransitionAvailableError_1.NoTransitionAvailableError(this, currentState);
        }
        let transitions = currentState.getOutTransitionsForSymbol(currentSymbol);
        if (transitions.length > 1) {
            this.state = TuringMachineState.FAULTY;
            console.error("The machine could not be ran: nondeterministic state-machine.");
            throw new NonDeterministicError_1.NonDeterministicError(this, currentState, transitions);
        }
        let transition = [...transitions.values()][0];
        let nextState = transition.destination;
        let outputSymbol = transition.getOutputSymbol();
        if (outputSymbol !== Transition_1.WRITE_NO_SYMBOL) {
            this.tape.setCurrentSymbol(outputSymbol);
        }
        this.tape.applyHeadAction(transition.getHeadAction());
        this.stateMachine.setCurrentState(nextState.id);
        this.currentStep++;
        this.state = nextState.isFinal() ? TuringMachineState.STOPPED : TuringMachineState.READY;
    }
    run(maxNbSteps = 1000) {
        let nbSteps = 0;
        while (this.isRunnable() && nbSteps < maxNbSteps) {
            this.runOneStep();
            nbSteps++;
        }
    }
    reset() {
        this.tape.resetHeadPosition();
        this.stateMachine.resetCurrentState();
        this.currentStep = 0;
        this.state = TuringMachineState.READY;
    }
    empty() {
        this.stateMachine.removeAllStates();
        this.stateMachine.removeAllTransitions();
        this.tape.clearContent();
        this.reset();
    }
    toString(useLabels = true) {
        let str = "";
        str += "=== STATE MACHINE ===\n";
        str += this.stateMachine.toString(useLabels);
        str += "=== MEMORY TAPE ===\n";
        str += this.tape.toString();
        return str;
    }
    export() {
        let exportedStateMachine = this.stateMachine.export();
        let exportedTape = this.tape.export();
        return {
            stateMachine: exportedStateMachine,
            tape: exportedTape
        };
    }
    exportToJSON() {
        return JSON.stringify(this.export());
    }
    static fromExport(turingMachineExport) {
        let turingMachine = new TuringMachine();
        turingMachine.stateMachine = StateMachine_1.StateMachine.fromExport(turingMachineExport.stateMachine);
        turingMachine.tape = Tape_1.Tape.fromExport(turingMachineExport.tape);
        return turingMachine;
    }
    static fromJSONExport(json) {
        return TuringMachine.fromExport(JSON.parse(json));
    }
}
exports.TuringMachine = TuringMachine;

},{"../errors/NoInitialStateError":6,"../errors/NoTransitionAvailableError":7,"../errors/NonDeterministicError":8,"./StateMachine":29,"./Tape":30,"./Transition":31}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const ErrorPopup_1 = require("./popups/ErrorPopup");
const EasterEggManager_1 = require("../easter-eggs/EasterEggManager");
class ControlPanel {
    constructor(turingMachine, roll) {
        this.turingMachine = turingMachine;
        this.roll = roll;
        this.easterEggManager = new EasterEggManager_1.EasterEggManager();
        this.init();
    }
    init() {
        this.addControlButtons();
        this.addScreen();
    }
    addControlButtons() {
        let tm = this.turingMachine;
        let roll = this.roll;
        d3.select("#control-panel").selectAll("*").remove();
        this.holder = d3.select("#control-panel");
        this.holder.append("button")
            .attr("id", "run-turing-machine-button")
            .attr("title", "Simulate the machine")
            .on("click", () => {
            roll.moveToCell(tm.tape.getHeadPosition());
            try {
                tm.reset();
                tm.run();
                this.updateScreen();
                this.easterEggManager.launch(tm.tape);
            }
            catch (error) {
                this.catchError(error);
            }
        })
            .text("Run");
        this.holder.append("button")
            .attr("id", "step-turing-machine-button")
            .attr("title", "Simulate one computation step")
            .on("click", () => {
            roll.moveToCell(tm.tape.getHeadPosition());
            try {
                tm.runOneStep();
                this.updateScreen();
                this.easterEggManager.launch(tm.tape);
            }
            catch (error) {
                this.catchError(error);
            }
        })
            .text("Step");
        this.holder.append("button")
            .attr("id", "reset-turing-machine-button")
            .attr("title", "Reset the machine and rewind the tape")
            .on("click", () => {
            tm.reset();
            this.updateScreen();
        })
            .text("Reset");
    }
    addScreen() {
        let screen = this.holder.append("div")
            .attr("id", "control-panel-screen");
        screen.append("p")
            .classed("first-line", true);
        screen.append("p")
            .classed("second-line", true);
        this.updateScreen();
    }
    updateScreen(error) {
        let screen = this.holder.select("#control-panel-screen");
        screen.classed("error", error !== undefined);
        screen.select(".first-line")
            .text(`${this.turingMachine.getState()} (step: ${this.turingMachine.getCurrentStep()})`);
        screen.select(".second-line")
            .text(error !== undefined ? error.getShortName() : "");
    }
    catchError(error) {
        this.updateScreen(error);
        new ErrorPopup_1.ErrorPopup(error);
    }
}
exports.ControlPanel = ControlPanel;

},{"../easter-eggs/EasterEggManager":2,"./popups/ErrorPopup":63,"d3-selection":72}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const EventManager_1 = require("../events/EventManager");
const GeneratorNode_1 = require("./nodes/GeneratorNode");
const TransitionEdge_1 = require("./edges/TransitionEdge");
const State_1 = require("../model/State");
const StateNode_1 = require("./nodes/StateNode");
const GeneratorEdge_1 = require("./edges/GeneratorEdge");
class Graph {
    constructor(turingMachine) {
        this.turingMachine = turingMachine;
        this.transitionIdToTransitionEdge = new Map();
        this.stateIdToStateNode = new Map();
        this.eventsHandlers = {};
        this.setupUI();
        this.setupListeners();
        this.setResetViewBoxButton();
        this.init();
    }
    init() {
        let stateMachine = this.turingMachine.stateMachine;
        stateMachine.getStates().forEach((state) => {
            this.addNode(state);
            if (state.isFinal()) {
                this.editFinalNode(state, true);
            }
        });
        stateMachine.getTransitions().forEach((transition) => {
            this.addEdge(transition);
        });
        let initialState = stateMachine.getInitialState();
        if (initialState instanceof State_1.State) {
            this.editInitialNode(initialState, true);
        }
        let currentNode = stateMachine.getCurrentState();
        if (currentNode instanceof State_1.State) {
            this.newCurrentNode(currentNode);
        }
    }
    setupUI() {
        d3.select("#graph").selectAll("*:not(#toolbar)").remove();
        this.svg = d3.select("#graph").append("svg");
        let bbox = this.svg.node().getBoundingClientRect();
        this.viewBox = { x: 0, y: 0, width: bbox.width, height: bbox.height };
        this.updateViewBox();
        this.svg.append("g").attr("id", "edges");
        this.svg.append("g").attr("id", "nodes");
        this.generator = new GeneratorNode_1.GeneratorNode(this);
    }
    getSVGElement() {
        return this.svg.node();
    }
    getSVG() {
        return this.svg;
    }
    getNodesGroup() {
        return this.svg.select("#nodes");
    }
    getEdgesGroup() {
        return this.svg.select("#edges");
    }
    setResetViewBoxButton() {
        d3.select("#graph").append("button").attr("id", "reset-viewbox-graph-button").on("click", () => {
            this.viewBox.x = 0;
            this.viewBox.y = 0;
            this.updateViewBox();
        });
    }
    updateViewBox() {
        this.svg.attr("viewBox", `${this.viewBox.x},${this.viewBox.y}, ${this.viewBox.width}, ${this.viewBox.height}`);
    }
    translateViewBoxBy(dx, dy) {
        this.viewBox.x -= dx;
        this.viewBox.y -= dy;
        this.updateViewBox();
    }
    scaleViewBoxTo(width, height) {
        this.viewBox.width = width;
        this.viewBox.height = height;
        this.updateViewBox();
    }
    addNode(state) {
        this.stateIdToStateNode.set(state.id, new StateNode_1.StateNode(this, state));
    }
    editInitialNode(state, isInitial) {
        let node = this.stateIdToStateNode.get(state.id);
        node.setInitialNode(isInitial);
        console.log(node, isInitial);
        if (isInitial) {
            this.generatorEdge = new GeneratorEdge_1.GeneratorEdge(this, this.generator, node);
        }
        else {
            if (this.generatorEdge !== undefined) {
                this.generatorEdge.delete();
            }
        }
        if (this.turingMachine.stateMachine.getInitialState() === null) {
            this.generator.invalidate();
        }
        else {
            this.generator.validate();
        }
    }
    newCurrentNode(state) {
        if (state === null) {
            StateNode_1.StateNode.resetCurrentNode();
        }
        else {
            this.stateIdToStateNode.get(state.id).setCurrentNode();
        }
    }
    editFinalNode(state, isFinal) {
        this.stateIdToStateNode.get(state.id).setFinalNode(isFinal);
    }
    editNode(state) {
        this.stateIdToStateNode.get(state.id).setLabel(state.getLabel());
    }
    deleteNode(state) {
        let node = this.stateIdToStateNode.get(state.id);
        if (node.isInitialNode()) {
            this.generatorEdge.delete();
        }
        node.delete();
    }
    moveNode(state, x, y) {
        let node = this.stateIdToStateNode.get(state.id);
        node.translateTo(x, y);
    }
    setEdgeCurved(transition) {
        if (transition.origin === transition.destination) {
            return;
        }
        let sm = this.turingMachine.stateMachine;
        let isCurved = transition.origin.hasOutTransitionTo(transition.destination)
            && transition.destination.hasOutTransitionTo(transition.origin);
        this.transitionIdToTransitionEdge.get(transition.id).setCurved(isCurved);
        this.transitionIdToTransitionEdge.get(transition.id).redrawTransitionEdge();
        let oppositeTransitions = transition.destination.getOutTransitionsTo(transition.origin);
        if (oppositeTransitions.length > 0) {
            let transitionEdge = this.transitionIdToTransitionEdge.get(oppositeTransitions[0].id);
            transitionEdge.setCurved(isCurved);
            transitionEdge.redrawTransitionEdge();
        }
    }
    addEdge(transition) {
        let stateMachine = this.turingMachine.stateMachine;
        let transitionEdge;
        let transitions = transition.origin.getOutTransitionsTo(transition.destination);
        if (transitions.length > 1) {
            if (transitions[0].id !== transition.id) {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[0].id);
            }
            else {
                transitionEdge = this.transitionIdToTransitionEdge.get(transitions[1].id);
            }
            if (transitionEdge !== undefined && transitionEdge !== null) {
                transitionEdge.addTransitionToEdge(transition);
            }
            else {
                transitionEdge = new TransitionEdge_1.TransitionEdge(this, transition, false);
            }
        }
        else {
            transitionEdge = new TransitionEdge_1.TransitionEdge(this, transition, false);
        }
        this.transitionIdToTransitionEdge.set(transition.id, transitionEdge);
        this.setEdgeCurved(transition);
        this.stateIdToStateNode.get(transition.origin.id).updateValidateProperty();
    }
    deleteEdge(transition) {
        let transitionEdge = this.transitionIdToTransitionEdge.get(transition.id);
        this.setEdgeCurved(transition);
        this.stateIdToStateNode.get(transition.origin.id).updateValidateProperty();
        transitionEdge.deleteTransitionEdge(transition.id);
        this.transitionIdToTransitionEdge.delete(transition.id);
    }
    editEdge(transition) {
        this.transitionIdToTransitionEdge.get(transition.id)
            .drawTransitionText(transition.getInputSymbol(), transition.getOutputSymbol(), transition.getHeadAction());
        this.stateIdToStateNode.get(transition.origin.id).updateValidateProperty();
    }
    setupListeners() {
        this.eventsHandlers["newState"] = ((e) => {
            this.addNode(e.state);
        });
        EventManager_1.EventManager.registerHandler("newState", this.eventsHandlers["newState"]);
        this.eventsHandlers["editInitialState"] = ((e) => {
            this.editInitialNode(e.state, e.isFirstInitialState);
        });
        EventManager_1.EventManager.registerHandler("editInitialState", this.eventsHandlers["editInitialState"]);
        this.eventsHandlers["newCurrentState"] = (e) => {
            this.newCurrentNode(e.state);
        };
        EventManager_1.EventManager.registerHandler("newCurrentState", this.eventsHandlers["newCurrentState"]);
        this.eventsHandlers["editFinalState"] = ((e) => {
            this.editFinalNode(e.state, e.isFinal);
        });
        EventManager_1.EventManager.registerHandler("editFinalState", this.eventsHandlers["editFinalState"]);
        this.eventsHandlers["editState"] = ((e) => {
            this.editNode(e.state);
        });
        EventManager_1.EventManager.registerHandler("editState", this.eventsHandlers["editState"]);
        this.eventsHandlers["deleteState"] = ((e) => {
            this.deleteNode(e.state);
        });
        EventManager_1.EventManager.registerHandler("deleteState", this.eventsHandlers["deleteState"]);
        this.eventsHandlers["moveState"] = ((e) => {
            this.moveNode(e.state, e.position.x, e.position.y);
        });
        EventManager_1.EventManager.registerHandler("moveState", this.eventsHandlers["moveState"]);
        this.eventsHandlers["newTransition"] = ((e) => {
            this.addEdge(e.transition);
        });
        EventManager_1.EventManager.registerHandler("newTransition", this.eventsHandlers["newTransition"]);
        this.eventsHandlers["deleteTransition"] = ((e) => {
            this.deleteEdge(e.transition);
        });
        EventManager_1.EventManager.registerHandler("deleteTransition", this.eventsHandlers["deleteTransition"]);
        this.eventsHandlers["editTransition"] = ((e) => {
            this.editEdge(e.transition);
        });
        EventManager_1.EventManager.registerHandler("editTransition", this.eventsHandlers["editTransition"]);
    }
    resize() {
        let svgBoundingBox = this.svg.node().getBoundingClientRect();
        this.scaleViewBoxTo(svgBoundingBox.width, svgBoundingBox.height);
    }
    removeHandler() {
        for (let eventId of Object.keys(this.eventsHandlers)) {
            EventManager_1.EventManager.unregisterHandler(eventId, this.eventsHandlers[eventId]);
        }
    }
}
exports.Graph = Graph;
Graph.sizeNode = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--node-size'));

},{"../events/EventManager":17,"../model/State":28,"./edges/GeneratorEdge":48,"./edges/TransitionEdge":49,"./nodes/GeneratorNode":59,"./nodes/StateNode":61,"d3-selection":72}],35:[function(require,module,exports){
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

},{"../events/EventManager":17,"./ControlPanel":33,"./Graph":34,"./InfiniteRoll":36,"./MenuBar":37,"./graph-interaction/pen-and-touch/PenAndTouchDispatcher":53,"./graph-interaction/tools/MouseDispatcher":56}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Tape_1 = require("../model/Tape");
const EventManager_1 = require("../events/EventManager");
const TapeContentEditorPopup_1 = require("./popups/TapeContentEditorPopup");
class InfiniteRoll {
    constructor(turingMachine) {
        this.tapeHolder = d3.select("#tape-container");
        this.origin = 0;
        this.turingMachine = turingMachine;
        this.init();
    }
    init() {
        this.setupUI();
        this.createEventListeners();
        this.addEventListeners();
        this.displayedCellsIndices = {
            minIndex: 0,
            maxIndex: InfiniteRoll.minLength - 1
        };
        for (let i = 0; i < InfiniteRoll.minLength; i++) {
            this.addCell(i);
        }
        this.updateCurrentCell();
    }
    setupUI() {
        d3.select("#tape-container").selectAll("*").remove();
        this.head = this.tapeHolder.append("div").attr("id", "head");
        this.tape = this.tapeHolder.append("div").attr("id", "tape");
        this.addActionButtons();
        let widthHolder = document.getElementById("tape-container").getBoundingClientRect().width;
        this.origin = widthHolder / 2 - InfiniteRoll.marginCell - InfiniteRoll.sizeCell / 2;
        this.tape.style("left", (this.origin).toString() + "px");
        this.stepMovement = InfiniteRoll.sizeCell + 2 * InfiniteRoll.marginCell;
    }
    addActionButtons() {
        let container = this.tapeHolder.append("div")
            .classed("action-button-container", true);
        container.append("button")
            .attr("id", "reset-head-button")
            .attr("title", "Scroll the tape to the current cell")
            .on("click", () => {
            this.moveToCell(this.turingMachine.tape.getHeadPosition());
        });
        container.append("button")
            .attr("id", "set-tape-content-button")
            .attr("title", "Edit the content of the tape as text")
            .on("click", () => {
            new TapeContentEditorPopup_1.TapeContentEditorPopup(this.turingMachine.tape);
        });
    }
    addCell(index) {
        let cell, value;
        let tapeContent = this.turingMachine.tape.getContent();
        value = (index < tapeContent.length) ? tapeContent[index] : "";
        cell = this.tape.append("div")
            .attr("id", `cell-${index}`)
            .classed("cell", true);
        cell.append("label")
            .attr("for", `cell-${index}-input`)
            .text(index + 1);
        cell.append("input")
            .attr("type", "text")
            .attr("id", `cell-${index}-input`)
            .attr("maxlength", "1")
            .attr("value", value)
            .on("change", () => {
            this.turingMachine.tape.setSymbolAt(index, cell.select("input").node().value);
        });
        return cell;
    }
    addCellAtTheBeginning() {
        this.displayedCellsIndices.minIndex -= 1;
        this.addCell(this.displayedCellsIndices.minIndex).lower();
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }
    addCellAtTheEnd() {
        this.displayedCellsIndices.maxIndex += 1;
        this.addCell(this.displayedCellsIndices.maxIndex);
    }
    removeCell(index) {
        if (!d3.select(`#cell-${index}`).empty()) {
            d3.select(`#cell-${index}`).remove();
        }
    }
    removeCellAtTheBeginning() {
        this.removeCell(this.displayedCellsIndices.minIndex);
        this.displayedCellsIndices.minIndex += 1;
        this.tape.style("padding-left", (this.displayedCellsIndices.minIndex * this.stepMovement).toString() + "px");
    }
    removeCellAtTheEnd() {
        this.removeCell(this.displayedCellsIndices.maxIndex);
        this.displayedCellsIndices.maxIndex -= 1;
    }
    updateDisplayedCell(l) {
        let displayedCellIndex = Math.floor(Math.abs(l - this.origin) / this.stepMovement - 0.5) + 1;
        while (this.displayedCellsIndices.minIndex < Math.max(0, displayedCellIndex - InfiniteRoll.minLength)) {
            this.removeCellAtTheBeginning();
        }
        while (this.displayedCellsIndices.minIndex > Math.max(0, displayedCellIndex - InfiniteRoll.minLength)) {
            this.addCellAtTheBeginning();
        }
        while (this.displayedCellsIndices.maxIndex > displayedCellIndex + InfiniteRoll.minLength) {
            this.removeCellAtTheEnd();
        }
        while (this.displayedCellsIndices.maxIndex < displayedCellIndex + InfiniteRoll.minLength) {
            this.addCellAtTheEnd();
        }
        this.updateCurrentCell();
    }
    moveTapeBy(n) {
        let left = parseInt(this.tape.style("left"));
        let newLeft = Math.min(left - n, this.origin);
        this.tape
            .style("left", (newLeft).toString() + "px");
        this.updateDisplayedCell(newLeft);
    }
    moveTapeByNCell(n) {
        this.moveTapeBy(n * this.stepMovement);
    }
    moveToCell(index) {
        this.tape
            .style("left", (this.origin).toString() + "px");
        this.moveTapeByNCell(index);
    }
    move(action) {
        switch (action) {
            case Tape_1.HeadAction.MoveLeft:
                this.moveTapeByNCell(-1);
                break;
            case Tape_1.HeadAction.MoveRight:
                this.moveTapeByNCell(1);
                break;
            case Tape_1.HeadAction.None:
            default:
                break;
        }
        this.updateCurrentCell();
    }
    updateCell(symbol, index) {
        let cell = this.tape.select("#cell-" + index);
        let inputElement = cell.select("input").node();
        inputElement.value = symbol;
    }
    updateCurrentCell() {
        let currentCellIndex = this.turingMachine.tape.getHeadPosition();
        this.tape.select(".current-cell").classed("current-cell", false);
        this.tape.select("#cell-" + currentCellIndex)
            .classed("current-cell", true);
    }
    updateContent() {
        let tapeContent = this.turingMachine.tape.getContent();
        for (let i = this.displayedCellsIndices.minIndex; i <= this.displayedCellsIndices.maxIndex; i++) {
            let symbol = i < tapeContent.length ? tapeContent[i] : "";
            this.updateCell(symbol, i);
        }
    }
    createEventListeners() {
        let isDown = false;
        let previousX = 0;
        this.DOMEventHandlers = {
            "pointerdown": (e) => {
                isDown = true;
                previousX = e.clientX;
            },
            "pointermove": (e) => {
                if (isDown) {
                    this.moveTapeBy(-(e.clientX - previousX));
                    previousX = e.clientX;
                }
            },
            "pointerup": (e) => {
                isDown = false;
            },
            "wheel": (e) => {
                this.moveTapeBy(e.deltaY * 4);
            }
        };
        this.internalEventsHandlers = {
            "tapeCellUpdate": () => {
                this.updateContent();
            },
            "tapeContentUpdate": () => {
                this.updateContent();
            },
            "tapeMove": (e) => {
                this.move(e.headAction);
            },
            "tapeNewPos": (e) => {
                this.moveToCell(e.headPos);
            }
        };
    }
    addEventListeners() {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager_1.EventManager.registerHandler(id, this.internalEventsHandlers[id]);
        }
        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().addEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }
    removeEventListeners() {
        for (let id of Object.keys(this.internalEventsHandlers)) {
            EventManager_1.EventManager.unregisterHandler(id, this.internalEventsHandlers[id]);
        }
        for (let eventName of Object.keys(this.DOMEventHandlers)) {
            this.tapeHolder.node().removeEventListener(eventName, this.DOMEventHandlers[eventName]);
        }
    }
    resize() {
        let widthHolder = document.getElementById("tape-container").getBoundingClientRect().width;
        let previousOrigin = this.origin;
        this.origin = widthHolder / 2 - InfiniteRoll.marginCell - InfiniteRoll.sizeCell / 2;
        this.moveTapeBy(previousOrigin - this.origin);
    }
}
exports.InfiniteRoll = InfiniteRoll;
InfiniteRoll.minLength = 10;
InfiniteRoll.marginCell = 2;
InfiniteRoll.sizeCell = 90;

},{"../events/EventManager":17,"../model/Tape":30,"./popups/TapeContentEditorPopup":70,"d3-selection":72}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const ExportPopup_1 = require("./popups/ExportPopup");
const EventManager_1 = require("../events/EventManager");
const ChangeInteractionStyleEvent_1 = require("../events/ChangeInteractionStyleEvent");
const ImportPopup_1 = require("./popups/ImportPopup");
const LoadExamplePopup_1 = require("./popups/LoadExamplePopup");
var InteractionStyles;
(function (InteractionStyles) {
    InteractionStyles[InteractionStyles["MOUSE"] = 0] = "MOUSE";
    InteractionStyles[InteractionStyles["PEN_AND_TOUCH"] = 1] = "PEN_AND_TOUCH";
})(InteractionStyles = exports.InteractionStyles || (exports.InteractionStyles = {}));
class MenuBar {
    constructor(main) {
        this.main = main;
        this.interactionStyle = InteractionStyles.MOUSE;
        this.setupMenu();
    }
    setupMenu() {
        let t = this;
        let menuBar = d3.select("#menu");
        menuBar.append("h1")
            .attr("id", "app-title")
            .text("The Interactive Turing Machine");
        function getInteractionStyleSwitchText() {
            return t.interactionStyle !== InteractionStyles.MOUSE
                ? "Use the mouse"
                : "Use Pen & Touch";
        }
        let interactionStyleSwitch = menuBar.append("button")
            .attr("id", "switch-interaction-style-button")
            .text(getInteractionStyleSwitchText())
            .on("click", () => {
            this.switchInteractionStyle();
            interactionStyleSwitch.text(getInteractionStyleSwitchText());
        });
        menuBar.append("a")
            .attr("id", "help-button")
            .attr("href", "./help.html")
            .attr("target", "_blank")
            .text("Help");
        menuBar.append("button")
            .attr("id", "import-model-button")
            .text("Import")
            .on("click", () => {
            new ImportPopup_1.ImportPopup(this.main);
        });
        menuBar.append("button")
            .attr("id", "export-model-button")
            .text("Export")
            .on("click", () => {
            new ExportPopup_1.ExportPopup(this.main.turingMachine);
        });
        menuBar.append("button")
            .attr("id", "load-example-button")
            .text("Load example")
            .on("click", () => {
            new LoadExamplePopup_1.LoadExamplePopup(this.main);
        });
    }
    switchInteractionStyle() {
        this.interactionStyle = (this.interactionStyle + 1) % 2;
        EventManager_1.EventManager.emit(new ChangeInteractionStyleEvent_1.ChangeInteractionStyle(this.interactionStyle));
    }
}
exports.MenuBar = MenuBar;

},{"../events/ChangeInteractionStyleEvent":10,"../events/EventManager":17,"./popups/ExportPopup":64,"./popups/ImportPopup":66,"./popups/LoadExamplePopup":67,"d3-selection":72}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Action {
    constructor(graph, turingMachine) { }
    do() { }
}
exports.Action = Action;

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class CreateStateAction extends Action_1.Action {
    static do(x, y, turingMachine) {
        turingMachine.stateMachine.createAndAddState({ x: x, y: y }, "State " + CreateStateAction.nameState.toString());
        CreateStateAction.nameState += 1;
    }
}
exports.CreateStateAction = CreateStateAction;
CreateStateAction.nameState = 1;

},{"./Action":38}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transition_1 = require("../../model/Transition");
const Tape_1 = require("../../model/Tape");
const Action_1 = require("./Action");
class CreateTransitionAction extends Action_1.Action {
    static do(originNode, destinationNode, turingMachine) {
        turingMachine.stateMachine
            .addTransition(new Transition_1.Transition(turingMachine.stateMachine.getState(originNode.stateID), turingMachine.stateMachine.getState(destinationNode.stateID), "", "", Tape_1.HeadAction.MoveRight));
    }
}
exports.CreateTransitionAction = CreateTransitionAction;

},{"../../model/Tape":30,"../../model/Transition":31,"./Action":38}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class DeleteStateAction extends Action_1.Action {
    static do(node, turingMachine) {
        turingMachine.stateMachine.removeState(node.stateID);
    }
}
exports.DeleteStateAction = DeleteStateAction;

},{"./Action":38}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class DeleteTransitionAction extends Action_1.Action {
    static do(edge, turingMachine) {
        let transitionIDs = edge.transitionIDs.slice();
        transitionIDs.forEach((transitionID) => {
            turingMachine.stateMachine.removeTransition(transitionID);
        });
    }
}
exports.DeleteTransitionAction = DeleteTransitionAction;

},{"./Action":38}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class MoveStateAction extends Action_1.Action {
    static do(node, x, y, turingMachine) {
        let state = turingMachine.stateMachine.getState(node.stateID);
        state.setPosition({ x: x, y: y });
    }
}
exports.MoveStateAction = MoveStateAction;

},{"./Action":38}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("./Action");
class SetInitialStateAction extends Action_1.Action {
    static do(node, turingMachine) {
        turingMachine.stateMachine.setInitialState(node.stateID);
    }
}
exports.SetInitialStateAction = SetInitialStateAction;

},{"./Action":38}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addGenerator(holder, r) {
    holder.append("g")
        .attr("transform", "scale(" + (2 * r / 115).toString() + ")")
        .node().innerHTML = '<g id="generator">   <defs>    <radialGradient id="Gradient_1" gradientUnits="userSpaceOnUse" cx="0.001" cy="-5.223" r="45.625">      <stop offset="0" stop-color="#FCEE21" stop-opacity="0.4"/>      <stop offset="1" stop-color="#FCEE21" stop-opacity="0"/>    </radialGradient>  </defs>  <g id="Layer_1">    <g>      <g id="Base_16_">        <g>          <path d="M-0,56.748 C-31.291,56.748 -56.748,31.291 -56.748,-0 C-56.748,-31.291 -31.291,-56.748 -0,-56.748 C31.291,-56.748 56.748,-31.291 56.748,-0 C56.748,31.291 31.291,56.748 -0,56.748 z" fill="#545656"/>          <path d="M-0,-55.748 C30.789,-55.748 55.748,-30.789 55.748,-0 C55.748,30.788 30.789,55.748 -0,55.748 C-30.789,55.748 -55.748,30.788 -55.748,-0 C-55.748,-30.789 -30.788,-55.748 -0,-55.748 M-0,-57.748 C-31.842,-57.748 -57.748,-31.842 -57.748,-0 C-57.748,31.843 -31.842,57.748 -0,57.748 C31.843,57.748 57.748,31.843 57.748,-0 C57.748,-31.842 31.843,-57.748 -0,-57.748 L-0,-57.748 z" fill="#000000"/>        </g>        <path d="M-0,-55.748 C-30.789,-55.748 -55.748,-30.789 -55.748,-0 C-55.748,13.376 -51.032,25.648 -43.179,35.256 C-45.735,31.6 -62.388,5.701 -45.021,-24.721 C-39.939,-33.621 -34.371,-39.918 -28.95,-44.918 L28.431,-44.918 C33.878,-39.918 39.466,-33.621 44.547,-24.721 C63.3,8.129 42.635,35.683 42.635,35.683 L42.646,35.879 C50.816,26.181 55.748,13.669 55.748,-0.005 C55.748,-30.794 30.789,-55.748 -0,-55.748 z" fill="#333333"/>        <path d="M-0,-30.825 C28.525,-30.825 51.654,-7.74 51.734,20.766 C54.314,14.346 55.748,7.342 55.748,-0 C55.748,-30.789 30.789,-55.748 -0,-55.748 C-30.789,-55.748 -55.748,-30.789 -55.748,-0 C-55.748,7.342 -54.314,14.346 -51.735,20.766 C-51.654,-7.74 -28.525,-30.825 -0,-30.825 z" fill="#999999" display="none"/>        <path d="M-0,-49.598 C21.825,-49.598 40.957,-38.106 51.703,-20.849 C43.446,-41.306 23.415,-55.748 -0,-55.748 C-23.415,-55.748 -43.445,-41.306 -51.702,-20.849 C-40.957,-38.106 -21.825,-49.598 -0,-49.598 z" fill="#545656" display="none"/>        <g>          <path d="M-0,44.319 C-27.358,44.319 -49.616,22.061 -49.616,-5.297 C-49.616,-32.655 -27.358,-54.913 -0,-54.913 C27.358,-54.913 49.616,-32.655 49.616,-5.297 C49.616,22.061 27.359,44.319 -0,44.319 z" fill="#808080"/>          <path d="M-0,-54.413 C27.127,-54.413 49.116,-32.423 49.116,-5.297 C49.116,21.829 27.127,43.819 -0,43.819 C-27.126,43.819 -49.116,21.829 -49.116,-5.297 C-49.116,-32.423 -27.126,-54.413 -0,-54.413 M-0,-55.413 C-27.634,-55.413 -50.116,-32.931 -50.116,-5.297 C-50.116,22.337 -27.634,44.819 -0,44.819 C27.634,44.819 50.116,22.337 50.116,-5.297 C50.117,-32.931 27.634,-55.413 -0,-55.413 L-0,-55.413 z" fill="#000000"/>        </g>      </g>      <g>        <path d="M-1.737,3.019 C-6.078,1.501 -10.227,0.051 -14.591,-1.475 C-2.871,-15.001 8.722,-28.38 20.315,-41.758 C20.419,-41.707 20.522,-41.656 20.626,-41.605 C14.946,-29.884 9.267,-18.164 3.509,-6.282 C7.788,-4.784 11.939,-3.331 16.37,-1.78 C4.016,9.302 -8.17,20.233 -20.354,31.163 C-20.444,31.089 -20.535,31.013 -20.625,30.938 C-14.361,21.679 -8.098,12.422 -1.737,3.019 z" fill="#FFE461"/>        <path d="M-1.737,3.019 C-6.078,1.501 -10.227,0.051 -14.591,-1.475 C-2.871,-15.001 8.722,-28.38 20.315,-41.758 C20.419,-41.707 20.522,-41.656 20.626,-41.605 C14.946,-29.884 9.267,-18.164 3.509,-6.282 C7.788,-4.784 11.939,-3.331 16.37,-1.78 C4.016,9.302 -8.17,20.233 -20.354,31.163 C-20.444,31.089 -20.535,31.013 -20.625,30.938 C-14.361,21.679 -8.098,12.422 -1.737,3.019 z" fill-opacity="0" stroke="#000000" stroke-width="2" stroke-miterlimit="10"/>      </g>      <path d="M45.626,-5.223 C45.626,19.975 25.199,40.402 0.001,40.402 C-25.197,40.402 -45.624,19.975 -45.624,-5.223 C-45.624,-30.421 -25.197,-50.848 0.001,-50.848 C25.199,-50.848 45.626,-30.421 45.626,-5.223 z" fill="url(#Gradient_1)"/>      <g>        <path d="M-31.989,-5.071 C-31.989,-1.88 -34.576,0.707 -37.767,0.707 C-40.958,0.707 -43.545,-1.88 -43.545,-5.071 C-43.545,-8.262 -40.958,-10.849 -37.767,-10.849 C-34.576,-10.849 -31.989,-8.262 -31.989,-5.071 z" fill="#545656" display="none"/>        <path d="M-33.045,-5.428 C-33.045,-2.83 -35.151,-0.724 -37.749,-0.724 C-40.347,-0.724 -42.453,-2.83 -42.453,-5.428 C-42.453,-8.026 -40.347,-10.132 -37.749,-10.132 C-35.151,-10.132 -33.045,-8.026 -33.045,-5.428 z" fill="#999999" display="none"/>        <g display="none">          <path d="M-41.84,-2.151 L-33.886,-8.7" fill="#999999"/>          <path d="M-41.84,-2.151 L-33.886,-8.7" fill-opacity="0" stroke="#545656" stroke-width="3" stroke-miterlimit="10"/>        </g>      </g>      <g>        <path d="M44.011,-5.071 C44.011,-1.88 41.424,0.707 38.233,0.707 C35.042,0.707 32.455,-1.88 32.455,-5.071 C32.455,-8.262 35.042,-10.849 38.233,-10.849 C41.424,-10.849 44.011,-8.262 44.011,-5.071 z" fill="#545656" display="none"/>        <path d="M42.955,-5.428 C42.955,-2.83 40.849,-0.724 38.251,-0.724 C35.653,-0.724 33.547,-2.83 33.547,-5.428 C33.547,-8.026 35.653,-10.132 38.251,-10.132 C40.849,-10.132 42.955,-8.026 42.955,-5.428 z" fill="#999999" display="none"/>        <g display="none">          <path d="M34.16,-2.151 L42.114,-8.7" fill="#999999"/>          <path d="M34.16,-2.151 L42.114,-8.7" fill-opacity="0" stroke="#545656" stroke-width="3" stroke-miterlimit="10"/>        </g>      </g>    </g>  </g></g>';
}
exports.addGenerator = addGenerator;

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addLamp(holder, classOfCircle) {
    holder.append("g").classed(classOfCircle, true)
        .node().innerHTML = '<g id="state"> <defs>   <radialGradient id="Gradient_1" gradientUnits="userSpaceOnUse" cx="-113.078" cy="-183.347" r="29.37" gradientTransform="matrix(1, 0, 0, 1, 112.014, 125.665)">     <stop offset="0" stop-color="#FCEE21" stop-opacity="0.7"/>     <stop offset="1" stop-color="#FCEE21" stop-opacity="0"/>   </radialGradient> </defs> <g id="base-final-off">   <g>     <g id="base-final-off">       <path d="M56.009,-9.095 C61.014,21.846 39.993,50.986 9.058,55.992 C-21.878,60.998 -51.013,39.973 -56.018,9.032 C-61.023,-21.909 -40.002,-51.05 -9.066,-56.055 C21.869,-61.061 51.004,-40.036 56.009,-9.095 z" fill="#545656"/>       <path d="M-0.008,-55.789 C30.776,-55.789 55.729,-30.826 55.724,-0.037 C55.729,30.753 30.776,55.715 -0.008,55.715 C-30.782,55.699 -55.72,30.743 -55.72,-0.037 C-55.72,-30.816 -30.782,-55.772 -0.008,-55.789 M-0.008,-57.789 C-31.873,-57.739 -57.687,-31.907 -57.72,-0.037 C-57.687,31.833 -31.873,57.666 -0.008,57.715 C31.864,57.677 57.69,31.841 57.723,-0.037 C57.69,-31.915 31.864,-57.75 -0.008,-57.789 z" fill="#000000"/>       <path d="M-0.268,50.745 C-29.364,50.745 -53.041,26.744 -53.041,-2.777 C-53.041,-32.298 -29.364,-56.289 -0.268,-56.289 C28.828,-56.289 52.494,-32.288 52.494,-2.777 C52.494,26.734 28.828,50.745 -0.268,50.745 z" fill="#BCBFBF"/>       <path d="M-0.268,-55.789 C28.598,-55.789 51.994,-32.058 51.994,-2.787 C51.994,26.484 28.598,50.215 -0.268,50.215 C-29.134,50.215 -52.541,26.474 -52.541,-2.787 C-52.541,-32.048 -29.134,-55.789 -0.268,-55.789 M-0.268,-56.789 C-29.644,-56.789 -53.541,-32.558 -53.541,-2.787 C-53.541,26.984 -29.644,51.215 -0.268,51.215 C29.108,51.215 52.994,26.984 52.994,-2.787 C52.994,-32.558 29.098,-56.789 -0.268,-56.789 z" fill="#000000"/>       <path d="M-0.008,-55.789 C-30.782,-55.772 -55.72,-30.816 -55.72,-0.037 C-55.749,12.811 -51.318,25.271 -43.182,35.215 C-45.722,31.614 -62.389,5.613 -45.022,-24.798 C-40.76,-32.342 -35.338,-39.17 -28.954,-45.028 L28.418,-45.028 C34.823,-39.179 40.26,-32.351 44.525,-24.798 C63.263,8.054 42.616,35.615 42.616,35.615 L42.616,35.815 C51.088,25.788 55.732,13.081 55.724,-0.047 C55.729,-30.835 30.774,-55.794 -0.008,-55.789 z" fill="#000000" opacity="0.2"/>       <path d="M-0.008,44.285 C-27.395,44.252 -49.588,22.055 -49.621,-5.337 C-49.588,-32.727 -27.393,-54.921 -0.008,-54.949 C27.375,-54.921 49.567,-32.725 49.595,-5.337 C49.567,22.053 27.377,44.252 -0.008,44.285 z" fill="#DCE2E2"/>       <path d="M-0.008,-54.459 C27.112,-54.453 49.095,-32.462 49.095,-5.337 C49.095,21.788 27.112,43.779 -0.008,43.785 C-27.133,43.785 -49.121,21.792 -49.121,-5.337 C-49.121,-32.466 -27.133,-54.459 -0.008,-54.459 M-0.008,-55.459 C-27.671,-55.426 -50.088,-33.005 -50.121,-5.337 C-50.094,22.333 -27.673,44.757 -0.008,44.785 C27.653,44.752 50.067,22.329 50.095,-5.337 C50.062,-33.001 27.651,-55.42 -0.008,-55.459 z" fill="#000000"/>     </g>     <g id="base-final-on">       <path d="M56.009,-9.095 C61.014,21.846 39.993,50.986 9.058,55.992 C-21.878,60.998 -51.013,39.973 -56.018,9.032 C-61.023,-21.909 -40.002,-51.05 -9.066,-56.055 C21.869,-61.061 51.004,-40.036 56.009,-9.095 z" fill="#AEF73C"/>       <path d="M-0.008,-55.789 C30.776,-55.789 55.729,-30.826 55.724,-0.037 C55.729,30.753 30.776,55.715 -0.008,55.715 C-30.782,55.699 -55.72,30.743 -55.72,-0.037 C-55.72,-30.816 -30.782,-55.772 -0.008,-55.789 M-0.008,-57.789 C-31.873,-57.739 -57.687,-31.907 -57.72,-0.037 C-57.687,31.833 -31.873,57.666 -0.008,57.715 C31.864,57.677 57.69,31.841 57.723,-0.037 C57.69,-31.915 31.864,-57.75 -0.008,-57.789 z" fill="#000000"/>       <path d="M-0.268,50.745 C-29.364,50.745 -53.041,26.744 -53.041,-2.777 C-53.041,-32.298 -29.364,-56.289 -0.268,-56.289 C28.828,-56.289 52.494,-32.288 52.494,-2.777 C52.494,26.734 28.828,50.745 -0.268,50.745 z" fill="#BCBFBF"/>       <path d="M-0.268,-55.789 C28.598,-55.789 51.994,-32.058 51.994,-2.787 C51.994,26.484 28.598,50.215 -0.268,50.215 C-29.134,50.215 -52.541,26.474 -52.541,-2.787 C-52.541,-32.048 -29.134,-55.789 -0.268,-55.789 M-0.268,-56.789 C-29.644,-56.789 -53.541,-32.558 -53.541,-2.787 C-53.541,26.984 -29.644,51.215 -0.268,51.215 C29.108,51.215 52.994,26.984 52.994,-2.787 C52.994,-32.558 29.098,-56.789 -0.268,-56.789 z" fill="#000000"/>       <path d="M-0.008,-55.789 C-30.782,-55.772 -55.72,-30.816 -55.72,-0.037 C-55.749,12.811 -51.318,25.271 -43.182,35.215 C-45.722,31.614 -62.389,5.613 -45.022,-24.798 C-40.76,-32.342 -35.338,-39.17 -28.954,-45.028 L28.418,-45.028 C34.823,-39.179 40.26,-32.351 44.525,-24.798 C63.263,8.054 42.616,35.615 42.616,35.615 L42.616,35.815 C51.088,25.788 55.732,13.081 55.724,-0.047 C55.729,-30.835 30.774,-55.794 -0.008,-55.789 z" fill="#000000" opacity="0.2"/>       <path d="M-0.008,44.285 C-27.395,44.252 -49.588,22.055 -49.621,-5.337 C-49.588,-32.727 -27.393,-54.921 -0.008,-54.949 C27.375,-54.921 49.567,-32.725 49.595,-5.337 C49.567,22.053 27.377,44.252 -0.008,44.285 z" fill="#DCE2E2"/>       <path d="M-0.008,-54.459 C27.112,-54.453 49.095,-32.462 49.095,-5.337 C49.095,21.788 27.112,43.779 -0.008,43.785 C-27.133,43.785 -49.121,21.792 -49.121,-5.337 C-49.121,-32.466 -27.133,-54.459 -0.008,-54.459 M-0.008,-55.459 C-27.671,-55.426 -50.088,-33.005 -50.121,-5.337 C-50.094,22.333 -27.673,44.757 -0.008,44.785 C27.653,44.752 50.067,22.329 50.095,-5.337 C50.062,-33.001 27.651,-55.42 -0.008,-55.459 z" fill="#000000"/>     </g>     <g id="label">       <path d="M-42.952,-22.388 L43.036,-22.388 L43.036,9.614 L-42.952,9.614 z" fill="#C4B7A3"/>       <path d="M-42.952,-19.387 L43.036,-19.387 L43.036,5.613 L-42.952,5.613 z" fill="#E5D8C1"/>       <text id="label-text" text-anchor="middle">         <tspan x="0" y="0" font-family="Georgia" font-size="16" fill="#545656">State 1</tspan>       </text>     </g>     <g id="below-lamp">       <path d="M-44.452,-27.888 L-44.082,-28.618 C-35.63,-45.163 -18.585,-55.54 -0.008,-55.449 C18.566,-55.543 35.61,-45.165 44.055,-28.618 L44.425,-27.888 z" fill="#BCBFBF"/>       <path d="M-0.008,-54.959 C18.383,-55.05 35.256,-44.772 43.615,-28.388 L-43.632,-28.388 C-35.278,-44.777 -18.401,-55.057 -0.008,-54.959 M-0.008,-55.959 C-18.776,-56.051 -35.995,-45.56 -44.522,-28.838 L-45.272,-27.388 L45.265,-27.388 L44.525,-28.838 C35.995,-45.567 18.767,-56.059 -0.008,-55.959 z" fill="#000000"/>       <path d="M-17.996,-38.108 C-17.996,-34.935 -20.553,-32.355 -23.725,-32.328 C-26.917,-32.328 -29.504,-34.916 -29.504,-38.108 C-29.504,-41.301 -26.917,-43.888 -23.725,-43.888 C-20.553,-43.861 -17.996,-41.281 -17.996,-38.108 z" fill="#999999"/>       <path d="M-19.056,-38.468 C-19.053,-37.221 -19.547,-36.024 -20.429,-35.142 C-21.311,-34.26 -22.508,-33.765 -23.755,-33.768 C-25.003,-33.765 -26.201,-34.259 -27.084,-35.141 C-27.968,-36.023 -28.464,-37.22 -28.464,-38.468 C-28.464,-39.722 -27.964,-40.923 -27.074,-41.806 C-26.184,-42.689 -24.978,-43.179 -23.725,-43.168 C-21.139,-43.157 -19.05,-41.055 -19.056,-38.468 z" fill="#BCBFBF"/>       <g>         <path d="M-27.844,-35.188 L-19.895,-41.738" fill="#999999"/>         <path d="M-27.844,-35.188 L-19.895,-41.738" fill-opacity="0" stroke="#999999" stroke-width="3" stroke-miterlimit="10"/>       </g>       <path d="M29.997,-38.108 C29.998,-34.935 27.44,-32.355 24.268,-32.328 C21.077,-32.328 18.489,-34.916 18.489,-38.108 C18.489,-41.301 21.077,-43.888 24.268,-43.888 C27.44,-43.861 29.998,-41.281 29.997,-38.108 z" fill="#999999"/>       <path d="M28.938,-38.468 C28.94,-37.221 28.446,-36.024 27.564,-35.142 C26.682,-34.26 25.485,-33.765 24.238,-33.768 C22.99,-33.765 21.792,-34.259 20.909,-35.141 C20.025,-36.023 19.529,-37.22 19.529,-38.468 C19.529,-39.722 20.029,-40.923 20.919,-41.806 C21.809,-42.689 23.015,-43.179 24.268,-43.168 C26.854,-43.157 28.943,-41.055 28.938,-38.468 z" fill="#BCBFBF"/>       <g>         <path d="M20.149,-35.188 L28.098,-41.738" fill="#999999"/>         <path d="M20.149,-35.188 L28.098,-41.738" fill-opacity="0" stroke="#999999" stroke-width="3" stroke-miterlimit="10"/>       </g>     </g>     <g id="lamp-off">       <g>         <path d="M4.201,-40.608 C4.426,-40.807 4.559,-41.089 4.571,-41.388 C4.571,-42.578 2.151,-43.538 -0.828,-43.538 C-3.808,-43.538 -6.227,-42.538 -6.227,-41.388 C-6.212,-41.095 -6.083,-40.818 -5.867,-40.618 C-6.083,-40.418 -6.212,-40.142 -6.227,-39.848 C-6.217,-39.553 -6.087,-39.276 -5.867,-39.078 C-6.085,-38.876 -6.215,-38.595 -6.227,-38.298 C-6.212,-38.004 -6.083,-37.728 -5.867,-37.528 C-6.083,-37.328 -6.212,-37.052 -6.227,-36.758 C-6.212,-36.464 -6.083,-36.188 -5.867,-35.988 C-6.083,-35.788 -6.212,-35.512 -6.227,-35.218 C-6.227,-34.028 -3.808,-33.068 -0.828,-33.068 C2.151,-33.068 4.571,-34.068 4.571,-35.218 C4.557,-35.514 4.423,-35.792 4.201,-35.988 C4.423,-36.184 4.557,-36.462 4.571,-36.758 C4.557,-37.054 4.423,-37.332 4.201,-37.528 C4.423,-37.725 4.557,-38.002 4.571,-38.298 C4.559,-38.598 4.426,-38.88 4.201,-39.078 C4.427,-39.272 4.561,-39.551 4.571,-39.848 C4.554,-40.141 4.421,-40.414 4.201,-40.608 z" fill="#999999"/>         <path d="M4.201,-40.608 C4.426,-40.807 4.559,-41.089 4.571,-41.388 C4.571,-42.578 2.151,-43.538 -0.828,-43.538 C-3.808,-43.538 -6.227,-42.538 -6.227,-41.388 C-6.212,-41.095 -6.083,-40.818 -5.867,-40.618 C-6.083,-40.418 -6.212,-40.142 -6.227,-39.848 C-6.217,-39.553 -6.087,-39.276 -5.867,-39.078 C-6.085,-38.876 -6.215,-38.595 -6.227,-38.298 C-6.212,-38.004 -6.083,-37.728 -5.867,-37.528 C-6.083,-37.328 -6.212,-37.052 -6.227,-36.758 C-6.212,-36.464 -6.083,-36.188 -5.867,-35.988 C-6.083,-35.788 -6.212,-35.512 -6.227,-35.218 C-6.227,-34.028 -3.808,-33.068 -0.828,-33.068 C2.151,-33.068 4.571,-34.068 4.571,-35.218 C4.557,-35.514 4.423,-35.792 4.201,-35.988 C4.423,-36.184 4.557,-36.462 4.571,-36.758 C4.557,-37.054 4.423,-37.332 4.201,-37.528 C4.423,-37.725 4.557,-38.002 4.571,-38.298 C4.559,-38.598 4.426,-38.88 4.201,-39.078 C4.427,-39.272 4.561,-39.551 4.571,-39.848 C4.554,-40.141 4.421,-40.414 4.201,-40.608 z" fill-opacity="0" stroke="#545656" stroke-width="1" stroke-miterlimit="10"/>       </g>       <g>         <path d="M6.271,-68.069 C0.892,-77.85 -0.928,-76.73 -0.928,-76.73 C-0.928,-76.73 -2.928,-77.85 -8.297,-68.069 C-13.666,-58.289 -12.067,-55.309 -10.547,-52.389 C-9.578,-50.367 -9.033,-48.169 -8.947,-45.928 C-8.497,-42.628 -5.228,-40.998 -5.228,-40.998 C-5.228,-40.998 -4.648,-40.278 -0.918,-40.278 C2.811,-40.278 3.081,-40.998 3.081,-40.998 C3.081,-40.998 6.351,-42.628 6.801,-45.928 C6.881,-48.166 7.415,-50.364 8.371,-52.389 C9.9,-55.309 11.66,-58.289 6.271,-68.069 z" fill="#DEE0E0" fill-opacity="0.7"/>         <path d="M6.271,-68.069 C0.892,-77.85 -0.928,-76.73 -0.928,-76.73 C-0.928,-76.73 -2.928,-77.85 -8.297,-68.069 C-13.666,-58.289 -12.067,-55.309 -10.547,-52.389 C-9.578,-50.367 -9.033,-48.169 -8.947,-45.928 C-8.497,-42.628 -5.228,-40.998 -5.228,-40.998 C-5.228,-40.998 -4.648,-40.278 -0.918,-40.278 C2.811,-40.278 3.081,-40.998 3.081,-40.998 C3.081,-40.998 6.351,-42.628 6.801,-45.928 C6.881,-48.166 7.415,-50.364 8.371,-52.389 C9.9,-55.309 11.66,-58.289 6.271,-68.069 z" fill-opacity="0" stroke="#545656" stroke-width="1" stroke-miterlimit="10"/>       </g>       <path d="M-1.858,-41.498 L-2.558,-49.769 L-6.537,-59.759" fill-opacity="0" stroke="#BCBFBF" stroke-width="1" stroke-miterlimit="10"/>       <path d="M0.342,-41.498 L1.042,-49.769 L5.011,-59.759" fill-opacity="0" stroke="#BCBFBF" stroke-width="1" stroke-miterlimit="10"/>       <path d="M-6.537,-59.549 L-5.407,-60.779 L-3.418,-59.229 L-0.828,-60.779 L1.841,-59.549 L3.771,-60.779 L5.011,-59.549" fill-opacity="0" stroke="#BCBFBF" stroke-width="1" stroke-miterlimit="10"/>     </g>     <g id="lamp-on">       <g>         <path d="M4.201,-40.608 C4.426,-40.807 4.559,-41.089 4.571,-41.388 C4.571,-42.578 2.151,-43.538 -0.828,-43.538 C-3.808,-43.538 -6.227,-42.538 -6.227,-41.388 C-6.212,-41.095 -6.083,-40.818 -5.867,-40.618 C-6.083,-40.418 -6.212,-40.142 -6.227,-39.848 C-6.217,-39.553 -6.087,-39.276 -5.867,-39.078 C-6.085,-38.876 -6.215,-38.595 -6.227,-38.298 C-6.212,-38.004 -6.083,-37.728 -5.867,-37.528 C-6.083,-37.328 -6.212,-37.052 -6.227,-36.758 C-6.212,-36.464 -6.083,-36.188 -5.867,-35.988 C-6.083,-35.788 -6.212,-35.512 -6.227,-35.218 C-6.227,-34.028 -3.808,-33.068 -0.828,-33.068 C2.151,-33.068 4.571,-34.068 4.571,-35.218 C4.557,-35.514 4.423,-35.792 4.201,-35.988 C4.423,-36.184 4.557,-36.462 4.571,-36.758 C4.557,-37.054 4.423,-37.332 4.201,-37.528 C4.423,-37.725 4.557,-38.002 4.571,-38.298 C4.559,-38.598 4.426,-38.88 4.201,-39.078 C4.427,-39.272 4.561,-39.551 4.571,-39.848 C4.554,-40.141 4.421,-40.414 4.201,-40.608 z" fill="#999999"/>         <path d="M4.201,-40.608 C4.426,-40.807 4.559,-41.089 4.571,-41.388 C4.571,-42.578 2.151,-43.538 -0.828,-43.538 C-3.808,-43.538 -6.227,-42.538 -6.227,-41.388 C-6.212,-41.095 -6.083,-40.818 -5.867,-40.618 C-6.083,-40.418 -6.212,-40.142 -6.227,-39.848 C-6.217,-39.553 -6.087,-39.276 -5.867,-39.078 C-6.085,-38.876 -6.215,-38.595 -6.227,-38.298 C-6.212,-38.004 -6.083,-37.728 -5.867,-37.528 C-6.083,-37.328 -6.212,-37.052 -6.227,-36.758 C-6.212,-36.464 -6.083,-36.188 -5.867,-35.988 C-6.083,-35.788 -6.212,-35.512 -6.227,-35.218 C-6.227,-34.028 -3.808,-33.068 -0.828,-33.068 C2.151,-33.068 4.571,-34.068 4.571,-35.218 C4.557,-35.514 4.423,-35.792 4.201,-35.988 C4.423,-36.184 4.557,-36.462 4.571,-36.758 C4.557,-37.054 4.423,-37.332 4.201,-37.528 C4.423,-37.725 4.557,-38.002 4.571,-38.298 C4.559,-38.598 4.426,-38.88 4.201,-39.078 C4.427,-39.272 4.561,-39.551 4.571,-39.848 C4.554,-40.141 4.421,-40.414 4.201,-40.608 z" fill-opacity="0" stroke="#545656" stroke-width="1" stroke-miterlimit="10"/>       </g>       <g>         <path d="M6.271,-68.069 C0.892,-77.85 -0.928,-76.73 -0.928,-76.73 C-0.928,-76.73 -2.928,-77.85 -8.297,-68.069 C-13.666,-58.289 -12.067,-55.309 -10.547,-52.389 C-9.578,-50.367 -9.033,-48.169 -8.947,-45.928 C-8.497,-42.628 -5.228,-40.998 -5.228,-40.998 C-5.228,-40.998 -4.648,-40.278 -0.918,-40.278 C2.811,-40.278 3.081,-40.998 3.081,-40.998 C3.081,-40.998 6.351,-42.628 6.801,-45.928 C6.881,-48.166 7.415,-50.364 8.371,-52.389 C9.9,-55.309 11.66,-58.289 6.271,-68.069 z" fill="#FFE461" fill-opacity="0.7"/>         <path d="M6.271,-68.069 C0.892,-77.85 -0.928,-76.73 -0.928,-76.73 C-0.928,-76.73 -2.928,-77.85 -8.297,-68.069 C-13.666,-58.289 -12.067,-55.309 -10.547,-52.389 C-9.578,-50.367 -9.033,-48.169 -8.947,-45.928 C-8.497,-42.628 -5.228,-40.998 -5.228,-40.998 C-5.228,-40.998 -4.648,-40.278 -0.918,-40.278 C2.811,-40.278 3.081,-40.998 3.081,-40.998 C3.081,-40.998 6.351,-42.628 6.801,-45.928 C6.881,-48.166 7.415,-50.364 8.371,-52.389 C9.9,-55.309 11.66,-58.289 6.271,-68.069 z" fill-opacity="0" stroke="#969654" stroke-width="1" stroke-miterlimit="10"/>       </g>       <path d="M-1.858,-41.498 L-2.558,-49.769 L-6.537,-59.759" fill-opacity="0" stroke="#969654" stroke-width="1" stroke-miterlimit="10"/>       <path d="M0.342,-41.498 L1.042,-49.769 L5.011,-59.759" fill-opacity="0" stroke="#969654" stroke-width="1" stroke-miterlimit="10"/>       <path d="M-6.537,-59.549 L-5.407,-60.779 L-3.418,-59.229 L-0.828,-60.779 L1.841,-59.549 L3.771,-60.779 L5.011,-59.549" fill-opacity="0" stroke="#969654" stroke-width="1" stroke-miterlimit="10"/>       <path d="M28.318,-57.689 C28.318,-41.468 15.17,-28.318 -1.048,-28.318 C-17.265,-28.318 -30.409,-41.469 -30.404,-57.689 C-30.409,-73.907 -17.263,-87.056 -1.048,-87.05 C15.169,-87.056 28.318,-73.909 28.318,-57.689 z" fill="url(#Gradient_1)"/>     </g>     <g id="final-off">       <path d="M-19.955,15.464 L20.039,15.464 L20.039,32.464 L-19.955,32.464 z" fill="#545656"/>       <path d="M19.539,15.964 L19.539,31.964 L-19.455,31.964 L-19.455,15.964 L19.539,15.964 M20.539,14.964 L-20.455,14.964 L-20.455,32.964 L20.539,32.964 L20.539,14.964 z" fill="#000000"/>     </g>     <g id="final-on">       <path d="M-19.735,15.464 L20.259,15.464 L20.259,32.464 L-19.735,32.464 z" fill="#8CC63F"/>       <path d="M19.749,15.964 L19.749,31.964 L-19.246,31.964 L-19.246,15.964 L19.749,15.964 M20.749,14.964 L-20.245,14.964 L-20.245,32.964 L20.749,32.964 L20.749,14.964 z" fill="#000000"/>       <path d="M-19.206,18.064 L19.729,18.064 L19.729,29.874 L-19.206,29.874 z" fill="#AEF73C"/>       <path d="M-14.726,23.724 L-11.827,23.724 L-11.827,25.134 L-14.726,25.134 L-14.726,28.434 L-16.726,28.434 L-16.726,20.124 L-11.267,20.124 L-11.457,21.524 L-14.726,21.524 z" fill="#000000"/>       <path d="M-4.468,21.614 L-6.177,21.614 L-6.177,27.034 L-4.468,27.034 L-4.468,28.484 L-9.867,28.484 L-9.867,27.034 L-8.147,27.034 L-8.147,21.614 L-9.867,21.614 L-9.867,20.174 L-4.468,20.174 z" fill="#000000"/>       <path d="M-1.558,21.754 C-1.385,22.93 -1.288,24.116 -1.268,25.304 L-1.268,28.434 L-2.938,28.434 L-2.938,20.124 L-0.478,20.124 L1.632,26.774 C1.442,25.627 1.345,24.467 1.342,23.304 L1.342,20.124 L3.011,20.124 L3.011,28.434 L0.622,28.434 z" fill="#000000"/>       <path d="M6.001,26.614 L5.571,28.414 L3.501,28.414 L6.051,20.104 L8.431,20.104 L10.97,28.414 L8.86,28.414 L8.431,26.614 z M8.111,25.204 L7.211,21.514 L6.311,25.204 z" fill="#000000"/>       <path d="M11.95,20.124 L13.95,20.124 L13.95,26.874 L17.539,26.874 L17.349,28.434 L11.98,28.434 z" fill="#000000"/>     </g>   </g> </g></g>';
}
exports.addLamp = addLamp;

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
class Edge {
    constructor(graph) {
        this.id = "edge-" + Edge.edgeNumber;
        Edge.edgeNumber += 1;
        this.handleSelection =
            graph.getEdgesGroup()
                .append("g")
                .datum({ edge: this })
                .attr("id", this.id)
                .classed("edge", true);
    }
    init() {
        this.handleSelection
            .append("rect")
            .attr("x", 0)
            .attr("y", -25)
            .attr("width", 1)
            .attr("height", 50);
        this.handleSelection.append("path").attr("d", "M0,0 L0,1");
        this.handleSelection.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .text("");
    }
    redraw(pt1, pt2, curved = false, flipped = false) {
        if (pt1.x === pt2.x && pt1.y === pt2.y) {
            this.redrawBetweenOnePoint(pt1, flipped);
        }
        else {
            this.redawBetweenTwoPoints(pt1, pt2, curved);
        }
    }
    redawBetweenTwoPoints(pt1, pt2, curved = false) {
        let len = helpers_1.Helpers.distance2(pt1, pt2);
        let angle = 180 * helpers_1.Helpers.angleToXAxis(pt1, pt2) / Math.PI;
        let xText = len / 2;
        let yText = -5;
        if (!curved) {
            this.handleSelection
                .select("path")
                .attr("d", "M0,0" +
                " L" + (len).toString() + ",0");
        }
        else {
            let c = Math.min(40 * len / 200, 100);
            let y = -2;
            this.handleSelection
                .select("path")
                .attr("d", "M" + 0 + "," + y +
                "C" + (c) + "," + (y - c / 2) + " "
                + (len - c) + "," + (y - c / 2) + " "
                + (len) + "," + y);
            xText = (len) / 2;
            yText = (y + 3 * (y - c / 2)) / 4 - 5;
        }
        this.handleSelection.select("text")
            .attr("x", xText)
            .attr("y", yText);
        if (angle > 90 || angle < -90) {
            this.handleSelection.select("text")
                .attr("transform", "rotate(180," + xText + "," + yText + ") " +
                "translate(0, 9)");
        }
        else {
            this.handleSelection.select("text").attr("transform", "");
        }
        this.handleSelection
            .select("rect")
            .attr("y", yText - 20)
            .attr("width", len)
            .attr("height", Math.abs(yText - 20) + 5);
        this.handleSelection
            .attr("transform", "rotate(" + angle + "," + (pt1.x) + "," + (pt1.y) + ")" + " translate(" + (pt1.x) + "," + (pt1.y) + ")");
    }
    redrawBetweenOnePoint(pt, flipped) {
        let firstYOffset = (flipped) ? -50 : 50;
        let secondYOffset = (flipped) ? -75 : 75;
        let xOffset = (flipped) ? -20 : 20;
        let c = (flipped) ? -12 : 12;
        let startX = 0;
        let startY = 0;
        let finalX = 0;
        let finalY = 0;
        this.handleSelection
            .select("path").attr("d", "M" + startX + "," + startY +
            " C " + startX + "," + startY + "," + xOffset + "," + (firstYOffset - c) + " " + xOffset + "," + (firstYOffset) +
            " C" + xOffset + "," + (firstYOffset + c) + " " + c + "," + (secondYOffset) + " 0," + (secondYOffset) +
            " C" + "" + (-1 * c) + "," + (secondYOffset) + " " + (-1 * xOffset) + "," + (firstYOffset + c) + " " + (-1 * xOffset) + "," + (firstYOffset) +
            " C" + (-1 * xOffset) + "," + (firstYOffset - c) + " " + finalX + "," + finalY + " " + finalX + "," + finalY)
            .style("fill", "none");
        this.handleSelection.select("rect")
            .attr("x", -Math.abs(xOffset))
            .attr("y", Math.min(0, secondYOffset - 20))
            .attr("width", Math.abs(2 * xOffset))
            .attr("height", (20 + Math.abs(secondYOffset)))
            .style("fill", "red");
        this.handleSelection.select("text")
            .attr("x", 0)
            .attr("y", (flipped) ? secondYOffset - 2 : secondYOffset + 18);
        this.handleSelection.attr("transform", " translate(" + (pt.x) + "," + (pt.y) + ")");
    }
    redrawText(text) {
        this.handleSelection.select("text").text(text);
    }
    delete() {
        this.handleSelection.remove();
    }
    validate() {
        this.handleSelection.classed("not-valid", false);
    }
    invalidate() {
        this.handleSelection.classed("not-valid", true);
    }
    static isEdge(selection) {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined;
    }
    static getEdge(selection) {
        if (Edge.isEdge(selection)) {
            return selection.datum()["edge"];
        }
        throw "Edge.ts (getEdge): Selection is not part of a edge";
    }
}
exports.Edge = Edge;
Edge.edgeNumber = 0;

},{"../../helpers":26}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const helpers_1 = require("../../helpers");
const Edge_1 = require("./Edge");
class GeneratorEdge extends Edge_1.Edge {
    constructor(graph, generatorNode, stateNode) {
        super(graph);
        this.generatorNode = generatorNode;
        this.stateNode = stateNode;
        this.initGeneratorEdge();
    }
    initGeneratorEdge() {
        super.init();
        this.handleSelection.classed("generator-edge", true);
        this.redrawGeneratorEdge();
    }
    redrawGeneratorEdge() {
        let pt1 = { x: this.generatorNode.x, y: this.generatorNode.y };
        let pt2 = { x: this.stateNode.x, y: this.stateNode.y };
        let dx, dy;
        let angle = helpers_1.Helpers.angleToXAxis(pt1, pt2);
        dx = Math.cos(angle) * Graph_1.Graph.sizeNode;
        dy = Math.sin(angle) * Graph_1.Graph.sizeNode;
        this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, false);
    }
    static isGeneratorEdge(selection) {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof GeneratorEdge;
    }
    static getGeneratorEdge(selection) {
        if (GeneratorEdge.isGeneratorEdge(selection)) {
            return selection.datum()["edge"];
        }
    }
}
exports.GeneratorEdge = GeneratorEdge;

},{"../../helpers":26,"../Graph":34,"./Edge":47}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const helpers_1 = require("../../helpers");
const Tape_1 = require("../../model/Tape");
const Edge_1 = require("./Edge");
class TransitionEdge extends Edge_1.Edge {
    constructor(graph, transition, isCurved) {
        super(graph);
        this.transitionIDs = [transition.id];
        this.originNode = graph.stateIdToStateNode.get(transition.origin.id);
        this.destinationNode = graph.stateIdToStateNode.get(transition.destination.id);
        this.isCurved = isCurved;
        this.graph = graph;
        this.initTransitionEdge(transition);
    }
    initTransitionEdge(transition) {
        super.init();
        this.handleSelection.classed("transition-edge", true);
        this.redrawTransitionEdge();
        this.drawTransitionText(transition.getInputSymbol(), transition.getOutputSymbol(), transition.getHeadAction());
    }
    addTransitionToEdge(transition) {
        this.transitionIDs.push(transition.id);
        this.handleSelection.classed("bigger", true);
    }
    redrawTransitionEdge() {
        let pt1 = { x: this.originNode.x, y: this.originNode.y };
        let pt2 = { x: this.destinationNode.x, y: this.destinationNode.y };
        let dx, dy;
        if (pt1.x === pt2.x && pt1.y === pt2.y) {
            let flipped = pt1.y < this.graph.viewBox.y + this.graph.viewBox.height / 2;
            dx = 0;
            dy = (flipped) ? -Graph_1.Graph.sizeNode : Graph_1.Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt1.x + dx, y: pt1.y + dy }, false, flipped);
        }
        else {
            let angle = helpers_1.Helpers.angleToXAxis(pt1, pt2);
            dx = Math.cos(angle) * Graph_1.Graph.sizeNode;
            dy = Math.sin(angle) * Graph_1.Graph.sizeNode;
            this.redraw({ x: pt1.x + dx, y: pt1.y + dy }, { x: pt2.x - dx, y: pt2.y - dy }, this.isCurved);
        }
    }
    deleteTransitionEdge(transitionId) {
        let index = this.transitionIDs.indexOf(transitionId);
        this.transitionIDs.splice(index, 1);
        this.handleSelection.classed("bigger", this.transitionIDs.length !== 1);
        if (this.transitionIDs.length === 0) {
            this.delete();
        }
    }
    static isTransitionEdge(selection) {
        return selection.datum() !== undefined && selection.datum()["edge"] !== undefined && selection.datum()["edge"] instanceof TransitionEdge;
    }
    static getTransitionEdge(selection) {
        if (TransitionEdge.isTransitionEdge(selection)) {
            return selection.datum()["edge"];
        }
    }
    drawTransitionText(inputSymbol, outputSymbol, headAction) {
        let headActionSymbol = "";
        switch (headAction) {
            case Tape_1.HeadAction.MoveLeft:
                headActionSymbol = "←";
                break;
            case Tape_1.HeadAction.MoveRight:
                headActionSymbol = "→";
                break;
            case Tape_1.HeadAction.None:
                headActionSymbol = "∅";
                break;
        }
        let extraTransitionsSymbol = (this.transitionIDs.length > 1) ? " ..." : "";
        this.redrawText((inputSymbol === "" ? "" : ("\u{1F4D6} " + inputSymbol + " "))
            + (outputSymbol === "" ? "" : ("\u{1F4DD} " + outputSymbol + " "))
            + ("\u{1F9ED} " + headActionSymbol)
            + extraTransitionsSymbol);
    }
    setCurved(b) {
        this.isCurved = b;
    }
}
exports.TransitionEdge = TransitionEdge;

},{"../../helpers":26,"../../model/Tape":30,"../Graph":34,"./Edge":47}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
class GraphEventDispatcher {
    constructor(graph, turingMachine) {
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isActivated = false;
        this.setInteraction();
    }
    setInteraction() {
        let timeDown = {};
        this.graph.getSVGElement()
            .addEventListener("pointerdown", (e) => {
            if (this.isActivated) {
                timeDown[e.pointerId] = new Date().getTime();
                this.dispatchDownEvent(helpers_1.Helpers.transformEvent(e));
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointermove", (e) => {
            if (this.isActivated) {
                this.dispatchMoveEvent(helpers_1.Helpers.transformEvent(e));
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointerup", (e) => {
            if (this.isActivated) {
                this.dispatchUpEvent(helpers_1.Helpers.transformEvent(e));
                if (Math.abs(new Date().getTime() - timeDown[e.pointerId]) < 200) {
                    this.dispatchClickEvent(helpers_1.Helpers.transformEvent(e));
                }
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointerleave", (e) => {
            if (this.isActivated) {
                this.dispatchLeaveEvent(helpers_1.Helpers.transformEvent(e));
            }
        });
        this.graph.getSVGElement()
            .addEventListener("pointercancel", (e) => {
            if (this.isActivated) {
                console.log("cancel");
            }
        });
    }
    dispatchDownEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchMoveEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchUpEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchLeaveEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    dispatchClickEvent(e) {
        helpers_1.Helpers.updateXYSVG(e, this.graph);
    }
    activate() {
        this.isActivated = true;
    }
    deactivate() {
        this.isActivated = false;
    }
}
exports.GraphEventDispatcher = GraphEventDispatcher;

},{"../../helpers":26}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const DeleteTransitionAction_1 = require("../../actions/DeleteTransitionAction");
const DeleteStateAction_1 = require("../../actions/DeleteStateAction");
const TransitionEdge_1 = require("../../edges/TransitionEdge");
const StateNode_1 = require("../../nodes/StateNode");
class Eraser {
    constructor(graph, turingMachine) {
        this.turingMachine = turingMachine;
    }
    pointerDown(e) {
        this.target = e.target;
    }
    pointerMove(e) {
    }
    pointerUp(e) {
        let targetSelection = d3.select(this.target);
        if (StateNode_1.StateNode.isStateNode(targetSelection)) {
            DeleteStateAction_1.DeleteStateAction.do(StateNode_1.StateNode.getStateNode(targetSelection), this.turingMachine);
        }
        else if (TransitionEdge_1.TransitionEdge.isTransitionEdge(targetSelection)) {
            DeleteTransitionAction_1.DeleteTransitionAction.do(TransitionEdge_1.TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
    }
    pointerLeave(e) {
    }
    click(e) { }
}
exports.Eraser = Eraser;

},{"../../actions/DeleteStateAction":41,"../../actions/DeleteTransitionAction":42,"../../edges/TransitionEdge":49,"../../nodes/StateNode":61,"d3-selection":72}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EdgeTool_1 = require("../tools/EdgeTool");
class Pen {
    constructor(graph, turingMachine) {
        this.edgeTool = new EdgeTool_1.EdgeTool(graph, turingMachine);
    }
    pointerDown(e) {
        this.edgeTool.pointerDown(e);
    }
    pointerMove(e) {
        this.edgeTool.pointerMove(e);
    }
    pointerUp(e) {
        this.edgeTool.pointerUp(e);
    }
    pointerLeave(e) {
        this.edgeTool.pointerLeave(e);
    }
    click(e) {
        this.edgeTool.pointerClick(e);
    }
}
exports.Pen = Pen;

},{"../tools/EdgeTool":55}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pen_1 = require("./Pen");
const Eraser_1 = require("./Eraser");
const Touch_1 = require("./Touch");
const GraphEventDispatcher_1 = require("../GraphEventDispatcher");
class PenAndTouchDispatcher extends GraphEventDispatcher_1.GraphEventDispatcher {
    constructor(graph, turingMachine) {
        super(graph, turingMachine);
        this.idToPenAndTouch = {};
    }
    dispatchDownEvent(e) {
        super.dispatchDownEvent(e);
        switch (e.pointerType) {
            case "touch":
                this.idToPenAndTouch[e.pointerId] = new Touch_1.Touch(this.graph, this.turingMachine);
                break;
            case "pen":
                this.idToPenAndTouch[e.pointerId] = new Pen_1.Pen(this.graph, this.turingMachine);
                break;
            case "eraser":
                this.idToPenAndTouch[e.pointerId] = new Eraser_1.Eraser(this.graph, this.turingMachine);
                break;
            case "modify":
            default:
        }
        this.idToPenAndTouch[e.pointerId].pointerDown(e);
    }
    dispatchMoveEvent(e) {
        super.dispatchMoveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerMove(e);
        }
    }
    dispatchUpEvent(e) {
        super.dispatchUpEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerUp(e);
        }
    }
    dispatchLeaveEvent(e) {
        super.dispatchLeaveEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].pointerLeave(e);
        }
    }
    dispatchClickEvent(e) {
        super.dispatchClickEvent(e);
        if (this.idToPenAndTouch[e.pointerId] !== undefined) {
            this.idToPenAndTouch[e.pointerId].click(e);
        }
    }
}
exports.PenAndTouchDispatcher = PenAndTouchDispatcher;

},{"../GraphEventDispatcher":50,"./Eraser":51,"./Pen":52,"./Touch":54}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeTool_1 = require("../tools/NodeTool");
class Touch {
    constructor(graph, turingMachine) {
        this.turingMachine = turingMachine;
        this.nodeTool = new NodeTool_1.NodeTool(graph, turingMachine);
    }
    pointerDown(e) {
        this.nodeTool.pointerDown(e);
    }
    pointerMove(e) {
        this.nodeTool.pointerMove(e);
    }
    pointerUp(e) {
        this.nodeTool.pointerUp(e);
    }
    pointerLeave(e) {
        this.nodeTool.pointerLeave(e);
    }
    click(e) {
        this.nodeTool.pointerClick(e);
    }
}
exports.Touch = Touch;

},{"../tools/NodeTool":57}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateTransitionAction_1 = require("../../actions/CreateTransitionAction");
const Graph_1 = require("../../Graph");
const Node_1 = require("../../nodes/Node");
const d3 = require("d3-selection");
const helpers_1 = require("../../../helpers");
const SetInitialStateAction_1 = require("../../actions/SetInitialStateAction");
const TransitionEdge_1 = require("../../edges/TransitionEdge");
const StateNode_1 = require("../../nodes/StateNode");
const GeneratorEdge_1 = require("../../edges/GeneratorEdge");
const GeneratorNode_1 = require("../../nodes/GeneratorNode");
const NodeEditorPopup_1 = require("../../popups/NodeEditorPopup");
const TransitionEdgeEditorPopup_1 = require("../../popups/TransitionEdgeEditorPopup");
const GeneratorEdgeEditorPopup_1 = require("../../popups/GeneratorEdgeEditorPopup");
class EdgeTool {
    constructor(graph, turingMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.graph = graph;
        this.isDown = false;
        this.turingMachine = turingMachine;
    }
    pointerDown(e) {
        this.previousX = e.x;
        this.previousY = e.y;
        this.node = undefined;
        let targetSelection = d3.select(e.target);
        this.isDown = true;
        if (Node_1.Node.isNode(targetSelection)) {
            this.node = Node_1.Node.getNode(targetSelection);
            this.edgeInCreation =
                this.graph.getSVG()
                    .append("path")
                    .classed("edge-in-creation", true);
            this.drawEdgeInCreation();
            return;
        }
        if (d3.select(e.target).node().tagName === "svg") {
            this.node = undefined;
            this.previousX = e.pageX;
            this.previousY = e.pageY;
            return;
        }
        this.isDown = false;
    }
    pointerMove(e) {
        if (this.isDown) {
            if (this.node !== undefined) {
                this.drawEdgeInCreation();
                d3.selectAll(".node.closest-node").classed("closest-node", false);
                let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph_1.Graph.sizeNode, Graph_1.Graph.sizeNode * 3);
                if (closestNode !== undefined) {
                    closestNode.handleSelection.classed("closest-node", true);
                }
                this.previousX = e.x;
                this.previousY = e.y;
            }
            else {
                this.graph.translateViewBoxBy(e.pageX - this.previousX, e.pageY - this.previousY);
                this.previousX = e.pageX;
                this.previousY = e.pageY;
            }
        }
    }
    pointerUp(e) {
        this.isDown = false;
        if (this.node !== undefined) {
            this.edgeInCreation.remove();
            d3.selectAll(".node.closest-node").classed("closest-node", false);
            let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph_1.Graph.sizeNode, Graph_1.Graph.sizeNode * 3);
            if (closestNode !== undefined) {
                if (this.node instanceof StateNode_1.StateNode && closestNode instanceof StateNode_1.StateNode) {
                    CreateTransitionAction_1.CreateTransitionAction.do(this.node, closestNode, this.turingMachine);
                }
                else if (this.node instanceof GeneratorNode_1.GeneratorNode && closestNode instanceof StateNode_1.StateNode) {
                    SetInitialStateAction_1.SetInitialStateAction.do(closestNode, this.turingMachine);
                }
                else if (this.node instanceof StateNode_1.StateNode && closestNode instanceof GeneratorNode_1.GeneratorNode) {
                    SetInitialStateAction_1.SetInitialStateAction.do(this.node, this.turingMachine);
                }
            }
        }
    }
    pointerLeave(e) {
        if (this.isDown) {
            if (this.node !== undefined) {
                this.edgeInCreation.remove();
                d3.selectAll(".node.closest-node").classed("closest-node", false);
                this.isDown = false;
            }
        }
    }
    pointerClick(e) {
        let target = e.target;
        let targetSelection = d3.select(target);
        if (this.node !== undefined && this.node instanceof StateNode_1.StateNode) {
            new NodeEditorPopup_1.NodeEditor(this.node, this.turingMachine);
        }
        else if (TransitionEdge_1.TransitionEdge.isTransitionEdge(targetSelection)) {
            new TransitionEdgeEditorPopup_1.TransitionEdgeEditor(TransitionEdge_1.TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
        else if (GeneratorEdge_1.GeneratorEdge.isGeneratorEdge(targetSelection)) {
            new GeneratorEdgeEditorPopup_1.GeneratorEdgeEditor(GeneratorEdge_1.GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine.stateMachine);
        }
    }
    drawEdgeInCreation() {
        this.edgeInCreation
            .attr("d", "M" + this.node.x + "," + this.node.y +
            " L" + this.previousX + "," + this.previousY);
    }
    closestNode(beginEdge, endEdge, minLength, distFromEnd) {
        let closestNode;
        let minDistance = distFromEnd;
        d3.selectAll(".node").each(function () {
            let node = Node_1.Node.getNode(d3.select(this));
            let point2 = {
                x: node.x, y: node.y
            };
            if (helpers_1.Helpers.distance2(endEdge, point2) < minDistance) {
                minDistance = helpers_1.Helpers.distance2(endEdge, point2);
                closestNode = node;
            }
        });
        if (helpers_1.Helpers.distance2(beginEdge, endEdge) < minLength) {
            return undefined;
        }
        return closestNode;
    }
}
exports.EdgeTool = EdgeTool;

},{"../../../helpers":26,"../../Graph":34,"../../actions/CreateTransitionAction":40,"../../actions/SetInitialStateAction":44,"../../edges/GeneratorEdge":48,"../../edges/TransitionEdge":49,"../../nodes/GeneratorNode":59,"../../nodes/Node":60,"../../nodes/StateNode":61,"../../popups/GeneratorEdgeEditorPopup":65,"../../popups/NodeEditorPopup":68,"../../popups/TransitionEdgeEditorPopup":71,"d3-selection":72}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToolBar_1 = require("./ToolBar");
const EdgeTool_1 = require("./EdgeTool");
const NodeTool_1 = require("./NodeTool");
const GraphEventDispatcher_1 = require("../GraphEventDispatcher");
var toolName;
(function (toolName) {
    toolName["NODE_TOOL"] = "nodeTool";
    toolName["EDGE_TOOL"] = "edgeTool";
})(toolName = exports.toolName || (exports.toolName = {}));
class MouseDispatcher extends GraphEventDispatcher_1.GraphEventDispatcher {
    constructor(graph, turingMachine) {
        super(graph, turingMachine);
        this.toolToInteraction = {};
        this.toolBar = new ToolBar_1.ToolBar(this);
        this.setTool(graph, turingMachine);
    }
    setTool(graph, turingMachine) {
        this.toolToInteraction[toolName.NODE_TOOL] = new NodeTool_1.NodeTool(graph, turingMachine);
        this.toolToInteraction[toolName.EDGE_TOOL] = new EdgeTool_1.EdgeTool(graph, turingMachine);
    }
    selectTool(tool) {
        this.selectedTool = tool;
    }
    getTool() {
        return this.selectedTool;
    }
    dispatchDownEvent(e) {
        super.dispatchDownEvent(e);
        this.toolToInteraction[this.selectedTool].pointerDown(e);
    }
    dispatchMoveEvent(e) {
        super.dispatchMoveEvent(e);
        this.toolToInteraction[this.selectedTool].pointerMove(e);
    }
    dispatchUpEvent(e) {
        super.dispatchUpEvent(e);
        this.toolToInteraction[this.selectedTool].pointerUp(e);
    }
    dispatchLeaveEvent(e) {
        super.dispatchLeaveEvent(e);
        this.toolToInteraction[this.selectedTool].pointerLeave(e);
    }
    dispatchClickEvent(e) {
        super.dispatchClickEvent(e);
        this.toolToInteraction[this.selectedTool].pointerClick(e);
    }
    activate() {
        super.activate();
        this.toolBar.display();
    }
    deactivate() {
        super.deactivate();
        this.toolBar.hide();
    }
}
exports.MouseDispatcher = MouseDispatcher;

},{"../GraphEventDispatcher":50,"./EdgeTool":55,"./NodeTool":57,"./ToolBar":58}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Graph_1 = require("../../Graph");
const CreateStateAction_1 = require("../../actions/CreateStateAction");
const TransitionEdge_1 = require("../../edges/TransitionEdge");
const StateNode_1 = require("../../nodes/StateNode");
const Node_1 = require("../../nodes/Node");
const GeneratorEdge_1 = require("../../edges/GeneratorEdge");
const helpers_1 = require("../../../helpers");
const MoveStateAction_1 = require("../../actions/MoveStateAction");
const NodeEditorPopup_1 = require("../../popups/NodeEditorPopup");
const TransitionEdgeEditorPopup_1 = require("../../popups/TransitionEdgeEditorPopup");
const GeneratorEdgeEditorPopup_1 = require("../../popups/GeneratorEdgeEditorPopup");
class NodeTool {
    constructor(graph, turingMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.bestPos = { x: 0, y: 0 };
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isDown = false;
    }
    pointerDown(e) {
        this.previousX = e.x;
        this.previousY = e.y;
        this.isDown = true;
        if (StateNode_1.StateNode.isStateNode(d3.select(e.target))) {
            this.node = StateNode_1.StateNode.getStateNode(d3.select(e.target));
            this.node.handleSelection.classed("move", true);
            this.node.handleSelection.raise();
            this.bestPos = { x: this.node.x, y: this.node.y };
            return;
        }
        if (d3.select(e.target).node().tagName === "svg") {
            this.node = undefined;
            this.previousX = e.pageX;
            this.previousY = e.pageY;
            return;
        }
        this.isDown = false;
    }
    pointerMove(e) {
        if (this.isDown) {
            if (this.node !== undefined) {
                this.node.translateBy(e.x - this.previousX, e.y - this.previousY);
                this.turingMachine
                    .stateMachine.getState(this.node.stateID)
                    .getInTransitions()
                    .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id).redrawTransitionEdge());
                this.turingMachine
                    .stateMachine.getState(this.node.stateID)
                    .getOutTransitions()
                    .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id).redrawTransitionEdge());
                if (this.node.isInitialNode()) {
                    this.graph.generatorEdge.redrawGeneratorEdge();
                }
                if (this.isThisBestPosForNode()) {
                    this.bestPos.x = this.node.x;
                    this.bestPos.y = this.node.y;
                    this.node.handleSelection.classed("bad-position", false);
                }
                else {
                    this.node.handleSelection.classed("bad-position", true);
                }
                this.previousX = e.x;
                this.previousY = e.y;
            }
            else {
                this.graph.translateViewBoxBy(e.pageX - this.previousX, e.pageY - this.previousY);
                this.previousX = e.pageX;
                this.previousY = e.pageY;
            }
        }
    }
    pointerUp(e) {
        if (this.node !== undefined) {
            this.node.handleSelection.classed("move", false);
            this.node.handleSelection.classed("bad-position", false);
            MoveStateAction_1.MoveStateAction.do(this.node, this.bestPos.x, this.bestPos.y, this.turingMachine);
            this.node = undefined;
        }
        this.isDown = false;
    }
    pointerLeave(e) {
        this.pointerUp(e);
    }
    pointerClick(e) {
        let target = e.target;
        let targetSelection = d3.select(target);
        if (d3.select(target).property("tagName") === "svg") {
            CreateStateAction_1.CreateStateAction.do(e.x, e.y, this.turingMachine);
        }
        else if (StateNode_1.StateNode.isStateNode(targetSelection)) {
            new NodeEditorPopup_1.NodeEditor(StateNode_1.StateNode.getStateNode(targetSelection), this.turingMachine);
        }
        else if (TransitionEdge_1.TransitionEdge.isTransitionEdge(targetSelection)) {
            new TransitionEdgeEditorPopup_1.TransitionEdgeEditor(TransitionEdge_1.TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
        else if (GeneratorEdge_1.GeneratorEdge.isGeneratorEdge(targetSelection)) {
            new GeneratorEdgeEditorPopup_1.GeneratorEdgeEditor(GeneratorEdge_1.GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine.stateMachine);
        }
    }
    isThisBestPosForNode() {
        let isBestPos = true;
        let node = this.node;
        d3.selectAll(".node").each(function () {
            let thisNode = Node_1.Node.getNode(d3.select(this));
            if (thisNode.id !== node.id && isBestPos) {
                isBestPos = helpers_1.Helpers.distance2({ x: node.x, y: node.y }, { x: thisNode.x, y: thisNode.y }) >= Graph_1.Graph.sizeNode * 2;
            }
        });
        return isBestPos;
    }
}
exports.NodeTool = NodeTool;

},{"../../../helpers":26,"../../Graph":34,"../../actions/CreateStateAction":39,"../../actions/MoveStateAction":43,"../../edges/GeneratorEdge":48,"../../edges/TransitionEdge":49,"../../nodes/Node":60,"../../nodes/StateNode":61,"../../popups/GeneratorEdgeEditorPopup":65,"../../popups/NodeEditorPopup":68,"../../popups/TransitionEdgeEditorPopup":71,"d3-selection":72}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const MouseDispatcher_1 = require("./MouseDispatcher");
class ToolBar {
    constructor(toolManager) {
        this.toolManager = toolManager;
        d3.select("#toolbar").selectAll("*").remove();
        this.setupUI();
    }
    setupUI() {
        this.nodeToolButton = this.addButton("node-button", "State tool");
        this.edgeToolButton = this.addButton("edge-button", "Transition tool");
        this.setInteraction();
        this.selectTool(MouseDispatcher_1.toolName.NODE_TOOL, this.nodeToolButton);
    }
    setInteraction() {
        this.nodeToolButton.on("click", () => {
            this.selectTool(MouseDispatcher_1.toolName.NODE_TOOL, this.nodeToolButton);
        });
        this.edgeToolButton.on("click", () => {
            this.selectTool(MouseDispatcher_1.toolName.EDGE_TOOL, this.edgeToolButton);
        });
    }
    addButton(id, description) {
        return d3.select("#toolbar")
            .append("button")
            .attr("id", id)
            .attr("title", description);
    }
    selectTool(tool, buttonToSelect) {
        d3.select("#toolbar").selectAll("button").classed("selected", false);
        buttonToSelect.classed("selected", true);
        this.toolManager.selectTool(tool);
    }
    display() {
        d3.select("#toolbar").classed("hidden", false);
    }
    hide() {
        d3.select("#toolbar").classed("hidden", true);
    }
}
exports.ToolBar = ToolBar;

},{"./MouseDispatcher":56,"d3-selection":72}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const generator_1 = require("../custom-shapes/generator");
const Node_1 = require("./Node");
class GeneratorNode extends Node_1.Node {
    constructor(graph) {
        super(graph);
        this.graph = graph;
        this.initGeneratorNode();
    }
    initGeneratorNode() {
        super.init();
        let viewbox = this.graph.getSVG().attr("viewBox").split(",");
        this.translateTo(Graph_1.Graph.sizeNode + 10, parseInt(viewbox[3]) / 2);
        this.handleSelection.attr("id", "generator");
        generator_1.addGenerator(this.handleSelection, Graph_1.Graph.sizeNode);
    }
    static isGenerator(selection) {
        if (Node_1.Node.isNode(selection)) {
            if (Node_1.Node.getNode(selection) instanceof GeneratorNode) {
                return true;
            }
        }
        return false;
    }
    static getGeneratorHandle(selection) {
        if (Node_1.Node.isNode(selection)) {
            let node = Node_1.Node.getNode(selection);
            if (node instanceof GeneratorNode) {
                return node;
            }
        }
        throw "GeneratorNode.ts (getGeneratorHandle): Selection is not part of a generatorNode";
    }
}
exports.GeneratorNode = GeneratorNode;

},{"../Graph":34,"../custom-shapes/generator":45,"./Node":60}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
class Node {
    constructor(graph) {
        this.id = "node-" + Node.nodeNumber;
        this.graph = graph;
        Node.nodeNumber += 1;
        this.handleSelection =
            graph.getNodesGroup()
                .append("g")
                .classed("node", true)
                .datum({ node: this })
                .attr("id", this.id);
        this.x = 0;
        this.y = 0;
    }
    init() { }
    translateTo(x, y) {
        this.x = x;
        this.y = y;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }
    translateBy(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.handleSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }
    delete() {
        this.handleSelection.remove();
    }
    validate() {
        this.handleSelection.classed("not-valid", false);
    }
    invalidate() {
        this.handleSelection.classed("not-valid", true);
    }
    static isNode(selection) {
        let element = selection.node();
        while (element.tagName !== "svg" && element !== undefined && element !== null) {
            if (d3.select(element).classed("node")) {
                return true;
            }
            element = element.parentNode;
        }
        return false;
    }
    static getNode(selection) {
        let element = selection.node();
        while (element.tagName !== "svg" && element !== undefined && element !== null) {
            if (d3.select(element).classed("node")) {
                return d3.select(element).datum()["node"];
            }
            element = element.parentNode;
        }
        throw "Graph.ts (getNodeHandle): Selection is not part of a node";
    }
}
exports.Node = Node;
Node.nodeNumber = 0;

},{"d3-selection":72}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = require("../Graph");
const d3 = require("d3-selection");
const lamps_1 = require("../custom-shapes/lamps");
const Node_1 = require("./Node");
var StateNodeType;
(function (StateNodeType) {
    StateNodeType["STANDARD"] = "standard";
    StateNodeType["START"] = "start";
    StateNodeType["FINAL"] = "final";
})(StateNodeType = exports.StateNodeType || (exports.StateNodeType = {}));
class StateNode extends Node_1.Node {
    constructor(graph, state) {
        super(graph);
        this.stateID = state.id;
        this.initStateNode(state);
    }
    initStateNode(state) {
        super.init();
        let position = state.getPosition();
        this.handleSelection.classed("state-node", true);
        this.handleSelection.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", Graph_1.Graph.sizeNode + 2)
            .classed("shadow", true);
        lamps_1.addLamp(this.handleSelection, "nodeCircle");
        this.handleSelection.on("animationend", () => {
            this.handleSelection.classed("created", false);
            this.handleSelection.select(".shadow").remove();
        });
        this.handleSelection.classed("created", true);
        this.setLabel(state.getLabel());
        this.translateTo(position.x, position.y);
    }
    static isStateNode(selection) {
        if (Node_1.Node.isNode(selection)) {
            if (Node_1.Node.getNode(selection) instanceof StateNode) {
                return true;
            }
        }
        return false;
    }
    static getStateNode(selection) {
        if (Node_1.Node.isNode(selection)) {
            let node = Node_1.Node.getNode(selection);
            if (node instanceof StateNode) {
                return node;
            }
        }
        throw "StateNode.ts (getStateNode): Selection is not part of a stateNode";
    }
    isInitialNode() {
        return this.handleSelection.classed("start");
    }
    setInitialNode(isInital) {
        this.handleSelection.classed("start", isInital);
    }
    setFinalNode(isFinal) {
        this.handleSelection.classed("final", isFinal);
    }
    static resetCurrentNode() {
        d3.selectAll(".current").classed("current", false);
    }
    setCurrentNode() {
        StateNode.resetCurrentNode();
        this.handleSelection.classed("current", true);
    }
    setLabel(label) {
        let textToDisplay = label;
        if (textToDisplay.length > 10) {
            textToDisplay = textToDisplay.substring(0, 7) + "...";
        }
        this.handleSelection.select("#label-text").text(textToDisplay);
    }
    invalidate() {
        super.invalidate();
        let transitions = this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions();
        let edge;
        if (transitions !== undefined && transitions !== null) {
            transitions.forEach((t) => {
                edge = this.graph.transitionIdToTransitionEdge.get(t.id);
                if (edge !== undefined && edge !== null) {
                    edge.invalidate();
                }
            });
        }
    }
    validate() {
        super.validate();
        let transitions = this.graph.turingMachine.stateMachine.getState(this.stateID).getOutTransitions();
        let edge;
        if (transitions !== undefined && transitions !== null) {
            transitions.forEach((t) => {
                edge = this.graph.transitionIdToTransitionEdge.get(t.id);
                if (edge !== undefined && edge !== null) {
                    edge.validate();
                }
            });
        }
    }
    updateValidateProperty() {
        if (this.graph.turingMachine.stateMachine.getState(this.stateID).isDeterministic()) {
            this.validate();
        }
        else {
            this.invalidate();
        }
    }
}
exports.StateNode = StateNode;

},{"../Graph":34,"../custom-shapes/lamps":46,"./Node":60,"d3-selection":72}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Popup_1 = require("./Popup");
class Editor extends Popup_1.Popup {
    constructor(element) {
        super();
        this.element = element;
        d3.selectAll(".node, .edge").classed("selected", false);
        this.setOnClose(() => { });
    }
    initPosition() {
        let elementBoudingBox = this.element.handleSelection.node().getBoundingClientRect();
        let editorBoundingBox = this.holder.node().getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let top = elementBoudingBox.top + elementBoudingBox.height;
        let left = elementBoudingBox.left + (elementBoudingBox.width - editorBoundingBox.width) / 2;
        if (top < 0) {
            top = 0;
        }
        if (left < 0) {
            left = 0;
        }
        if (left + editorBoundingBox.width > windowWidth) {
            left = windowWidth - editorBoundingBox.width;
        }
        this.holder
            .style("top", (top).toString() + "px")
            .style("left", (left).toString() + "px");
        let maxHeight = windowHeight - this.content.node().getBoundingClientRect().top;
        this.setMaxHeightContent(maxHeight);
    }
    addLabel(text, forAttribute, parent = this.content) {
        let label = parent
            .append("label")
            .attr("for", forAttribute)
            .text(text);
    }
    addButton(text, callback, id = null, classElement = null, parent = this.content) {
        let button = parent
            .append("button")
            .on("click", callback)
            .text(text);
        if (id !== null) {
            button.attr("id", id);
        }
        if (id !== null) {
            button.classed(classElement, true);
        }
    }
    addTextField(value, attributes, parent = this.content) {
        let textField = parent
            .append("input")
            .attr("type", "text")
            .attr("value", value);
        if (attributes["class"] !== undefined) {
            let classes = attributes["class"].split(" ");
            delete attributes["class"];
            for (let className of classes) {
                textField.classed(className, true);
            }
        }
        for (let attrKey of Object.keys(attributes)) {
            let attrValue = attributes[attrKey];
            textField.attr(attrKey, attrValue);
        }
    }
    setOnClose(onClose) {
        super.setOnClose(() => {
            onClose();
        });
    }
}
exports.Editor = Editor;

},{"./Popup":69,"d3-selection":72}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class ErrorPopup extends Popup_1.Popup {
    constructor(error) {
        super();
        this.error = error;
        this.init();
    }
    init() {
        this.setTitle(this.error.getName());
        this.holder.classed("error-popup", true);
        this.createProblemDescription();
        this.createSolutionDescription();
        this.center();
    }
    createProblemDescription() {
        this.content.append("h3")
            .text("Problem");
        this.content.append("p")
            .html(this.error.getProblem());
    }
    createSolutionDescription() {
        this.content.append("h3")
            .text("Solution");
        this.content.append("p")
            .html(this.error.getSolution());
    }
}
exports.ErrorPopup = ErrorPopup;

},{"./Popup":69}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class ExportPopup extends Popup_1.Popup {
    constructor(turingMachine) {
        super();
        this.turingMachine = turingMachine;
        this.init();
    }
    init() {
        this.setTitle("Export your Turing machine");
        this.holder.attr("id", "export-popup");
        this.addInstructions();
        this.addExportField();
        this.center();
    }
    addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Copy the code</strong> below to <strong>share</strong> your Turing machine with other people!<br>Anyone can load it by using the Import button in the top bar.");
    }
    addExportField() {
        this.content.append("textarea")
            .attr("id", "turing-machine-export-field")
            .property("readOnly", true)
            .text(this.turingMachine.exportToJSON());
    }
}
exports.ExportPopup = ExportPopup;

},{"./Popup":69}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EditorPopup_1 = require("./EditorPopup");
class GeneratorEdgeEditor extends EditorPopup_1.Editor {
    constructor(edge, stateMachine) {
        super(edge);
        this.edge = edge;
        this.stateMachine = stateMachine;
        this.init();
    }
    init() {
        this.setTitle("Edge from the generator");
        this.holder.attr("id", "generator-edge-editor");
        this.addButtons();
        this.initPosition();
    }
    addButtons() {
        let container = this.content.append("div")
            .classed("action-button-container", true);
        this.addButton("Delete", () => {
            this.stateMachine.resetInitialState();
            this.close();
        }, "", "delete", container);
        this.addButton("Cancel", () => {
            this.close();
        }, "", "cancel", container);
    }
}
exports.GeneratorEdgeEditor = GeneratorEdgeEditor;

},{"./EditorPopup":62}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class ImportPopup extends Popup_1.Popup {
    constructor(main) {
        super();
        this.main = main;
        this.init();
    }
    init() {
        this.setTitle("Import a Turing machine");
        this.holder.attr("id", "import-popup");
        this.addInstructions();
        this.addImportField();
        this.addActionButtons();
        this.center();
    }
    addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("<strong>Paste the code</strong> of an exported Turing machine below and <strong>click the Import button</strong> to import the machine.");
        this.content.append("p")
            .classed("instruction", true)
            .classed("warning", true)
            .html("<strong>Be careful:</strong> importing a machine will <strong>replace your current machine</strong>!");
    }
    addImportField() {
        this.content.append("textarea")
            .attr("id", "turing-machine-import-field")
            .attr("placeholder", "Code of the Turing machine to import...");
    }
    addActionButtons() {
        let container = this.content.append("div")
            .attr("class", "action-button-container");
        container.append("button")
            .classed("import-button", true)
            .text("Import")
            .on("click", () => {
            this.importTuringMachine();
        });
        container.append("button")
            .classed("cancel-button", true)
            .text("Cancel")
            .on("click", () => {
            this.close();
        });
    }
    importTuringMachine() {
        let importFieldNode = this.holder.select("#turing-machine-import-field").node();
        let json = importFieldNode.value;
        if (json.length === 0) {
            return;
        }
        try {
            this.main.setTuringMachineFromImport(json);
            this.close();
        }
        catch (exception) {
            console.error("The Turing machine could not be imported: import from JSON failed.");
            console.log(exception);
        }
    }
}
exports.ImportPopup = ImportPopup;

},{"./Popup":69}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class LoadExamplePopup extends Popup_1.Popup {
    constructor(main) {
        super();
        this.main = main;
        this.init();
    }
    init() {
        this.setTitle("Load an example machine");
        this.holder.attr("id", "load-example-machine-popup");
        this.initExamples();
        this.addExampleList();
        this.center();
    }
    initExamples() {
        this.examples = [
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
    addExampleList() {
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
exports.LoadExamplePopup = LoadExamplePopup;

},{"./Popup":69}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteStateAction_1 = require("../actions/DeleteStateAction");
const EditorPopup_1 = require("./EditorPopup");
class NodeEditor extends EditorPopup_1.Editor {
    constructor(node, turingMachine) {
        super(node);
        this.node = node;
        this.turingMachine = turingMachine;
        this.init();
    }
    init() {
        this.holder.classed("node-editor", true);
        this.setTitle("Edit state");
        this.initContent();
        super.setOnClose(() => {
            let label = this.content.select("#node-set-label-field").node().value;
            this.turingMachine.stateMachine.getState(this.node.stateID).setLabel(label);
        });
        this.initPosition();
    }
    initContent() {
        let self = this;
        this.addLabel("Label", "node-set-label-field");
        this.addTextField(this.turingMachine.stateMachine.getState(this.node.stateID).getLabel(), {
            id: "node-set-label-field",
            placeholder: "Label of the node"
        });
        this.addLabel("Final state", "node-set-final-button");
        this.addButton("", () => {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            let newFinalState = !state.isFinal();
            state.setFinal(newFinalState);
            this.updateFinalButton(newFinalState);
        }, "node-set-final-button");
        this.updateFinalButton();
        this.addLabel("Delete", "node-delete-button");
        this.addButton("Delete", () => { this.deleteNode(); }, "node-delete-button");
    }
    updateFinalButton(stateIsFinal) {
        if (stateIsFinal === undefined) {
            let state = this.turingMachine.stateMachine.getState(this.node.stateID);
            stateIsFinal = state.isFinal();
        }
        this.content.select("#node-set-final-button")
            .text(stateIsFinal ? "Turn off" : "Turn on");
    }
    deleteNode() {
        DeleteStateAction_1.DeleteStateAction.do(this.node, this.turingMachine);
        this.setOnClose(() => { });
        super.close();
    }
}
exports.NodeEditor = NodeEditor;

},{"../actions/DeleteStateAction":41,"./EditorPopup":62}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
class Popup {
    constructor() {
        this.holder = d3.select("body").append("div").classed("popup", true);
        this.initMask();
        this.initUI();
        this.onClose = () => { };
        this.title = "";
    }
    initUI() {
        let t = this;
        let titleBar = this.holder.append("div")
            .classed("popup-titlebar", true);
        titleBar.append("h2")
            .classed("popup-title", true);
        titleBar.append("button")
            .classed("popup-close-button", true)
            .on("click", () => { t.close(); })
            .text("Close");
        this.content = this.holder.append("div")
            .classed("popup-content", true);
    }
    initMask() {
        let t = this;
        this.maskBackground =
            d3.select("body")
                .append("div")
                .classed("background-mask", true)
                .on("click", () => { t.close(); });
    }
    setTitle(title) {
        this.title = title;
        this.holder.select(".popup-title").text(this.title);
    }
    setMaxHeightContent(maxHeight) {
        let computedStyle = window.getComputedStyle(this.content.node(), null);
        let paddingTop = parseInt(computedStyle.getPropertyValue("padding-top"));
        let paddingBottom = parseInt(computedStyle.getPropertyValue("padding-bottom"));
        this.content.style("max-height", (maxHeight - paddingTop - paddingBottom).toString() + "px");
    }
    center() {
        let popupBoundingBox = this.holder.node().getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let top = (windowHeight / 2) - (popupBoundingBox.height / 2);
        let left = (windowWidth / 2) - (popupBoundingBox.width / 2);
        this.holder
            .style("top", top.toString() + "px")
            .style("left", left.toString() + "px");
    }
    close() {
        this.maskBackground.remove();
        this.holder.remove();
        this.onClose();
    }
    setOnClose(onClose) {
        this.onClose = onClose;
    }
}
exports.Popup = Popup;

},{"d3-selection":72}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Popup_1 = require("./Popup");
class TapeContentEditorPopup extends Popup_1.Popup {
    constructor(tape) {
        super();
        this.tape = tape;
        this.init();
    }
    init() {
        this.setTitle("Edit the tape");
        this.holder.attr("id", "tape-content-editor-popup");
        this.addInstructions();
        this.addContentField();
        this.addActionButtons();
        this.center();
    }
    addInstructions() {
        this.content.append("p")
            .classed("instruction", true)
            .html("Edit the content of the tape and click the Update tape below to apply your changes.");
    }
    addContentField() {
        this.content.append("textarea")
            .attr("id", "tape-content-edit-field")
            .attr("placeholder", "Content of the tape...")
            .text(this.tape.getContentAsString());
    }
    addActionButtons() {
        let container = this.content.append("div")
            .attr("class", "action-button-container");
        container.append("button")
            .classed("update-button", true)
            .text("Update tape")
            .on("click", () => {
            this.updateTapeContent();
        });
        container.append("button")
            .classed("cancel-button", true)
            .text("Cancel")
            .on("click", () => {
            this.close();
        });
    }
    updateTapeContent() {
        let tapeContentFieldNode = this.holder.select("#tape-content-edit-field").node();
        this.tape.setContentFromString(tapeContentFieldNode.value);
        this.close();
    }
}
exports.TapeContentEditorPopup = TapeContentEditorPopup;

},{"./Popup":69}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Tape_1 = require("../../model/Tape");
const Transition_1 = require("../../model/Transition");
const EditorPopup_1 = require("./EditorPopup");
const CreateTransitionAction_1 = require("../actions/CreateTransitionAction");
class TransitionEdgeEditor extends EditorPopup_1.Editor {
    constructor(edge, turingMachine) {
        super(edge);
        this.edge = edge;
        this.turingMachine = turingMachine;
        this.stateMachine = turingMachine.stateMachine;
        this.init();
    }
    init() {
        this.holder.classed("transition-edge-editor", true);
        this.setTitle("Edit transition" + (this.edge.transitionIDs.length > 1 ? "s" : ""));
        this.initContent();
        this.initPosition();
        super.setOnClose(() => { this.submit(); });
    }
    initContent() {
        let table = this.content.append("table");
        this.addHeader(table);
        this.addBody(table);
    }
    addHeader(table) {
        let header = table.append("thead").append("tr");
        header.append("th").classed("input-symbol", true).text("Input symbol");
        header.append("th").classed("output-symbol", true).text("Output symbol");
        header.append("th").classed("head-action", true).text("Head direction");
        header.append("th").classed("delete-transition", true).text("Delete transition");
    }
    addBody(table) {
        let body = table.append("tbody");
        this.edge.transitionIDs.forEach((transitionId) => {
            this.addTransitionRow(transitionId, body);
        });
        this.addPlusButton(body);
    }
    addTransitionRow(transitionId, body) {
        let transition = this.stateMachine.getTransition(transitionId);
        let row = body.append("tr").datum({ transitionID: transitionId });
        let cell;
        cell = row.append("td").classed("input-symbol", true);
        this.addTextField(transition.getInputSymbol(), {
            placeholder: "Any",
            maxlength: "1"
        }, cell);
        cell = row.append("td").classed("output-symbol", true);
        this.addTextField(transition.getOutputSymbol(), {
            placeholder: "None",
            maxlength: "1"
        }, cell);
        cell = row.append("td").classed("head-action", true);
        this.addHeadActionSelector(cell, transition.getHeadAction());
        cell = row.append("td").classed("delete-transition", true);
        this.addDeleteTransitionButton(cell, row);
    }
    addPlusButton(body) {
        let originNode = this.edge.originNode;
        let destinationNode = this.edge.destinationNode;
        let row = body.append("tr")
            .classed("new-transition-button-row", true);
        row.append("td")
            .attr("colspan", "4")
            .append("button")
            .text("New transition")
            .on("click", () => {
            this.submit();
            CreateTransitionAction_1.CreateTransitionAction.do(originNode, destinationNode, this.turingMachine);
            body.remove();
            this.addBody(this.content.select("table"));
        });
    }
    addDeleteTransitionButton(parent, row) {
        parent
            .append("button")
            .on("click", () => {
            this.stateMachine.removeTransition(parent.datum()["transitionID"]);
            row.remove();
            if (this.holder.select("tbody").selectAll("tr:not(.new-transition-button-row)").empty()) {
                this.close();
            }
        })
            .text("Delete");
    }
    addHeadActionSelector(parent, defaultDir) {
        let dirEntry = parent
            .append("div")
            .classed("head-action-selector", true);
        dirEntry.datum()["direction"] = defaultDir;
        this.addHeadActionOption(dirEntry, "←", Tape_1.HeadAction.MoveLeft, defaultDir === Tape_1.HeadAction.MoveLeft);
        this.addHeadActionOption(dirEntry, "∅", Tape_1.HeadAction.None, defaultDir === Tape_1.HeadAction.None);
        this.addHeadActionOption(dirEntry, "→", Tape_1.HeadAction.MoveRight, defaultDir === Tape_1.HeadAction.MoveRight);
    }
    addHeadActionOption(parent, text, datum, selected) {
        parent.append("button")
            .text(text)
            .classed("selected", selected)
            .on("click", function () {
            parent.selectAll(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            parent.datum()["direction"] = datum;
        });
    }
    submit() {
        let t = this;
        this.holder.select("tbody").selectAll("tr:not(.new-transition-button-row)").each(function (d) {
            let row = d3.select(this);
            let transition = t.stateMachine.getTransition(d["transitionID"]);
            let inputSymbol = row.select(".input-symbol").select("input").node().value;
            transition.setInputSymbol(inputSymbol === "" ? Transition_1.READ_ANY_SYMBOL : inputSymbol);
            let outputSymbol = row.select(".output-symbol").select("input").node().value;
            transition.setOutputSymbol(outputSymbol === "" ? Transition_1.WRITE_NO_SYMBOL : outputSymbol);
            let headAction = row.select(".head-action").select(".selected").datum()["direction"];
            transition.setHeadAction(headAction);
        });
    }
}
exports.TransitionEdgeEditor = TransitionEdgeEditor;

},{"../../model/Tape":30,"../../model/Transition":31,"../actions/CreateTransitionAction":40,"./EditorPopup":62,"d3-selection":72}],72:[function(require,module,exports){
// https://d3js.org/d3-selection/ v1.4.0 Copyright 2019 Mike Bostock
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection$$1) {

  for (var groups0 = this._groups, groups1 = selection$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
}

function selection_cloneDeep() {
  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

exports.event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = exports.event; // Events can be reentrant (e.g., focus).
    exports.event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = exports.event;
  event1.sourceEvent = exports.event;
  exports.event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function create(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent() {
  var current = exports.event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}

function point(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
}

function touch(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}

function touches(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
}

exports.create = create;
exports.creator = creator;
exports.local = local;
exports.matcher = matcher;
exports.mouse = mouse;
exports.namespace = namespace;
exports.namespaces = namespaces;
exports.clientPoint = point;
exports.select = select;
exports.selectAll = selectAll;
exports.selection = selection;
exports.selector = selector;
exports.selectorAll = selectorAll;
exports.style = styleValue;
exports.touch = touch;
exports.touches = touches;
exports.window = defaultView;
exports.customEvent = customEvent;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}]},{},[27]);
