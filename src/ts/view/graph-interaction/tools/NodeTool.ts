import * as d3 from "d3-selection";
import { Graph } from "../../Graph";
import { TuringMachine } from "../../../model/TuringMachine";
import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { CreateStateAction } from "../../actions/CreateStateAction";
import { TransitionEdge } from "../../edges/TransitionEdge";
import { StateNode } from "../../nodes/StateNode";
import { Node } from "../../nodes/Node";
import { GeneratorEdge } from "../../edges/GeneratorEdge";
import { Helpers } from "../../../helpers";
import { MoveStateAction } from "../../actions/MoveStateAction";
import { NodeEditor } from "../../popups/NodeEditorPopup";
import { TransitionEdgeEditor } from "../../popups/TransitionEdgeEditorPopup";
import { GeneratorEdgeEditor } from "../../popups/GeneratorEdgeEditorPopup";

/** A class to create a tool to create nodes and moves them. */
export class NodeTool{
    /** previous x position. */
    previousX: number;
    /** previous y position. */
    previousY: number;
    /** node to move. */
    node: StateNode;
    /** graph where to add nodes. */
    graph: Graph;
    /** turing machine where to add states. */
    turingMachine: TuringMachine;
    /** is the mouse down. */
    isDown: boolean;
    /** best position where to put the node. If a node is moved above another one, the best position is the one before goign above the other node. */
    bestPos: { x: number; y: number; };

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.bestPos = { x: 0, y: 0};
        this.graph = graph;
        this.turingMachine = turingMachine;
        this.isDown = false;
    }

    /**
     * When the mouse is down, detect if we are on a node or not
     * @param e
     */
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

    /**
     * When the mouse moves, if we are on a node, drags it. Otherwise pan the svg of the graph
     * @param e
     */
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

                if (this.node.isInitialNode()) {
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

    /**
     * When the mouse is up, update the corresponding state position in the turing machine
     * @param e
     */
    pointerUp(e: ModifiedPointerEvent): void {
        if (this.node !== undefined) {
            this.node.handleSelection.classed("move", false);
            this.node.handleSelection.classed("bad-position", false);

            MoveStateAction.do(this.node, this.bestPos.x, this.bestPos.y, this.turingMachine);
            
            this.node = undefined;
        }
        this.isDown = false;
    }

    /**
     * When the mouse leaves, it is considered as the mouse up
     * @param e 
     */
    pointerLeave(e: ModifiedPointerEvent): void {
        this.pointerUp(e);
    }

    /** 
     * When the mouse clicks, if it is on an element (node or edge), opens an editor for that element. Otherwise, adds a node where the click happened
     * @param e
     */
    pointerClick(e: ModifiedPointerEvent): void {
        let target = e.target as d3.BaseType;
        let targetSelection = d3.select(target);

        if (d3.select(target).property("tagName") === "svg") {
            CreateStateAction.do(e.x, e.y, this.turingMachine);
        } else if (StateNode.isStateNode(targetSelection)) {
            new NodeEditor(StateNode.getStateNode(targetSelection), this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            new TransitionEdgeEditor(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        } else if (GeneratorEdge.isGeneratorEdge(targetSelection)) {
            new GeneratorEdgeEditor(GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine.stateMachine);
        }
    }

    /**
     * Determines whether this is the best position for node
     * @returns true if this best pos for node 
     */
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