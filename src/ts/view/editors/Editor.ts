import * as d3 from "d3-selection";
import { Popup } from "./Popup";
import { Edge } from "../graph/edges/Edge";
import { Node } from "../graph/nodes/Node";
import { Selection } from "../../helpers";


type GraphElement = Node | Edge;

/**
 * A class to create an editor for an element in the graph
 */
export class Editor extends Popup{
    /** element edited in this editor */
    element: GraphElement;

    constructor(element: GraphElement) {
        super();
        this.element = element;
        d3.selectAll(".node, .edge").classed("selected", false);

        this.setOnClose(() => { });
    }

    /**
     * Inits position of the editor centered under the this.element
     */
    initPosition(): void {
        let elementBoudingBox = this.element.handleSelection.node().getBoundingClientRect();
        let editorBoundingBox = this.holder.node().getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let top = elementBoudingBox.top + elementBoudingBox.height;
        let left = elementBoudingBox.left + (elementBoudingBox.width - editorBoundingBox.width) / 2;

        if (top < 0) {
            top = 0;
        }
        if (left < 0) {
            left = 0;
        }
        if (left + editorBoundingBox.width > windowWidth) {
            left = windowWidth - editorBoundingBox.width;
        }

        this.holder
            .style("top", (top).toString() + "px")
            .style("left", (left).toString() + "px");
        
        let maxHeight = windowHeight - this.content.node().getBoundingClientRect().top;
        this.setMaxHeightContent(maxHeight);
    }

    /**
     * Adds an HTML label
     * @param text the text of the label
     * @param forAttribute for attribute of the label
     * @param parent parent of the holder
     */
    addLabel(text: string, forAttribute: string, parent: Selection<HTMLElement> = this.content): void {
        let label = parent
            .append("label")
            .attr("for", forAttribute)
            .text(text);
    }

    /**
     * Adds a html button
     * @param text text of the button
     * @param callback function called when the button is cliked
     * @param id id of the button
     * @param classElement class of the button
     * @param parent parent of the button
     */
    addButton(text: string, callback: () => void, id: string = null, classElement: string = null, parent: Selection<HTMLElement> = this.content): void {
        let button = 
            parent
                .append("button")
                .on("click", callback)
                .text(text);
        if (id !== null) {
            button.attr("id", id);
        }
        if (id !== null) {
            button.classed(classElement, true);
        }
    }

    /**
     * Adds a html text field
     * @param value the value of the text field
     * @param attributes the different attributes of the text field
     * @param parent the parent of the text field 
     */
    addTextField(value: string, attributes: Record<string, string>, parent: Selection<HTMLElement> = this.content): void {
        let textField =
            parent
                .append("input")
                .attr("type", "text")
                .attr("value", value);

        // Particular case of the class attribute
        if (attributes["class"] !== undefined) {
            let classes = attributes["class"].split(" ");
            delete attributes["class"];

            for (let className of classes) {
                textField.classed(className, true);
            }
        }

        // Other attributes
        for (let attrKey of Object.keys(attributes)) {
            let attrValue = attributes[attrKey];
            textField.attr(attrKey, attrValue);
        } 
    }

    /**
     * Sets the function to execute when closing the editor
     * @param onClose function executed when the editor is closing
     */
    setOnClose(onClose: () => void): void {
        super.setOnClose(() => {
            //this.element.classed("selected", false);
            onClose();
        });
    }
}