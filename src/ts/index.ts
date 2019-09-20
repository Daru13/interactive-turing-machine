import { TuringMachine } from './model/TuringMachine';
import { Graph } from './Graph';
import { EventManager } from './EventManager';

let turingMachine = new TuringMachine();
console.log("It works!");

let eventManager = new EventManager();
let graph = new Graph(eventManager);
