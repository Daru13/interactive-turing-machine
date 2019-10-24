import { TuringMachine } from './model/TuringMachine';
import { ViewController } from './view/ViewController';
import { EasterEggs } from './easterEggs/EasterEggs';

new ViewController(new TuringMachine());
EasterEggs.spaceman();