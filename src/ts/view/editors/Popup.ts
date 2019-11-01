import * as d3 from "d3-selection";

export class Popup{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
    maskBackground: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;
    content: d3.Selection<HTMLDivElement, {}, HTMLElement, {}>;

    private title: string;
    private onClose: () => void;

    constructor() {
        this.holder = d3.select("body").append("div").classed("popup", true);
        this.initMask();
        this.initUI();

        this.onClose = () => {};
        this.title = "";
    }

    initUI() {
        let t = this;

        let titleBar = this.holder.append("div")
            .classed("popup-titlebar", true);

        titleBar.append("h2")
            .classed("popup-title", true);

        titleBar.append("div")
            .classed("popup-close-button", true)
            .on("click", () => { t.close() })
            .text("Close");

        this.content = this.holder.append("div")
            .classed("popup-content", true);
    }

    initMask() {
        var t = this;
        this.maskBackground =
            d3.select("body")
                .append("div")
                .classed("background-mask", true)
                .on("click", () => { t.close() });
    }

    setTitle(title: string) {
        this.title = title;
        this.holder.select(".popup-title").text(this.title);
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