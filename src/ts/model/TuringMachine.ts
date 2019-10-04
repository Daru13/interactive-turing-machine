import { Tape } from "./Tape";
import { StateMachine } from './StateMachine';


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
            return false;
        }

        let transitions = currentState.getOutTransitionsForSymbol(currentSymbol);
        if (transitions.length > 1) {
            console.error("The machine could not be ran: nondeterministic state-machine.");
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

    toString(useLabels: boolean = true) {
        let str = "";

        str += "=== STATE MACHINE ===\n"
        str += this.stateMachine.toString(useLabels);

        str += "=== MEMORY TAPE ===\n"
        str += this.tape.toString();

        return str;
    }
}