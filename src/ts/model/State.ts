import { Transition, TransitionID } from './Transition';
import { TapeSymbol } from './Tape';


export type StateID = number;


export class State {

    private static nextStateID = 1;

    readonly id: StateID;
    label: string;
    isFinal: boolean;

    private inTransitions: Map<TransitionID, Transition>;
    private outTransitions: Map<TransitionID, Transition>;
    private symbolsToOutTransitions: Map<TapeSymbol, Transition>;


    constructor(label: string, isFinal: boolean = false) {
        this.id = State.nextStateID;
        State.nextStateID++;

        this.label = label;
        this.isFinal = isFinal;

        this.inTransitions = new Map();
        this.outTransitions = new Map();
        this.symbolsToOutTransitions = new Map();
    }

    addInTransition(transition: Transition) {
        if (transition.toState !== this) {
            console.error("The transition could not be added: state and destination do not match.");
            return;
        }

        this.inTransitions.set(transition.id, transition);
    }

    removeInTransition(transition: Transition) {
        let id = transition.id;
        if (! this.inTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }
        
        this.inTransitions.delete(transition.id);
    }

    addOutTransition(transition: Transition) {
        if (transition.fromState !== this) {
            console.error("The transition could not be added: state and origin do not match.");
            return;
        }

        this.outTransitions.set(transition.id, transition);
        this.symbolsToOutTransitions.set(transition.onSymbol, transition);
    }

    removeOutTransition(transition: Transition) {
        let id = transition.id;
        if (! this.outTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }

        this.outTransitions.delete(id);
        this.symbolsToOutTransitions.delete(transition.onSymbol);    
    }

    hasOutTransitionForSymbol(symbol: TapeSymbol) {
        return this.symbolsToOutTransitions.has(symbol);
    }

    getOutTransitionForSymbol(symbol: TapeSymbol) {
        return this.symbolsToOutTransitions.get(symbol);
    }

    getInTransitions(): Transition[] {
        return [...this.inTransitions.values()];
    }

    getOutTransitions(): Transition[] {
        return [...this.outTransitions.values()];
    }

    toString(useLabels: boolean = true) {
        return useLabels ? this.label : this.id;
    }

    outTransitionsToString(useLabels: boolean = true) {
        return [...this.outTransitions.values()]
            .map((t) => t.toString(useLabels))
            .reduce((str, t) => str + "\n" + t, "");
    }
}
