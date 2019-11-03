import { Tape, TapeExport } from "./Tape";
import { StateMachine, StateMachineExport } from './StateMachine';
import { NoInitialStateError } from "../errors/NoInitialStateError";
import { NoTransitionAvailableError } from "../errors/NoTransitionAvailableError";
import { NonDeterministicError } from "../errors/NonDeterministicError";
import { WRITE_NO_SYMBOL } from './Transition';

export enum TuringMachineState {
    READY = "Ready",      // before first step
    RUNNING = "Running",  // currently running
    STOPPED = "Stopped",  // final state reached
    FAULTY = "Faulty"     // cannot be executed
}

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

    private currentStep: number;
    private state: TuringMachineState;
    
    constructor () {
        console.log("A Turing machine was created.");

        this.stateMachine = new StateMachine();
        this.tape = new Tape();

        this.currentStep = 1;
        this.state = TuringMachineState.READY;
    }

    getCurrentStep(): number {
        return this.currentStep;
    }

    getState(): TuringMachineState {
        return this.state;
    }

    isRunnable(): boolean {
        return this.state === TuringMachineState.READY
            || this.state === TuringMachineState.RUNNING;
    }

    runOneStep() {
        // If the machine has not be ran yet, set the initial state as the current one
        let currentState = this.stateMachine.getCurrentState();

        if (currentState === null) {
            let initialState = this.stateMachine.getInitialState();
            if (initialState === null) {
                this.state = TuringMachineState.FAULTY;

                console.error("The machine could not be ran: no initial state.");
                throw new NoInitialStateError(this);
            }

            currentState = initialState;
        }

        // Check and update the state of the machine
        if (this.state === TuringMachineState.STOPPED) {
            return;
        }

        this.state = TuringMachineState.RUNNING;

        // Attempt to follow a transition
        let currentSymbol = this.tape.getCurrentSymbol();

        if (! currentState.hasOutTransitionForSymbol(currentSymbol)) {
            this.state = TuringMachineState.FAULTY;

            console.error("The machine could not be ran: no transition available.");
            throw new NoTransitionAvailableError(this, currentState);
        }

        let transitions = currentState.getOutTransitionsForSymbol(currentSymbol);
        if (transitions.length > 1) {
            this.state = TuringMachineState.FAULTY;

            console.error("The machine could not be ran: nondeterministic state-machine.");
            throw new NonDeterministicError(this, currentState, transitions);
        }

        // Update the machine according to the transition
        let transition = [...transitions.values()][0];
        let nextState = transition.toState;

        let outputSymbol = transition.getOutputSymbol();
        if (outputSymbol !== WRITE_NO_SYMBOL) {
            this.tape.setCurrentSymbol(outputSymbol);
        }
        this.tape.applyHeadAction(transition.getHeadAction());
        this.stateMachine.setCurrentState(nextState.id);

        this.currentStep++;
        this.state = nextState.isFinal() ? TuringMachineState.STOPPED : TuringMachineState.READY;
    }

    run(maxNbSteps: number = 1000) {
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