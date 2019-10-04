import { Transition, TransitionID } from './Transition';
import { TapeSymbol } from './Tape';
import { EventManager } from '../events/EventManager';
import { EditStateEvent } from '../events/EditStateEvent';
import { transition, symbol } from 'd3';


export type StateID = number;


export class State {

    private static nextStateID = 1;

    readonly id: StateID;
    private label: string;
    private final: boolean;

    private inTransitions: Map<TransitionID, Transition>;
    private outTransitions: Map<TransitionID, Transition>;
    private symbolsToOutTransitions: Map<TapeSymbol, Set<Transition>>;


    constructor(label: string, final: boolean = false) {
        this.id = State.nextStateID;
        State.nextStateID++;

        this.label = label;
        this.final = final;

        this.inTransitions = new Map();
        this.outTransitions = new Map();
        this.symbolsToOutTransitions = new Map();
    }

    getLabel(): string {
        return this.label;
    }

    setLabel(label: string) {
        this.label = label;
        
        EventManager.emit(new EditStateEvent(this));
    }

    isFinal(): boolean {
        return this.final;
    }

    setFinal(final: boolean) {
        this.final = final;
        
        EventManager.emit(new EditStateEvent(this));
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


        let onSymbol = transition.getOnSymbol();
        if (! this.symbolsToOutTransitions.has(onSymbol)) {
            this.symbolsToOutTransitions.set(onSymbol, new Set());
        }

        this.symbolsToOutTransitions.get(transition.getOnSymbol()).add(transition);
        this.outTransitions.set(transition.id, transition);
    }

    removeOutTransition(transition: Transition) {
        let id = transition.id;
        if (! this.outTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }

        let onSymbol = transition.getOnSymbol();
        let transitions = this.symbolsToOutTransitions.get(onSymbol);

        transitions.delete(transition);
        this.outTransitions.delete(id);

        if (this.symbolsToOutTransitions.get(onSymbol).size === 0) {
            this.symbolsToOutTransitions.delete(onSymbol);
        }
    }

    hasOutTransitionForSymbol(symbol: TapeSymbol) {
        return this.symbolsToOutTransitions.has(symbol);
    }

    getOutTransitionsForSymbol(symbol: TapeSymbol) {
        return [...this.symbolsToOutTransitions.get(symbol)];
    }

    editOutTransitionSymbol(transition: Transition, oldSymbol: TapeSymbol, newSymbol: TapeSymbol) {
        if (oldSymbol === newSymbol) {
            return;
        }

        let oldSymbolTransitions = this.symbolsToOutTransitions.get(oldSymbol);
        oldSymbolTransitions.delete(transition);

        if (oldSymbolTransitions.size === 0) {
            this.symbolsToOutTransitions.delete(oldSymbol);
        }

        if (! this.symbolsToOutTransitions.has(newSymbol)) {
            this.symbolsToOutTransitions.set(newSymbol, new Set())
        }
        
        this.symbolsToOutTransitions.get(newSymbol).add(transition);
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
