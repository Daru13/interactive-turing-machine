import * as d3 from "d3-selection";
import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { CreateNodeAction } from "../../actions/CreateNodeAction";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { EditEdgeAction } from "../../actions/EditEdgeAction";
import { TransitionEdge } from "../../graph/Edge/TransitionEdge";
import { StateNode } from "../../graph/Node/StateNode";

export class NodeTool{
    previousX: number;
    previousY: number;
    node: StateNode;
    graph: Graph;
    turingMachine: TuringMachine;

    constructor(graph: Graph, turingMachine: TuringMachine){
        this.previousX = 0;
        this.previousY = 0;
        this.graph = graph;
        this.turingMachine = turingMachine;
    }

    pointerDown(e: ModifiedPointerEvent) {
        this.previousX = e.x;
        this.previousY = e.y;

        if (StateNode.isStateNode(d3.select(e.target as any))) {
            this.node = StateNode.getStateNode(d3.select(e.target as any));
            this.node.handleSelection.classed("move", true);
            this.node.handleSelection.raise();
        } else {
            this.node = undefined;
        }
    };

    pointerMove(e: ModifiedPointerEvent) {
        if (this.node !== undefined) {
            this.node.translateBy(e.x - this.previousX, e.y - this.previousY);
            this.turingMachine
                .stateMachine.getState(this.node.stateID)
                .getInTransitions()
                .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id).redrawTransitionEdge());
            this.turingMachine
                .stateMachine.getState(this.node.stateID)
                .getOutTransitions()
                .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id).redrawTransitionEdge());
            if(this.node.isInitialState()){
                this.graph.generatorEdge.redrawGeneratorEdge();
            }
        }

        this.previousX = e.x;
        this.previousY = e.y;
    };

    pointerUp(e: ModifiedPointerEvent) {
        if (this.node !== undefined) {
            this.node.handleSelection.classed("move", false);
            this.node = undefined;
        }
    };

    pointerLeave(e: ModifiedPointerEvent) {
    };

    pointerClick(e: ModifiedPointerEvent){
        let target = e.target as d3.BaseType;
        let targetSelection = d3.select(target);

        if (d3.select(target).property("tagName") == "svg") {
            CreateNodeAction.do(e.x, e.y, this.turingMachine);
        } else if (StateNode.isStateNode(targetSelection)) {
            EditNodeAction.do(StateNode.getStateNode(targetSelection), this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            EditEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
    }
}