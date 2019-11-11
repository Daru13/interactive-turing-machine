import * as d3 from "d3-selection";
import { Graph } from "../../graph/Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { CreateNodeAction } from "../../actions/CreateNodeAction";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { TransitionEdge } from "../../graph/Edge/TransitionEdge";
import { StateNode } from "../../graph/Node/StateNode";
import { Node } from "../../graph/Node/Node";
import { GeneratorEdge } from "../../graph/Edge/GeneratorEdge";
import { EditGeneratorEdgeAction } from "../../actions/EditGeneratorEdgeAction";
import { EditTransitionEdgeAction } from "../../actions/EditTransitionEdgeAction";
import { Helpers } from "../../../helpers";

export class NodeTool{
    previousX: number;
    previousY: number;
    node: StateNode;
    graph: Graph;
    turingMachine: TuringMachine;
    isDown: boolean;
    bestPos: { x: number; y: number; };

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.bestPos = { x: 0, y: 0};
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isDown = false;
    }

    pointerDown(e: ModifiedPointerEvent): void {
        this.previousX = e.x;
        this.previousY = e.y;
        this.isDown = true;

        // Drag node mode
        if (StateNode.isStateNode(d3.select(e.target as any))) {
            this.node = StateNode.getStateNode(d3.select(e.target as any));
            this.node.handleSelection.classed("move", true);
            this.node.handleSelection.raise();
            this.bestPos = { x: this.node.x, y: this.node.y};
            return;
        } 
        
        // Pan svg mode
        if (d3.select(e.target as any).node().tagName === "svg") {
            this.node = undefined;
            this.previousX = e.pageX;
            this.previousY = e.pageY;
            return;
        }
        this.isDown = false;
    }

    pointerMove(e: ModifiedPointerEvent): void {
        if (this.isDown) {
            // Drag node
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

                if (this.node.isInitialState()) {
                    this.graph.generatorEdge.redrawGeneratorEdge();
                }

                if (this.isThisBestPosForNode()) {
                    this.bestPos.x = this.node.x;
                    this.bestPos.y = this.node.y;
                    this.node.handleSelection.classed("bad-position", false);
                } else {
                    this.node.handleSelection.classed("bad-position", true);
                }

                this.previousX = e.x;
                this.previousY = e.y;
            }
            // Pan svg mode 
            else {
                this.graph.translateViewBoxBy(e.pageX - this.previousX, e.pageY - this.previousY);
                this.previousX = e.pageX;
                this.previousY = e.pageY;
            }
        }
    }

    pointerUp(e: ModifiedPointerEvent): void {
        if (this.node !== undefined) {
            this.node.translateTo(this.bestPos.x, this.bestPos.y);
            this.node.handleSelection.classed("move", false);
            this.node.handleSelection.classed("bad-position", false);
            this.node = undefined;
        }
        this.isDown = false;
    }

    pointerLeave(e: ModifiedPointerEvent): void {
        this.pointerUp(e);
    }

    pointerClick(e: ModifiedPointerEvent): void {
        let target = e.target as d3.BaseType;
        let targetSelection = d3.select(target);

        if (d3.select(target).property("tagName") === "svg") {
            CreateNodeAction.do(e.x, e.y, this.turingMachine);
        } else if (StateNode.isStateNode(targetSelection)) {
            EditNodeAction.do(StateNode.getStateNode(targetSelection), this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            EditTransitionEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        } else if (GeneratorEdge.isGeneratorEdge(targetSelection)) {
            EditGeneratorEdgeAction.do(GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine);
        }
    }

    private isThisBestPosForNode(): boolean {
        let isBestPos = true;
        let node = this.node;

        d3.selectAll(".node").each(function(): void {
            let thisNode = Node.getNode(d3.select(this));
            if (thisNode.id !== node.id && isBestPos) {
                isBestPos = Helpers.distance2({ x: node.x, y: node.y }, { x: thisNode.x, y: thisNode.y }) >= Graph.sizeNode * 2;
            }
        });
        return isBestPos;
    }
}