import * as d3 from "d3-selection";
import { HeadAction } from '../../model/Tape';
import { StateMachine } from "../../model/StateMachine";
import { TransitionID, READ_ANY_SYMBOL, WRITE_NO_SYMBOL } from '../../model/Transition';
import { Editor } from "./EditorPopup";
import { TransitionEdge } from "../graph/edges/TransitionEdge";
import { CreateTransitionAction } from "../actions/CreateTransitionAction";
import { TuringMachine } from "../../model/TuringMachine";

/**
 * A class to create an editor for a transition edge
 */
export class TransitionEdgeEditor extends Editor{
    /** The edge to edit */
    edge: TransitionEdge;
    /** State machine containing the transitions associated to the edge */
    stateMachine: StateMachine;
    /** The Turing machine containting the state machine*/
    turingMachine: TuringMachine;

    constructor(edge: TransitionEdge, turingMachine: TuringMachine) {
        super(edge);

        this.edge = edge;
        this.turingMachine = turingMachine;
        this.stateMachine = turingMachine.stateMachine;

        this.init();
    }

    /**
     * Inits transition edge editor
     */
    init(): void {
        // Editor-specific class
        this.holder.classed("transition-edge-editor", true);

        // Popup title
        this.setTitle("Edit transition" + (this.edge.transitionIDs.length > 1 ? "s" : ""));

        this.initContent();
        this.initPosition();
        super.setOnClose(() => { this.submit(); });
    }

    /**
     * Inits the table containing the properties of one transition per row
     */
    initContent(): void {
        let table = this.content.append("table");
        this.addHeader(table);
        this.addBody(table);
    }

    /**
     * Adds header to the table with the label of transition properties that can be set
     * @param table 
     */
    addHeader(table: d3.Selection<HTMLTableElement, any, any, any>): void {
        let header = table.append("thead").append("tr");
        header.append("th").classed("input-symbol", true).text("Input symbol");
        header.append("th").classed("output-symbol", true).text("Output symbol");
        header.append("th").classed("head-action", true).text("Head direction");
        header.append("th").classed("delete-transition", true).text("Delete transition");
    }

    /**
     * Adds body to the table with one row per transition plus a row with a plus button to add a new transition
     * @param table 
     */
    addBody(table: d3.Selection<HTMLTableElement, any, any, any>): void {
        let body = table.append("tbody");

        this.edge.transitionIDs.forEach((transitionId) => {
            this.addTransitionRow(transitionId, body);
        });

        this.addPlusButton(body);
    }

    /**
     * Adds a row for a transition with a field for: input symbol, output symbol, head action and a delete button
     * @param transitionId Id of the transition
     * @param body body where to add the row
     */
    addTransitionRow(transitionId: TransitionID, body: d3.Selection<HTMLTableSectionElement, any, any, any>): void {
        let transition = this.stateMachine.getTransition(transitionId);
        let row = body.append("tr").datum({ transitionID: transitionId });
        let cell;
        
        // Text field for the input text field
        cell = row.append("td").classed("input-symbol", true);
        this.addTextField(transition.getOnSymbol(), {
            placeholder: "Any",
            maxlength: "1"
        }, cell);

        // Text field for the output symbol
        cell = row.append("td").classed("output-symbol", true);
        this.addTextField(transition.getOutputSymbol(), {
            placeholder: "None",
            maxlength: "1"
        }, cell);

        // Button to select the direction of the head
        cell = row.append("td").classed("head-action", true);
        this.addHeadActionSelector(cell, transition.getHeadAction());

        // Button to delete the transition
        cell = row.append("td").classed("delete-transition", true);
        this.addDeleteTransitionButton(cell, row);
    }

    /**
     * Adds plus button in the body to add a new transition
     * @param body 
     */
    addPlusButton(body: d3.Selection<HTMLTableSectionElement, any, any, any>): void {
        let fromNode = this.edge.fromStateNode;
        let toNode = this.edge.toStateNode;

        let row = body.append("tr")
            .classed("new-transition-button-row", true);
            
        row.append("td")
            .attr("colspan", "4")
            .append("button")
                .text("New transition")
                .on("click", () => {
                    this.submit();

                    CreateTransitionAction.do(fromNode, toNode, this.turingMachine);
                    body.remove();
                    this.addBody(this.content.select("table"));
                });
    }

    /**
     * Adds a button to delete a transition
     * @param parent where to put the button
     * @param row row corresponding to the transition to delete
     */
    addDeleteTransitionButton(parent: d3.Selection<HTMLElement, any, any, any>, row: d3.Selection<HTMLElement, any, any, any>): void {
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

    /**
     * Adds selector for the action of the head of the tape
     * @param parent where to put the selector
     * @param defaultDir default action to be selected
     */
    addHeadActionSelector(parent: d3.Selection<HTMLElement, any, any, any>, defaultDir: HeadAction): void {
        let dirEntry = parent
            .append("div")
            .classed("head-action-selector", true);
        dirEntry.datum()["direction"] = defaultDir;

        this.addHeadActionOption(dirEntry, "←", HeadAction.MoveLeft, defaultDir === HeadAction.MoveLeft);
        this.addHeadActionOption(dirEntry, "∅", HeadAction.None, defaultDir === HeadAction.None);
        this.addHeadActionOption(dirEntry, "→", HeadAction.MoveRight, defaultDir === HeadAction.MoveRight);
    }

    /**
     * Adds button to a select on action for the head of the tape
     * @param parent where to put the button
     * @param text text of the button
     * @param datum the action for this button
     * @param selected if the button is selected by default
     */
    addHeadActionOption(parent: d3.Selection<HTMLDivElement, any, any, any>, text: string, datum: HeadAction, selected: boolean): void {
        parent.append("button")
            .text(text)
            .classed("selected", selected)
            .on("click", function(): void {
                parent.selectAll(".selected").classed("selected", false);
                d3.select(this).classed("selected", true);
                parent.datum()["direction"] = datum;
            });
    }

    /**
     * Submits every changes done in the editor on transitions
     */
    submit(): void {
        let t = this;
        this.holder.select("tbody").selectAll("tr:not(.new-transition-button-row)").each(function(d: { transitionID: TransitionID}): void {
            let row = d3.select(this);
            let transition = t.stateMachine.getTransition(d["transitionID"] as TransitionID);

            let inputSymbol = (row.select(".input-symbol").select("input").node() as HTMLInputElement).value;
            transition.setOnSymbol(inputSymbol === "" ? READ_ANY_SYMBOL : inputSymbol);

            let outputSymbol = (row.select(".output-symbol").select("input").node() as HTMLInputElement).value;
            transition.setOutputSymbol(outputSymbol === "" ? WRITE_NO_SYMBOL : outputSymbol);

            let headAction = row.select(".head-action").select(".selected").datum()["direction"];
            transition.setHeadAction(headAction);
        });
    }
}
