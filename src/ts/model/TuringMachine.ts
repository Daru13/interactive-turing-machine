import { Tape, TapeExport } from "./Tape";
import { StateMachine, StateMachineExport } from './StateMachine';
import { NoInitialStateError } from "../errors/NoInitialStateError";
import { NoTransitionAvailableError } from "../errors/NoTransitionAvailableError";
import { NonDeterministicError } from "../errors/NonDeterministicError";
import { WRITE_NO_SYMBOL } from './Transition';

/** The available states of the Turing machine. */
export enum TuringMachineState {
    READY = "Ready",      // before first step
    RUNNING = "Running",  // currently running
    STOPPED = "Stopped",  // final state reached
    FAULTY = "Faulty"     // cannot be executed
}

/**
 * An internal type used to modify the properties of a Turing machine.
 * It is required to set it from an exported machine.
 */
interface EditableTuringMachine extends TuringMachine {
    stateMachine: StateMachine;
    tape: Tape;
}

/** An exported Turing machine which can be serialised. */
interface TuringMachineExport {
    stateMachine: StateMachineExport;
    tape: TapeExport;
}

/**
 * A Turing machine.
 * It combines a state machine (logical core) and a tape (memory),
 * as well as an internal execution state (for simulation purposes).
 */
export class TuringMachine {
    /** The state machine of the Turing machine. */
    readonly stateMachine: StateMachine;

    /** The tape of the Turing machine. */
    readonly tape: Tape;

    /** The current execution step of the Turing machine. */
    private currentStep: number;

    /** The current state of the Turing machine. */
    private state: TuringMachineState;
    
    /**
     * Return a new instance of TuringMachine.
     */
    constructor() {
        console.log("A Turing machine was created.");

        this.stateMachine = new StateMachine();
        this.tape = new Tape();

        this.currentStep = 1;
        this.state = TuringMachineState.READY;
    }

    /**
     * Return the current execution step of the Turing machine.
     * 
     * @return The step (starting from 1).
     */
    getCurrentStep(): number {
        return this.currentStep;
    }

    /**
     * Return the current state of the Turing machine.
     */
    getState(): TuringMachineState {
        return this.state;
    }

    /**
     * Test whether the Turing machine can be ran for at least one more step or not.
     * 
     * @return `true` if it can be ran for one more step, `false` otherwise.
     */
    isRunnable(): boolean {
        return this.state === TuringMachineState.READY
            || this.state === TuringMachineState.RUNNING;
    }

    /**
     * Run one execution step of the Turing machine.
     * 
     * This method attempts to get the current state (or initialise it otherwise),
     * get the current symbol, find a single transition expecting this symbol as input,
     * apply the transition, and update the machine accordingly.
     * 
     * It can fail at several moments. In case of failure, an **error exception** is thrown:
     * - [[NoInitialStateError]] is thrown if there is no initial state;
     * - [[NoTransitionAvailableError]] is thrown if no transition match the current input symbol;
     * - [[NonDeterministicError]] is thrown if there are more than one matching transitions for
     *   the current input symbol (i.e. the state machine is non-deterministic).
     */
    runOneStep(): void {
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
        // If the current state is final or the machine has already stopped, nothing happens
        if (this.state === TuringMachineState.STOPPED) {
            return;
        }

        if (currentState.isFinal()) {
            this.state = TuringMachineState.STOPPED;
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
        let nextState = transition.destination;

        let outputSymbol = transition.getOutputSymbol();
        if (outputSymbol !== WRITE_NO_SYMBOL) {
            this.tape.setCurrentSymbol(outputSymbol);
        }
        this.tape.applyHeadAction(transition.getHeadAction());
        this.stateMachine.setCurrentState(nextState.id);

        this.currentStep++;
        this.state = nextState.isFinal() ? TuringMachineState.STOPPED : TuringMachineState.READY;
    }

    /** Execute the Turing machine (until it stops or for a maximum number of steps).
     * 
     * @param maxNbSteps The maximum number of execution steps.
     */
    run(maxNbSteps: number = 1000): void {
        let nbSteps = 0;

        while (this.isRunnable() && nbSteps < maxNbSteps) {
            this.runOneStep();
            nbSteps++;
        }
    }

    /**
     * Reset the Turing machine: the head position, the current state, the current step and the state.
     */
    reset(): void {
        this.tape.resetHeadPosition();
        this.stateMachine.resetCurrentState();

        this.currentStep = 0;
        this.state = TuringMachineState.READY;
    }

    /**
     * Empty the Turing machine: remove all states and transitions, and clear the tape content.
     */
    empty(): void {
        this.stateMachine.removeAllStates();
        this.stateMachine.removeAllTransitions();
        this.tape.clearContent();

        this.reset();
    }

    /**
     * Return a textual version of the Turing machine.
     * 
     * @param useLabels Use state labels instead of state IDs.
     * @return A string representing the Turing machine.
     */
    toString(useLabels: boolean = true): string {
        let str = "";

        str += "=== STATE MACHINE ===\n";
        str += this.stateMachine.toString(useLabels);

        str += "=== MEMORY TAPE ===\n";
        str += this.tape.toString();

        return str;
    }

    /**
     * Return an exportable version of the Turing machine.
     * 
     * The state machine and the tape content are exported,
     * but the current execution state of the Turing machine is not!
     * 
     * @return An export object describing the Turing machine.
     */
    export(): TuringMachineExport {
        let exportedStateMachine = this.stateMachine.export();
        let exportedTape = this.tape.export();

        return {
            stateMachine: exportedStateMachine,
            tape: exportedTape
        };
    }

    /**
     * Return an exportable version of the Turing machine as JSON (see [[export]]).
     * 
     * @return A JSON string representing the exported Turing machine.
     */
    exportToJSON(): string {
        return JSON.stringify(this.export());
    }

    /**
     * Create a Turing machine from the given export.
     * 
     * @param stateExport The exported Turing machine to instanciate.
     * @return A new TuringMachine instance based on the given import.
     */
    static fromExport(turingMachineExport: TuringMachineExport): TuringMachine {
        let turingMachine = new TuringMachine() as EditableTuringMachine;

        turingMachine.stateMachine = StateMachine.fromExport(turingMachineExport.stateMachine);
        turingMachine.tape = Tape.fromExport(turingMachineExport.tape);

        return turingMachine;
    }

    /**
     * Create a Turing machine from the given export in JSON (see [[fromExport]]).
     * 
     * @param json The exported Turing machine to instanciate in JSON.
     * @return A new TuringMachine instance based on the given export.
     */
    static fromJSONExport(json: string): TuringMachine {
        return TuringMachine.fromExport(JSON.parse(json));
    }
}