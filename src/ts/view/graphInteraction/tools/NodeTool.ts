import * as d3 from "d3-selection";
import { Graph } from "../../graph/Graph";
import { Node, NodeElementSelection } from "../../graph/Node/Node";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { NodeHandleSelection } from "../../graph/Node/Node";
import { CreateNodeAction } from "../../actions/CreateNodeAction";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { EditEdgeAction } from "../../actions/EditEdgeAction";
import { TransitionEdge } from "../../graph/Edge/TransitionEdge";

export class NodeTool{
    previousX: number;
    previousY: number;
    node: NodeHandleSelection;
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

        if (Node.isNode(d3.select(e.target as any))) {
            this.node = Node.getHandle(d3.select(e.target as any));
            this.node.classed("move", true);
            this.node.raise();
        } else {
            this.node = undefined;
        }
    };

    pointerMove(e: ModifiedPointerEvent) {
        if (this.node !== undefined) {
            Node.translate(this.node, e.x - this.previousX, e.y - this.previousY);
            this.turingMachine
                .stateMachine.getState(this.node.datum().stateID)
                .getInTransitions()
                .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id)
                    .redrawTransitionEdge(
                        Node.getHandleByStateId(t.fromState.id),
                        Node.getHandleByStateId(t.toState.id)));
            this.turingMachine
                .stateMachine.getState(this.node.datum().stateID)
                .getOutTransitions()
                .forEach((t) => this.graph.transitionIdToTransitionEdge.get(t.id)
                    .redrawTransitionEdge(
                        Node.getHandleByStateId(t.fromState.id),
                        Node.getHandleByStateId(t.toState.id)));
        }

        this.previousX = e.x;
        this.previousY = e.y;
    };

    pointerUp(e: ModifiedPointerEvent) {
        if (this.node !== undefined) {
            this.node.classed("move", false);
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
        } else if (Node.isNode(targetSelection)) {
            EditNodeAction.do(Node.getHandle(targetSelection as NodeElementSelection), this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            EditEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        }
    }
}