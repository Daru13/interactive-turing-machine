"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Tape_1 = require("../../model/Tape");
const Transition_1 = require("../../model/Transition");
const EditorPopup_1 = require("./EditorPopup");
const CreateTransitionAction_1 = require("../actions/CreateTransitionAction");
class TransitionEdgeEditor extends EditorPopup_1.Editor {
    constructor(edge, turingMachine) {
        super(edge);
        this.edge = edge;
        this.turingMachine = turingMachine;
        this.stateMachine = turingMachine.stateMachine;
        this.init();
    }
    init() {
        this.holder.classed("transition-edge-editor", true);
        this.setTitle("Edit transition" + (this.edge.transitionIDs.length > 1 ? "s" : ""));
        this.initContent();
        this.initPosition();
        super.setOnClose(() => { this.submit(); });
    }
    initContent() {
        let table = this.content.append("table");
        this.addHeader(table);
        this.addBody(table);
    }
    addHeader(table) {
        let header = table.append("thead").append("tr");
        header.append("th").classed("input-symbol", true).text("Input symbol");
        header.append("th").classed("output-symbol", true).text("Output symbol");
        header.append("th").classed("head-action", true).text("Head direction");
        header.append("th").classed("delete-transition", true).text("Delete transition");
    }
    addBody(table) {
        let body = table.append("tbody");
        this.edge.transitionIDs.forEach((transitionId) => {
            this.addTransitionRow(transitionId, body);
        });
        this.addPlusButton(body);
    }
    addTransitionRow(transitionId, body) {
        let transition = this.stateMachine.getTransition(transitionId);
        let row = body.append("tr").datum({ transitionID: transitionId });
        let cell;
        cell = row.append("td").classed("input-symbol", true);
        this.addTextField(transition.getInputSymbol(), {
            placeholder: "Any",
            maxlength: "1"
        }, cell);
        cell = row.append("td").classed("output-symbol", true);
        this.addTextField(transition.getOutputSymbol(), {
            placeholder: "None",
            maxlength: "1"
        }, cell);
        cell = row.append("td").classed("head-action", true);
        this.addHeadActionSelector(cell, transition.getHeadAction());
        cell = row.append("td").classed("delete-transition", true);
        this.addDeleteTransitionButton(cell, row);
    }
    addPlusButton(body) {
        let originNode = this.edge.originNode;
        let destinationNode = this.edge.destinationNode;
        let row = body.append("tr")
            .classed("new-transition-button-row", true);
        row.append("td")
            .attr("colspan", "4")
            .append("button")
            .text("New transition")
            .on("click", () => {
            this.submit();
            CreateTransitionAction_1.CreateTransitionAction.do(originNode, destinationNode, this.turingMachine);
            body.remove();
            this.addBody(this.content.select("table"));
        });
    }
    addDeleteTransitionButton(parent, row) {
        parent
            .append("button")
            .on("click", () => {
            this.stateMachine.removeTransition(parent.datum()["transitionID"]);
            row.remove();
            if (this.holder.select("tbody").selectAll("tr:not(.new-transition-button-row)").empty()) {
                this.close();
            }
        })
            .text("Delete");
    }
    addHeadActionSelector(parent, defaultDir) {
        let dirEntry = parent
            .append("div")
            .classed("head-action-selector", true);
        dirEntry.datum()["direction"] = defaultDir;
        this.addHeadActionOption(dirEntry, "←", Tape_1.HeadAction.MoveLeft, defaultDir === Tape_1.HeadAction.MoveLeft);
        this.addHeadActionOption(dirEntry, "∅", Tape_1.HeadAction.None, defaultDir === Tape_1.HeadAction.None);
        this.addHeadActionOption(dirEntry, "→", Tape_1.HeadAction.MoveRight, defaultDir === Tape_1.HeadAction.MoveRight);
    }
    addHeadActionOption(parent, text, datum, selected) {
        parent.append("button")
            .text(text)
            .classed("selected", selected)
            .on("click", function () {
            parent.selectAll(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            parent.datum()["direction"] = datum;
        });
    }
    submit() {
        let t = this;
        this.holder.select("tbody").selectAll("tr:not(.new-transition-button-row)").each(function (d) {
            let row = d3.select(this);
            let transition = t.stateMachine.getTransition(d["transitionID"]);
            let inputSymbol = row.select(".input-symbol").select("input").node().value;
            transition.setInputSymbol(inputSymbol === "" ? Transition_1.READ_ANY_SYMBOL : inputSymbol);
            let outputSymbol = row.select(".output-symbol").select("input").node().value;
            transition.setOutputSymbol(outputSymbol === "" ? Transition_1.WRITE_NO_SYMBOL : outputSymbol);
            let headAction = row.select(".head-action").select(".selected").datum()["direction"];
            transition.setHeadAction(headAction);
        });
    }
}
exports.TransitionEdgeEditor = TransitionEdgeEditor;
//# sourceMappingURL=TransitionEdgeEditorPopup.js.map