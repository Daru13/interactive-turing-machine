"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const ExportPopup_1 = require("./popups/ExportPopup");
const EventManager_1 = require("../events/EventManager");
const ChangeInteractionStyleEvent_1 = require("../events/ChangeInteractionStyleEvent");
const ImportPopup_1 = require("./popups/ImportPopup");
const LoadExamplePopup_1 = require("./popups/LoadExamplePopup");
var InteractionStyles;
(function (InteractionStyles) {
    InteractionStyles[InteractionStyles["MOUSE"] = 0] = "MOUSE";
    InteractionStyles[InteractionStyles["PEN_AND_TOUCH"] = 1] = "PEN_AND_TOUCH";
})(InteractionStyles = exports.InteractionStyles || (exports.InteractionStyles = {}));
class MenuBar {
    constructor(main) {
        this.main = main;
        this.interactionStyle = InteractionStyles.MOUSE;
        this.setupMenu();
    }
    setupMenu() {
        let t = this;
        let menuBar = d3.select("#menu");
        menuBar.append("h1")
            .attr("id", "app-title")
            .text("The Interactive Turing Machine");
        function getInteractionStyleSwitchText() {
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
        menuBar.append("a")
            .attr("id", "help-button")
            .attr("href", "./help.html")
            .attr("target", "_blank")
            .text("Help");
        menuBar.append("button")
            .attr("id", "import-model-button")
            .text("Import")
            .on("click", () => {
            new ImportPopup_1.ImportPopup(this.main);
        });
        menuBar.append("button")
            .attr("id", "export-model-button")
            .text("Export")
            .on("click", () => {
            new ExportPopup_1.ExportPopup(this.main.turingMachine);
        });
        menuBar.append("button")
            .attr("id", "load-example-button")
            .text("Load example")
            .on("click", () => {
            new LoadExamplePopup_1.LoadExamplePopup(this.main);
        });
    }
    switchInteractionStyle() {
        this.interactionStyle = (this.interactionStyle + 1) % 2;
        EventManager_1.EventManager.emit(new ChangeInteractionStyleEvent_1.ChangeInteractionStyle(this.interactionStyle));
    }
}
exports.MenuBar = MenuBar;
//# sourceMappingURL=MenuBar.js.map