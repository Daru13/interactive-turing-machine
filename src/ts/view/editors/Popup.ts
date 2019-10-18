import * as d3 from "d3-selection";
import { VoronoiSite } from "d3";

export class Popup{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
    maskBackground: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
    content: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
    onClose: () => void;

    constructor() {
        this.holder = d3.select("body").append("div").classed("popup", true);
        this.onClose = () => {};

        this.initUI();
        this.initMask();
    }

    initUI() {
        let t = this;

        this.holder
            .append("div")
                .classed("popup-title", true);

        this.holder
            .append("button")
                .classed("popup-close-button", true)
                .on("click", () => { t.close() })
                .text("close");

        this.content = this.holder.append("div").classed("popup-content", true);
    }

    initMask() {
        var t = this;
        this.maskBackground =
            d3.select("body")
                .append("div")
                .classed("background-mask", true)
                .on("click", () => { t.close() });
    }

     close() {
        this.maskBackground.remove();
        this.holder.remove();
        this.onClose();
    }

    setOnClose(onClose: () => void){
        this.onClose = onClose;
    }
}