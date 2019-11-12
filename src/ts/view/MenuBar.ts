import * as d3 from "d3-selection";
import { ExportPopup } from "./editors/ExportPopup";
import { Main } from "../main";
import { EventManager } from "../events/EventManager";
import { ChangeInteractionStyle } from "../events/ChangeInteractionStyleEvent";
import { ImportPopup } from "./editors/ImportPopup";
import { LoadExamplePopup } from './editors/LoadExamplePopup';

export enum InteractionStyles {
    MOUSE = 0,
    PEN_AND_TOUCH = 1
}

export class MenuBar {
    main: Main;
    interactionStyle: InteractionStyles;

    constructor(main: Main) {
        this.main = main;
        this.interactionStyle = InteractionStyles.MOUSE;

        this.setupMenu();
    }

    setupMenu(): void {
        let t = this;
        let menuBar = d3.select("#menu");

        // Title
        menuBar.append("h1")
            .attr("id", "app-title")
            .text("Interactive Turing Machine");

        // Interaction style switch
        function getInteractionStyleSwitchText(): string {
            return t.interactionStyle !== InteractionStyles.MOUSE
                ? "Use Mouse interactions"
                : "Use Pen&Touch interactions";
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
            .attr("href", "./helpPage.html")
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

    switchInteractionStyle(): void {
        this.interactionStyle = (this.interactionStyle + 1) % 2;
        EventManager.emit(new ChangeInteractionStyle(this.interactionStyle));
    }
}