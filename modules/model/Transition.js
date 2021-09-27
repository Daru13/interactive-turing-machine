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
//# sourceMappingURL=Transition.js.map