import * as d3 from "d3-selection";
import { Selection } from "../../helpers";

/** A class to create a pop up in the app */
export class Popup{
    /** The div classed as a pop up */
    holder: Selection<HTMLDivElement, Element, Object, Object>;
    /** A mask apply behind the pop up to slightly hide the application */
    maskBackground: Selection<HTMLDivElement, Element, Object, Object>;
    /** The content div inside the pop up */
    content: Selection<HTMLDivElement>;

    /** Title of the popup */
    private title: string;
    /** Function called when the pop up is closing */
    private onClose: () => void;

    constructor() {
        this.holder = d3.select("body").append("div").classed("popup", true);
        this.initMask();
        this.initUI();

        this.onClose = () => { };
        this.title = "";
    }

    /**
     * Inits ui of the pop up with a title div, a close button and a content div
     */
    initUI(): void {
        let t = this;

        let titleBar = this.holder.append("div")
            .classed("popup-titlebar", true);

        titleBar.append("h2")
            .classed("popup-title", true);

        titleBar.append("button")
            .classed("popup-close-button", true)
            .on("click", () => { t.close(); } )
            .text("Close");

        this.content = this.holder.append("div")
            .classed("popup-content", true);
    }

    /**
     * Inits the background mask
     */
    initMask(): void {
        let t = this;
        this.maskBackground =
            d3.select("body")
                .append("div")
                .classed("background-mask", true)
                .on("click", () => { t.close(); });
    }

    /**
     * Sets the title of the pop up
     * @param title title to set
     */
    setTitle(title: string): void {
        this.title = title;
        this.holder.select(".popup-title").text(this.title);
    }

    /**
     * Sets the max height for the content div
     * @param maxHeight the max size
     */
    setMaxHeightContent(maxHeight: number): void {
        let computedStyle = window.getComputedStyle(this.content.node(), null);
        let paddingTop = parseInt(computedStyle.getPropertyValue("padding-top"));
        let paddingBottom = parseInt(computedStyle.getPropertyValue("padding-bottom"));
        
        this.content.style("max-height", (maxHeight - paddingTop - paddingBottom).toString() + "px");
    }

    /** Centers the popup in the window */
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

    /**
     * Closes the popup and call onClose
     */
    close(): void {
        this.maskBackground.remove();
        this.holder.remove();
        this.onClose();
    }

    /**
     * Sets onClose
     * @param onClose 
     */
    setOnClose(onClose: () => void): void {
        this.onClose = onClose;
    }
}