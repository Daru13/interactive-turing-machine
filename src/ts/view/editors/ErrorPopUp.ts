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
        this.center();
    }
}