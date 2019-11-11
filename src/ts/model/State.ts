import { Transition, TransitionID, READ_ANY_SYMBOL } from './Transition';
import { TapeSymbol } from './Tape';
import { EventManager } from '../events/EventManager';
import { EditStateEvent } from '../events/EditStateEvent';
import { transition, symbol } from 'd3';
import { EditFinalStateEvent } from '../events/EditFinalStateEvent';


export type StateID = number;

export interface Position {
    x: number;
    y: number;
}

interface EditableState extends State {
    id: StateID;
}

export interface StateExport {
    readonly id: StateID;
    readonly position: Position;
    readonly label: string;
    readonly final: boolean;
}


export class State {

    private static nextStateID: StateID = 1;

    readonly id: StateID;
    private position: Position;
    private label: string;
    private final: boolean;

    private inTransitions: Map<TransitionID, Transition>;
    private outTransitions: Map<TransitionID, Transition>;
    private symbolsToOutTransitions: Map<TapeSymbol, Set<Transition>>;


    constructor(position: Position, label: string, final: boolean = false) {
        this.id = State.nextStateID;
        State.nextStateID++;

        this.position = position;
        this.label = label;
        this.final = final;

        this.inTransitions = new Map();
        this.outTransitions = new Map();
        this.symbolsToOutTransitions = new Map();
    }

    getPosition(): Position {
        return this.position;
    }

    setPosition(position: Position): void {
        this.position = position;
    }

    getLabel(): string {
        return this.label;
    }

    setLabel(label: string): void {
        this.label = label;
        
        EventManager.emit(new EditStateEvent(this));
    }

    isFinal(): boolean {
        return this.final;
    }

    setFinal(final: boolean): void {
        this.final = final;

        EventManager.emit(new EditFinalStateEvent(this, final));
    }

    addInTransition(transition: Transition): void {
        if (transition.toState !== this) {
            console.error("The transition could not be added: state and destination do not match.");
            return;
        }

        this.inTransitions.set(transition.id, transition);
    }

    removeInTransition(transition: Transition): void {
        let id = transition.id;
        if (! this.inTransitions.has(id)) {
            console.error("The transition could not be deleted: unknown transition.");
            return;
        }
        
        this.inTransitions.delete(transition.id);
    }

    addOutTransition(transition: Transition): void {
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

    removeOutTransition(transition: Transition): void {
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

    hasOutTransitionTo(state: State): boolean {
        for (let transition of this.outTransitions.values()) {
            if (transition.toState === state) {
                return true;
            }
        }

        return false;
    }
    
    hasOutTransitionForSymbol(symbol: TapeSymbol): boolean {
        return this.symbolsToOutTransitions.has(symbol)
            || this.symbolsToOutTransitions.has(READ_ANY_SYMBOL);
    }

    getOutTransitionsForSymbol(symbol: TapeSymbol): Transition[] {
        let transitions = this.symbolsToOutTransitions.get(symbol);
        
        // In case there is no transition for the given symbol,
        // try returning a transition matching any symbol (it may be undefined)
        return transitions === undefined
             ? [...this.symbolsToOutTransitions.get(READ_ANY_SYMBOL)]
             : [...transitions];
    }

    editOutTransitionSymbol(transition: Transition, oldSymbol: TapeSymbol, newSymbol: TapeSymbol): void {
        if (oldSymbol === newSymbol) {
            return;
        }

        let oldSymbolTransitions = this.symbolsToOutTransitions.get(oldSymbol);
        oldSymbolTransitions.delete(transition);

        if (oldSymbolTransitions.size === 0) {
            this.symbolsToOutTransitions.delete(oldSymbol);
        }

        if (! this.symbolsToOutTransitions.has(newSymbol)) {
            this.symbolsToOutTransitions.set(newSymbol, new Set());
        }
        
        this.symbolsToOutTransitions.get(newSymbol).add(transition);
    }

    getInTransitions(): Transition[] {
        return [...this.inTransitions.values()];
    }

    getOutTransitions(): Transition[] {
        return [...this.outTransitions.values()];
    }

    getNonDeterministicOutTransitions(): Transition[] {
        let nonDeterministicTransitions = [];

        for (let transitions of this.symbolsToOutTransitions.values()) {
            if (transitions.size > 1) {
                nonDeterministicTransitions.push(...transitions.values());                
            }
        }

        return nonDeterministicTransitions;
    }

    isDeterministic(): boolean {
        for (let transitions of this.symbolsToOutTransitions.values()) {
            if (transitions.size > 1) {
                return false;
            }
        }

        return true;
    }

    toString(useLabels: boolean = true): string {
        return useLabels ? this.label : this.id.toString();
    }

    outTransitionsToString(useLabels: boolean = true): string {
        return [...this.outTransitions.values()]
            .map((t) => t.toString(useLabels))
            .reduce((str, t) => str + "\n" + t, "");
    }

    export(): StateExport {
        return {
           id: this.id,
           position: this.position,
           label: this.label,
           final: this.final 
        };
    }

    static fromExport(stateExport: StateExport): State {
        let state = new State(stateExport.position, stateExport.label, stateExport.final) as EditableState;
        
        // Restore the original state ID        
        state.id = stateExport.id;
        State.ensureIDIsAbove(stateExport.id);

        return state;
    }

    private static ensureIDIsAbove(minID: StateID): void {
        if (State.nextStateID <= minID) {
            State.nextStateID = minID + 1;
        }
    }
}
