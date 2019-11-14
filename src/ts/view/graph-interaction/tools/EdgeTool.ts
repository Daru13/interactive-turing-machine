import { ModifiedPointerEvent } from "../ModifiedPointerEvent";
import { CreateTransitionAction } from "../../actions/CreateTransitionAction";
import { Graph } from "../../graph/Graph";
import { Node } from "../../graph/nodes/Node"; 
import * as d3 from "d3-selection";
import { TuringMachine } from "../../../model/TuringMachine";
import { Helpers } from "../../../helpers";
import { SetInitialStateAction } from "../../actions/SetInitialStateAction";
import { TransitionEdge } from "../../graph/edges/TransitionEdge";
import { StateNode } from "../../graph/nodes/StateNode";
import { GeneratorEdge } from "../../graph/edges/GeneratorEdge";
import { GeneratorNode } from "../../graph/nodes/GeneratorNode";
import { NodeEditor } from "../../popups/NodeEditorPopup";
import { TransitionEdgeEditor } from "../../popups/TransitionEdgeEditorPopup";
import { GeneratorEdgeEditor } from "../../popups/GeneratorEdgeEditorPopup";

/** A class to define a tool to create edges */
export class EdgeTool {
    /** previous x position */
    previousX: number;
    /** previous y position */
    previousY: number;
    /** turing machine where to create a transition */
    turingMachine: TuringMachine;
    /** graph where to create an edge */
    graph: Graph;
    /** node the edge is comming from */
    node: Node;
    /** is the mouse down */
    isDown: boolean;
    /** shadow drawn to make a preview of the edge to create */
    edgeInCreation: d3.Selection<SVGElement, any, any, any>;

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.graph = graph;
        this.isDown = false;
        this.turingMachine = turingMachine;
    }

    /**
     * When the mouse is down, detect if we are on a node or not
     * @param e
     */
    pointerDown(e: ModifiedPointerEvent): void {
        this.previousX = e.x;
        this.previousY = e.y;
        this.node = undefined;

        let targetSelection = d3.select(e.target as any);
        this.isDown = true;

        //create an edge mode
        if (Node.isNode(targetSelection)) {
            this.node = Node.getNode(targetSelection);
            this.edgeInCreation =
                this.graph.getSVG()
                    .append("path")
                    .classed("edge-in-creation", true);
            this.drawEdgeInCreation();
            return;
        } 

        //pan svg mode
        if (d3.select(e.target as any).node().tagName === "svg") {
            this.node = undefined;
            this.previousX = e.pageX;
            this.previousY = e.pageY;
            return;
        }

        this.isDown = false;
    }

    /**
     * When the mouse is moves, if we were down on a node, it will draw edge in creation. If not, it will pan the svg of the graph
     * @param e 
     */
    pointerMove(e: ModifiedPointerEvent): void {
        if (this.isDown) {
            // Draw an edge
            if (this.node !== undefined) {
                this.drawEdgeInCreation();
                    
                d3.selectAll(".node.closest-node").classed("closest-node", false);

                let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

                if (closestNode !== undefined) {
                    closestNode.handleSelection.classed("closest-node", true);
                }

                this.previousX = e.x;
                this.previousY = e.y;
            } 
            //pan svg
            else {
                this.graph.translateViewBoxBy(e.pageX - this.previousX, e.pageY - this.previousY);
                this.previousX = e.pageX;
                this.previousY = e.pageY;
            }

        }
    }

    /**
     * When the mouse is up, look for the closest node where the mouse went up. If there is one not too far, 3 times the size of a node, creates an edge from this.node to closest node
     * @param e 
     */
    pointerUp(e: ModifiedPointerEvent): void {
        this.isDown = false;
        if (this.node !== undefined) {
            this.edgeInCreation.remove();

            d3.selectAll(".node.closest-node").classed("closest-node", false);
            let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

            if (closestNode !== undefined) {
                if (this.node instanceof StateNode && closestNode instanceof StateNode) {
                    CreateTransitionAction.do(this.node, closestNode, this.turingMachine);
                } else if (this.node instanceof GeneratorNode && closestNode instanceof StateNode) {
                    SetInitialStateAction.do(closestNode, this.turingMachine);
                } else if (this.node instanceof StateNode && closestNode instanceof GeneratorNode) {
                    SetInitialStateAction.do(this.node, this.turingMachine);
                }
            }
        }
    }

    /**
     * When the mouse leaves, cancel the creation of an edge
     * @param e 
     */
    pointerLeave(e: ModifiedPointerEvent): void {
        if (this.isDown) {
            if (this.node !== undefined) {
                this.edgeInCreation.remove();
                d3.selectAll(".node.closest-node").classed("closest-node", false);
                this.isDown = false;
            }
        }
    }

    /**
     * When the mouse clicks, if on a graph element (node or edge), opens an editor for that element
     * @param e 
     */
    pointerClick(e: ModifiedPointerEvent): void {
        let target = e.target as d3.BaseType;
        let targetSelection = d3.select(target);

        if (this.node !== undefined && this.node instanceof StateNode) {
            new NodeEditor(this.node, this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            new TransitionEdgeEditor(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        } else if (GeneratorEdge.isGeneratorEdge(targetSelection)) {
            new GeneratorEdgeEditor(GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine.stateMachine);
        }
    }

    /**
     * Draws the edge in creation
     */
    private drawEdgeInCreation(): void {
        this.edgeInCreation
            .attr("d", "M" + this.node.x + "," + this.node.y + 
                        " L" + this.previousX + "," + this.previousY);
    }

    /**
     * find the closests node to the end of an edge
     * @param beginEdge start point of the edge
     * @param endEdge end point of the edge
     * @param minLength minimal length of the edge
     * @param distFromEnd maximal distance allowed between the end point and a node
     * @returns the closest node to the end point with a distance to the end point of max distFromEnd if any
     */
    private closestNode(beginEdge: { x, y }, endEdge: { x, y }, minLength: number, distFromEnd: number): Node {
        let closestNode: Node;
        let minDistance = distFromEnd; 
        d3.selectAll(".node").each(function(): void {
            let node = Node.getNode(d3.select(this));
            let point2 = {
                x: node.x, y: node.y };
            if (Helpers.distance2(endEdge, point2) < minDistance) {
                minDistance = Helpers.distance2(endEdge, point2);
                closestNode = node;
            }
        });
        if (Helpers.distance2(beginEdge, endEdge) < minLength) {
            return undefined;
        }
        return closestNode;
    }
}