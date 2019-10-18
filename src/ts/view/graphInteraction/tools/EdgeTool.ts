import { ModifiedPointerEvent } from "../../../events/ModifiedPointerEvent";
import { CreateEdgeAction } from "../../actions/CreateEdgeAction";
import { Graph } from "../../graph/Graph";
import { Node, NodeElementSelection } from "../../graph/Node/Node"; 
import * as d3 from "d3-selection";
import { TuringMachine } from "../../../model/TuringMachine";
import { NodeHandleSelection } from "../../graph/Node/Node";
import { Helpers } from "../../../helpers";
import { CreateNodeAction } from "../../actions/CreateNodeAction";
import { EditNodeAction } from "../../actions/EditNodeAction";
import { EditEdgeAction } from "../../actions/EditEdgeAction";
import { Generator, GeneratorHandleSelection } from "../../graph/Node/GeneratorNode";
import { SetInitialNodeAction } from "../../actions/SetInitialNodeAction";
import { Edge } from "../../graph/Edge/Edge";
import { TransitionEdge } from "../../graph/Edge/TransitionEdge";

export class EdgeTool {
    previousX: number;
    previousY: number;
    graph: Graph;
    node: NodeHandleSelection | GeneratorHandleSelection;
    isDown: boolean;
    tM: TuringMachine;
    edgeInCreation: d3.Selection<SVGElement, any, any, any>

    constructor(graph: Graph, turingMachine: TuringMachine) {
        this.previousX = 0;
        this.previousY = 0;
        this.graph = graph
        this.isDown = false;
        this.tM = turingMachine;
    }

    pointerDown(e: ModifiedPointerEvent) {
        this.previousX = e.x;
        this.previousY = e.y;
        this.node = undefined;

        let targetSelection = d3.select(e.target as any);

        if (Node.isNode(targetSelection)) {
            this.node = Node.getHandle(targetSelection)
        } else if (Generator.isGenerator(targetSelection)){
            this.node = Generator.getGeneratorHandle(targetSelection);
        } else {
            this.node = undefined
            return;
        }

        this.isDown = true;
        this.edgeInCreation =
            this.graph.getSVG()
                .append("path")
                .classed("edgeInCreation", true)

        this.drawEdgeInCreation(); 
    };

    pointerMove(e: ModifiedPointerEvent) {
        if (this.isDown) {
            this.drawEdgeInCreation();
                
            d3.selectAll(".node.closestNode").classed("closestNode", false);

            let closestNode = this.closestNode({ x: this.node.datum().x, y: this.node.datum().y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

            if (closestNode !== undefined) {
                closestNode.classed("closestNode", true);
            }

            this.previousX = e.x;
            this.previousY = e.y;
        }
    };

    pointerUp(e: ModifiedPointerEvent) {
        if (this.isDown) {
            this.isDown = false;

            this.edgeInCreation.remove()

            d3.selectAll(".node.closestNode").classed("closestNode", false);
            let closestNode = this.closestNode({ x: this.node.datum().x, y: this.node.datum().y }, { x: this.previousX, y: this.previousY }, Graph.sizeNode, Graph.sizeNode * 3);

            if (closestNode !== undefined) {
                if(Node.isNode(this.node)){
                    CreateEdgeAction.do(this.node as NodeHandleSelection, closestNode, this.tM);
                }else{
                    SetInitialNodeAction.do(closestNode, this.tM);
                }
            }
        }
    };

    pointerLeave(e: ModifiedPointerEvent) {
        if (this.isDown) {
            this.isDown = false;

            this.edgeInCreation.remove()

            d3.selectAll(".node.closestNode").classed("closestNode", false);
            console.log(this.tM.stateMachine.toString());
        }
    }

    pointerClick(e: ModifiedPointerEvent) {
        let target = e.target as d3.BaseType;
        let targetSelection = d3.select(target);

        if (this.node !== undefined && Node.isNode(this.node)) {
            EditNodeAction.do(this.node as NodeHandleSelection, this.tM);
        } else if (TransitionEdge.isTransitionEdge(targetSelection)) {
            EditEdgeAction.do(TransitionEdge.getTransitionEdge(targetSelection), this.tM);
        }
    }

    private drawEdgeInCreation(){
        this.edgeInCreation
            .attr("d", "M" + this.node.datum().x + "," + this.node.datum().y + 
                            " L" + this.previousX + "," + this.previousY);
    }

    private closestNode(beginEdge: { x, y }, endEdge: { x, y }, minLength: number, distFromEnd: number): NodeHandleSelection {
        let closestNode: NodeHandleSelection;
        let minDistance = distFromEnd; 
        let t = this;
        d3.selectAll(".node").each(function () {
            let point2 = { x: d3.select(this).datum()["x"], y: d3.select(this).datum()["y"] };
            if (Helpers.distance2(endEdge, point2) < minDistance) {
                minDistance = Helpers.distance2(endEdge, point2)
                closestNode = d3.select(this) as NodeHandleSelection;
            }
        })
        if (Helpers.distance2(beginEdge, endEdge) < minLength){
            return undefined;
        }
        return closestNode;
    }
}