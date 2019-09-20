import { Transition } from './Transition';
import { TapeSymbol } from './Tape';


export type StateID = number;


export class State {
    
    private static nextStateID = 1;

    readonly id: StateID;
    label: string;
    isFinal: boolean;

    private outTransitions: Map<TapeSymbol, Transition>;


    constructor(label: string, isFinal: boolean = false) {
        this.id = State.nextStateID;
        State.nextStateID++;

        this.label = label;
        this.isFinal = isFinal;

        this.outTransitions = new Map();
    }

    addTransition(transition: Transition) {
        if (transition.fromState !== this) {
            console.error("The transition could not be added: node and origin do not match.");
            return;
        }

        this.outTransitions.set(transition.onSymbol, transition);
    }

    removeTransition(transition: Transition) {
        if (transition.fromState !== this) {
            console.error("The transition could not be removed: node and origin do not match.");
            return;
        }

        this.outTransitions.delete(transition.onSymbol);
    }

    hasTransitionFor(symbol: TapeSymbol) {
        return this.outTransitions.has(symbol);
    }

    getTransitionFor(symbol: TapeSymbol) {
        return this.outTransitions.get(symbol);
    }

    toString(useLabels: boolean = true) {
        return useLabels ? this.label : this.id;
    }

    transitionsToString(useLabels: boolean = true) {
        return [...this.outTransitions.values()]
            .map((t) => t.toString(useLabels))
            .reduce((str, t) => str + "\n" + t, "");
    }
}