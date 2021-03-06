import * as d3 from "d3-selection";
import { ExportPopup } from "./popups/ExportPopup";
import { Main } from "../Main";
import { EventManager } from "../events/EventManager";
import { ChangeInteractionStyle } from "../events/ChangeInteractionStyleEvent";
import { ImportPopup } from "./popups/ImportPopup";
import { LoadExamplePopup } from './popups/LoadExamplePopup';

/** Possible interaction styles in our application */
export enum InteractionStyles {
    MOUSE = 0,
    PEN_AND_TOUCH = 1
}

/** A class to create a menu bar for the application */
export class MenuBar {
    /** the application */
    main: Main;
    /** current interaction style. Mouse by default */
    interactionStyle: InteractionStyles;

    constructor(main: Main) {
        this.main = main;
        this.interactionStyle = InteractionStyles.MOUSE;

        this.setupMenu();
    }

    /**
     * Setups the menu bar: an import button, an export button, a title, a button to change interaction style and a button to open the help page
     */
    setupMenu(): void {
        let t = this;
        let menuBar = d3.select("#menu");

        // Title
        menuBar.append("h1")
            .attr("id", "app-title")
            .text("The Interactive Turing Machine");

        // Interaction style switch
        function getInteractionStyleSwitchText(): string {
            return t.interactionStyle !== InteractionStyles.MOUSE
                ? "Use the mouse"
                : "Use Pen & Touch";
        }

        let interactionStyleSwitch = menuBar.append("button")
            .attr("id", "switch-interaction-style-button")
            .text(getInteractionStyleSwitchText())
            .on("click", () => {
                this.switchInteractionStyle();
                interactionStyleSwitch.text(getInteractionStyleSwitchText());
            });

        // Help button 
        menuBar.append("a")
            .attr("id", "help-button")
            .attr("href", "./help.html")
            .attr("target", "_blank")
            .text("Help");

        // Import and export
        menuBar.append("button")
            .attr("id", "import-model-button")
            .text("Import")
            .on("click", () => {
                new ImportPopup(this.main);
            });

        menuBar.append("button")
            .attr("id", "export-model-button")
            .text("Export")
            .on("click", () => {
                new ExportPopup(this.main.turingMachine);
            });

        // Example loading button
        menuBar.append("button")
            .attr("id", "load-example-button")
            .text("Load example")
            .on("click", () => {
                new LoadExamplePopup(this.main);
            });
    }

    /**
     * Switchs the interaction style
     */
    switchInteractionStyle(): void {
        this.interactionStyle = (this.interactionStyle + 1) % 2;
        EventManager.emit(new ChangeInteractionStyle(this.interactionStyle));
    }
}