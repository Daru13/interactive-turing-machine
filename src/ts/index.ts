import { TuringMachine } from './model/TuringMachine';
import { State } from './model/State';
import { Transition } from './model/Transition';
import { HeadAction } from './model/Tape';

import { ViewController } from './view/ViewController';
/*
// Test code for Turing machine model
let tm = new TuringMachine();
window["tm"] = tm;

// Create states
const stateLabels = ["A", "B", "C"];
const states = stateLabels.map((label) => { return tm.stateMachine.createAndAddState(label); });

// Set the initial and final states
tm.stateMachine.setInitialState(states[0].id);
states[2].setFinal(true);

// Add transitions
tm.stateMachine.addTransition(new Transition(states[0], states[0], "O", "O", HeadAction.MoveRight));
tm.stateMachine.addTransition(new Transition(states[1], states[1], "O", "O", HeadAction.MoveRight));
tm.stateMachine.addTransition(new Transition(states[0], states[1], "X", "X", HeadAction.MoveRight));
tm.stateMachine.addTransition(new Transition(states[1], states[2], "X", "X", HeadAction.MoveRight));

// Set the initial content of the tape and the initial state
tm.tape.setContent(["X", "O", "O", "O", "X", "O", "A"]);

console.log(tm.toString());

// Run the machine
let nbSteps = tm.run();

console.log(tm.toString());
console.log("nb steps = ", nbSteps);
*/
new ViewController(new TuringMachine());
