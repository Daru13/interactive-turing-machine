import { Popup } from "./Popup";
import * as d3 from "d3-selection";
import { TMError } from "../../errors/TMError";

export class ErrorPopup extends Popup {
    error: TMError;

    constructor(error: TMError) {
        super();
        this.error = error;
        
        this.init();
    }

    init() {
        this.setTitle(this.error.getName());
        this.holder.classed("error-popup", true);

        this.content.append("p")
            .html(this.error.getDescription());

        this.maskBackground.remove();
        this.center();
    }
}