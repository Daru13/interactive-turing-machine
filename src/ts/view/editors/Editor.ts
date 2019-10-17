import * as d3 from "d3-selection";
import { Popup } from "./Popup";
import { NodeHandleSelection } from "../graph/Node";
import { EdgeHandleSelection } from "../graph/Edge";

type GraphElement = NodeHandleSelection | EdgeHandleSelection;

export class Editor extends Popup{
    element: GraphElement

    constructor(element: GraphElement){
        super();
        this.element = element;
        d3.selectAll(".selected").classed("selected", false);
        element.classed("selected", true);

        console.log(this.element);
        this.initPosition();
        this.setOnClose(() => { })
    }

    initPosition(){
        console.log(this.element)
        let bbox = this.element.node().getBoundingClientRect();
        let bboxHolder = this.holder.node().getBoundingClientRect();

        this.holder
            .style("top", (bbox.top + bbox.height).toString() + "px")
            .style("left", (bbox.left + (bbox.width - bboxHolder.width) / 2).toString() + "px");
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
        if (id !== null) {
            textField.classed(classElement, true);
        }            
    }

    setOnClose(onClose: () => void){
        super.setOnClose(() => {
            this.element.classed("selected", false);
            onClose();
        })
    }
}