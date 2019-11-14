# The Interactive Turing Machine [![Build Status](https://travis-ci.com/Daru13/interactive-turing-machine.svg?branch=master)](https://travis-ci.com/Daru13/interactive-turing-machine)

The Interactive Turing Machine is a web application for **designing and simulating Turing machines**. It was designed to be easy to use (no textual coding required) and playful (colorful graphics, animations, etc).

▶️ [**Try it out!**](https://daru13.github.io/interactive-turing-machine/)

The project was motivated by the apparent absence of fully interactive Turing machines online (we did not cover desktop or mobile applications). As an example, most of the alternatives we found, such as [turingmachinesimulator.com](https://turingmachinesimulator.com/) or [turingmachine.io](http://turingmachine.io/), required to describe the state machine using a textual language (instead of directly maniulating the graphical representation).



## Interface and features

The Interactive Turing Machine simulates a Turing machine with a single semi-infinite tape to keep it simple. The interface is split in four areas:

* The **main menu bar**, where you can load examples, export and import machines, switch between mouse and pen & touch interaction, and open a help page (beta version only).
* The **graph**, where you can draw and edit the state machine using nodes (states) and edges (transitions). The _generator_ is used as an entry point (the initial state is the state connected to the generator).
* The **tape**, which can be read and written (either cell-by-cell or as a string, using the edit button on the left side). The tape head indicates the current cell.
* The **control panel**, which displays buttons to _run_ the machine (until it stops or until a maximum number of steps is reached), _run one step_ only, and _reset_ the machine (only the current state and the tape position).

If an error occurs during the simulation, a popup with a description of the error and a suggested solution will open. There currently are three types of runtime errors:

* There is **no initial state**.
* There is **no transition available** (in the current state, for the current symbol).
* There are **more than one transitions available** (the machine is non-deterministic, and cannot determine which transition to take).
      

## Building process
The Interactive Turing Machine is written in [TypeScript](https://www.TypeScriptlang.org/), a typed language which can be transpiled to plain JavaScript. It mainly relies on [D3](https://d3js.org/) for manipulating the DOM and [Browserify](http://browserify.org/) to pack all the output JavaScript files into a single script.

To build it on your own machine, you must start by installing all the dependencies using [npm](https://www.npmjs.com/). It is shipped along with Node (see [installation methods](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)).

Once this is done, **open a terminal and run the following commands**:
1. `git clone https://github.com/Daru13/interactive-turing-machine.git` to clone this repository.
2. `cd interactive-turing-machine` to change you working directory to the clone you just made.
3. `npm install -g grunt-cli` to install the CLI of [Grunt](https://gruntjs.com/), the build system we use.
3. `npm install` to install all the other dependencies (listed in [`package.json`](package.json)).
4. `grunt` to finally build the application.

The `build` folder will contain your own build.
You can also generate your own documentation by running `grunt make-doc`.