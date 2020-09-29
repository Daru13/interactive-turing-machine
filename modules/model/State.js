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
//# sourceMappingURL=State.js.map