import * as d3 from "d3-selection";

export class Popup{
    holder: d3.Selection<HTMLDivElement, { }, HTMLElement, { }>;
    maskBackground: d3.Selection<HTMLDivElement, { }, HTMLElement, { }>;
    content: d3.Selection<HTMLDivElement, { }, HTMLElement, { }>;

    private title: string;
    private onClose: () => void;

    constructor() {
        this.holder = d3.select("body").append("div").classed("popup", true);
        this.initMask();
        this.initUI();

        this.onClose = () => { };
        this.title = "";
    }

    initUI(): void {
        let t = this;

        let titleBar = this.holder.append("div")
            .classed("popup-titlebar", true);

        titleBar.append("h2")
            .classed("popup-title", true);

        titleBar.append("div")
            .classed("popup-close-button", true)
            .on("click", () => { t.close(); } )
            .text("Close");

        this.content = this.holder.append("div")
            .classed("popup-content", true);
    }

    initMask(): void {
        let t = this;
        this.maskBackground =
            d3.select("body")
                .append("div")
                .classed("background-mask", true)
                .on("click", () => { t.close(); });
    }

    setTitle(title: string): void {
        this.title = title;
        this.holder.select(".popup-title").text(this.title);
    }

    setMaxSizeContent(maxHeight: number): void {
        let computedStyle = window.getComputedStyle(this.content.node(), null);
        let paddingTop = parseInt(computedStyle.getPropertyValue("padding-top"));
        let paddingBottom = parseInt(computedStyle.getPropertyValue("padding-bottom"));
        
        this.content.style("max-height", (maxHeight - paddingTop - paddingBottom).toString() + "px");
    }

    center(): void {
        let popupBoundingBox = this.holder.node().getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
    
        let top = (windowHeight / 2) - (popupBoundingBox.height / 2);
        let left = (windowWidth / 2) - (popupBoundingBox.width / 2);

        this.holder
            .style("top", top.toString() + "px")
            .style("left", left.toString() + "px");
    }

    close(): void {
        this.maskBackground.remove();
        this.holder.remove();
        this.onClose();
    }

    setOnClose(onClose: () => void): void {
        this.onClose = onClose;
    }
}