import { Tape, TapeExport } from "./Tape";
import { StateMachine, StateMachineExport } from './StateMachine';
import { NoInitialStateError } from "../errors/NoInitialStateError";
import { NoTransitionAvailableError } from "../errors/NoTransitionAvailableError";
import { NonDeterministicError } from "../errors/NonDeterministicError";

interface EditableTuringMachine extends TuringMachine {
    stateMachine: StateMachine
    tape: Tape;
}

interface TuringMachineExport {
    stateMachine: StateMachineExport;
    tape: TapeExport;
}

export class TuringMachine {

    readonly stateMachine: StateMachine
    readonly tape: Tape;
    
    constructor () {
        console.log("A Turing machine was created.");

        this.stateMachine = new StateMachine();
        this.tape = new Tape();
    }

    runOneStep(): boolean {
        // If the machine has not be ran yet, set the initial state as the current one
        let currentState = this.stateMachine.getCurrentState();

        if (currentState === null) {
            let initialState = this.stateMachine.getInitialState();
            if (initialState === null) {
                console.error("The machine could not be ran: no initial state.");
                throw new NoInitialStateError(this);
                return false;
            }

            currentState = initialState;
        }

        // Check if the current state is a final state
        if (currentState.isFinal()) {
            return false;
        }

        // Attempt to follow a transition
        let currentSymbol = this.tape.getCurrentSymbol();

        if (! currentState.hasOutTransitionForSymbol(currentSymbol)) {
            console.error("The machine could not be ran: no transition available.");
            throw new NoTransitionAvailableError(this, currentState);
            return false;
        }

        let transitions = currentState.getOutTransitionsForSymbol(currentSymbol);
        if (transitions.length > 1) {
            console.error("The machine could not be ran: nondeterministic state-machine.");
            throw new NonDeterministicError(this, currentState, transitions);
            return false;
        }

        // Update the machine according to the transition
        let transition = [...transitions.values()][0];
        let nextState = transition.toState;

        this.tape.setCurrentSymbol(transition.getOutputSymbol());
        this.tape.applyHeadAction(transition.getHeadAction());
        this.stateMachine.setCurrentState(nextState.id);

        // Only return true if the execution is finished (final state reached)
        return !nextState.isFinal;
    }

    run(maxNbSteps: number = 1000) {
        if (! this.stateMachine.isDeterministic()) {
            console.error("The machine could not be ran: nondeterministic state-machine.");
            return false;
        }

        let nbSteps = 0;
        let keepRunning = true;

        while (keepRunning && nbSteps < maxNbSteps) {
            keepRunning = this.runOneStep();
            nbSteps++;
        }

        return nbSteps;
    }

    reset() {
        this.tape.resetHeadPosition();
        this.stateMachine.resetCurrentState();
    }

    toString(useLabels: boolean = true) {
        let str = "";

        str += "=== STATE MACHINE ===\n"
        str += this.stateMachine.toString(useLabels);

        str += "=== MEMORY TAPE ===\n"
        str += this.tape.toString();

        return str;
    }

    export(): TuringMachineExport {
        let exportedStateMachine = this.stateMachine.export();
        let exportedTape =this.tape.export();

        return {
            stateMachine: exportedStateMachine,
            tape: exportedTape
        };
    }

    exportToJSON(): string {
        return JSON.stringify(this.export());
    }

    static fromExport(turingMachineExport: TuringMachineExport): TuringMachine {
        let turingMachine = new TuringMachine() as EditableTuringMachine;

        turingMachine.stateMachine = StateMachine.fromExport(turingMachineExport.stateMachine);
        turingMachine.tape = Tape.fromExport(turingMachineExport.tape);

        return turingMachine;
    }

    static fromJSONExport(json: string): TuringMachine {
        return TuringMachine.fromExport(JSON.parse(json));
    }
}