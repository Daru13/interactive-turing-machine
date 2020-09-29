"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Popup_1 = require("./Popup");
class Editor extends Popup_1.Popup {
    constructor(element) {
        super();
        this.element = element;
        d3.selectAll(".node, .edge").classed("selected", false);
        this.setOnClose(() => { });
    }
    initPosition() {
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
    addLabel(text, forAttribute, parent = this.content) {
        let label = parent
            .append("label")
            .attr("for", forAttribute)
            .text(text);
    }
    addButton(text, callback, id = null, classElement = null, parent = this.content) {
        let button = parent
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
    addTextField(value, attributes, parent = this.content) {
        let textField = parent
            .append("input")
            .attr("type", "text")
            .attr("value", value);
        if (attributes["class"] !== undefined) {
            let classes = attributes["class"].split(" ");
            delete attributes["class"];
            for (let className of classes) {
                textField.classed(className, true);
            }
        }
        for (let attrKey of Object.keys(attributes)) {
            let attrValue = attributes[attrKey];
            textField.attr(attrKey, attrValue);
        }
    }
    setOnClose(onClose) {
        super.setOnClose(() => {
            onClose();
        });
    }
}
exports.Editor = Editor;
//# sourceMappingURL=EditorPopup.js.map