import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { CreateEdgeAction } from "../../actions/CreateEdgeAction";
import { Graph } from "../../graph/Graph";
import { Node } from "../../graph/Node/Node"; 
import * as d3 from "d3-selection";
import { TuringMachine } from "../../../model/TuringMachine";
import { Helpers } from "../../../helpers";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { EditTransitionEdgeAction } from "../../actions/EditTransitionEdgeAction";
import { SetInitialNodeAction } from "../../actions/SetInitialNodeAction";
import { TransitionEdge } from "../../graph/Edge/TransitionEdge";
import { StateNode } from "../../graph/Node/StateNode";
import { GeneratorEdge } from "../../graph/Edge/GeneratorEdge";
import { GeneratorNode } from "../../graph/Node/GeneratorNode";
import { EditGeneratorEdgeAction } from "../../actions/EditGeneratorEdgeAction";

export class EdgeTool {
    previousX: number;
    previousY: number;
    graph: Graph;
    node: Node;
    isDown: boolean;
    turingMachine: TuringMachine;
    edgeInCreation: d3.Selection<SVGElement, any, any, any>

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.graph = graph
        this.isDown = false;
        this.turingMachine = turingMachine;
    }

    pointerDown(e: ModifiedPointerEvent) {
        this.previousX = e.x;
        this.previousY = e.y;
        this.node = undefined;

        let targetSelection = d3.select(e.target as any);
        this.isDown = true;

        //create an edge mode
        if (Node.isNode(targetSelection)) {
            this.node = Node.getNode(targetSelection)
            this.edgeInCreation =
                this.graph.getSVG()
                    .append("path")
                    .classed("edgeInCreation", true)
            this.drawEdgeInCreation();
            return;
        } 

        //pan svg mode
        if (d3.select(e.target as any).node().tagName === "svg") {
            this.node = undefined
            this.previousX = e.pageX;
            this.previousY = e.pageY;
            return;
        }

        this.isDown = false;
    };

    pointerMove(e: ModifiedPointerEvent) {
        if (this.isDown) {
            //draw an edge
            if(this.node != undefined){
                this.drawEdgeInCreation();
                    
                d3.selectAll(".node.closestNode").classed("closestNode", false);

                let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

                if (closestNode !== undefined) {
                    closestNode.handleSelection.classed("closestNode", true);
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
    };

    pointerUp(e: ModifiedPointerEvent) {
        this.isDown = false;
        if (this.node !== undefined) {
            this.edgeInCreation.remove()

            d3.selectAll(".node.closestNode").classed("closestNode", false);
            let closestNode = this.closestNode({ x: this.node.x, y: this.node.y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

            if (closestNode !== undefined) {
                if (this.node instanceof StateNode && closestNode instanceof StateNode){
                    CreateEdgeAction.do(this.node, closestNode, this.turingMachine);
                } else if (this.node instanceof GeneratorNode && closestNode instanceof StateNode) {
                    SetInitialNodeAction.do(closestNode, this.turingMachine);
                } else if (this.node instanceof StateNode && closestNode instanceof GeneratorNode) {
                    SetInitialNodeAction.do(this.node, this.turingMachine);
                }
            }
        }
    };

    pointerLeave(e: ModifiedPointerEvent) {
        if (this.isDown) {
            if (this.node != undefined) {
                this.edgeInCreation.remove()
                d3.selectAll(".node.closestNode").classed("closestNode", false);
                this.isDown = false;
            }
        }
    }

    pointerClick(e: ModifiedPointerEvent) {
        let target = e.target as d3.BaseType;
        let targetSelection = d3.select(target);

        if (this.node !== undefined && this.node instanceof StateNode) {
            EditNodeAction.do(this.node, this.turingMachine);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            EditTransitionEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.turingMachine);
        } else if (GeneratorEdge.isGeneratorEdge(targetSelection)) {
            EditGeneratorEdgeAction.do(GeneratorEdge.getGeneratorEdge(targetSelection), this.turingMachine);
        }
    }

    private drawEdgeInCreation(){
        this.edgeInCreation
            .attr("d", "M" + this.node.x + "," + this.node.y + 
                        " L" + this.previousX + "," + this.previousY);
    }

    private closestNode(beginEdge: { x, y }, endEdge: { x, y }, minLength: number, distFromEnd: number): Node {
        let closestNode: Node;
        let minDistance = distFromEnd; 
        d3.selectAll(".node").each(function () {
            let node = Node.getNode(d3.select(this));
            let point2 = {
                x: node.x, y: node.y };
            if (Helpers.distance2(endEdge, point2) < minDistance) {
                minDistance = Helpers.distance2(endEdge, point2)
                closestNode = node;
            }
        })
        if (Helpers.distance2(beginEdge, endEdge) < minLength){
            return undefined;
        }
        return closestNode;
    }
}