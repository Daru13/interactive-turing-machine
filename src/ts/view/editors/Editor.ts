import * as d3 from "d3-selection";
import { Popup } from "./Popup";
import { Edge } from "../graph/Edge/Edge";
import { Node } from "../graph/Node/Node";

type GraphElement = Node | Edge;

export class Editor extends Popup{
    element: GraphElement

    constructor(element: GraphElement){
        super();
        this.element = element;
        d3.selectAll(".selected").classed("selected", false);

        this.setOnClose(() => { })
    }

    initPosition(){
        let bbox = this.element.handleSelection.node().getBoundingClientRect();
        let bboxHolder = this.holder.node().getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let top = bbox.top + bbox.height;
        let left = bbox.left + (bbox.width - bboxHolder.width) / 2; 
        if(top < 0){
            top = 0;
        }
        if(top + bboxHolder.height > windowHeight){
            top = windowHeight - bboxHolder.height;
        }
        if(left < 0){
            left = 0;
        }
        if (left + bboxHolder.width > windowWidth) {
            left = windowWidth - bboxHolder.width;
        }

        this.holder
            .style("top", (top).toString() + "px")
            .style("left", (left).toString() + "px");
    }

    addLabel(text: string, forAttribute: string, parent: d3.Selection<HTMLElement, any, any, any> = this.content) {
        let label = parent
            .append("label")
            .attr("for", forAttribute)
            .text(text);
    }

    addButton(text: string, callback: () => void, id: string = null, classElement: string = null, parent: d3.Selection<HTMLElement, any, any, any> = this.content): void {
        let button = 
            parent
                .append("button")
                .on("click", callback)
                .text(text);
        if(id !== null){
            button.attr("id", id);
        }
        if (id !== null) {
            button.classed(classElement, true);
        }
    }

    addTextField(value: string, id: string = null, classElement: string = null, parent: d3.Selection<HTMLElement, any, any, any> = this.content) {
        let textField =
            parent
                .append("input")
                .attr("type", "text")
                .attr("value", value)
        if (id !== null) {
            textField.attr("id", id);
        }
        if (classElement !== null) {
            textField.classed(classElement, true);
        }            
    }

    setOnClose(onClose: () => void){
        super.setOnClose(() => {
            //this.element.classed("selected", false);
            onClose();
        })
    }
}