import { TuringMachine } from './model/TuringMachine';
import { State } from './model/State';
import { Transition } from './model/Transition';
import { HeadAction } from './model/Tape';

import { ViewController } from './view/ViewController';
import { EventManager } from './EventManager';
/*
// Test code for Turing machine model
let tm = new TuringMachine();
window["tm"] = tm;

// Define and add states
const states = [
    new State("A"),
    new State("B"),
    new State("C", true)
];

for (let state of states) {
    tm.stateMachine.addState(state);
}

// Add transitions
tm.stateMachine.addTransition(new Transition(states[0], states[0], "O", "O", HeadAction.MoveRight));
tm.stateMachine.addTransition(new Transition(states[1], states[1], "O", "O", HeadAction.MoveRight));
tm.stateMachine.addTransition(new Transition(states[0], states[1], "X", "X", HeadAction.MoveRight));
tm.stateMachine.addTransition(new Transition(states[1], states[2], "X", "X", HeadAction.MoveRight));

// Set the initial content of the tape and the initial state
tm.tape.setContent(["X", "O", "O", "O", "X", "O", "A"]);
tm.stateMachine.setInitialState(states[0]);

console.log(tm.toString());



// Run the machine
let nbSteps = tm.run();

console.log(tm.toString());
console.log("nb steps = ", nbSteps);*/

let vc = new ViewController();
EventManager.registerHandler("addNode", function(e){console.log(e)});
