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
//# sourceMappingURL=TuringMachine.js.map