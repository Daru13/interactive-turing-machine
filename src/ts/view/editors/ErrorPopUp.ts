import { Popup } from "./Popup";
import * as d3 from "d3-selection";
import { TMError } from "../../errors/TMError";

export class ErrorPopup extends Popup {
    error: TMError;

    constructor(error: TMError) {
        super();
        this.error = error;
        this.holder.classed("error-popup", true);

        this.setTitle(error.name);
        this.content.append("p").text(error.text);

        this.setOnClose(() => { })
        this.maskBackground.remove();
        this.initPosition();
    }

    initPosition() {
        let bboxHolder = this.holder.node().getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
    
        let top = windowHeight / 2 - bboxHolder.height/2;
        let left = windowWidth / 2 - bboxHolder.width / 2;

        this.holder
            .style("top", (top).toString() + "px")
            .style("left", (left).toString() + "px");
    }
}