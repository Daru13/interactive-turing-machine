import * as d3 from "d3-selection";
import { HeadAction } from '../../model/Tape';
import { StateMachine } from "../../model/StateMachine";
import { TransitionID, READ_ANY_SYMBOL, WRITE_NO_SYMBOL } from '../../model/Transition';
import { Editor } from "./Editor";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";
import { CreateEdgeAction } from "../actions/CreateEdgeAction";
import { TuringMachine } from "../../model/TuringMachine";

export class TransitionEdgeEditor extends Editor{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    edge: TransitionEdge;
    stateMachine: StateMachine;
    turingMachine: TuringMachine;

    constructor(edge: TransitionEdge, turingMachine: TuringMachine){
        super(edge);

        this.edge = edge;
        this.turingMachine = turingMachine;
        this.stateMachine = turingMachine.stateMachine;

        this.init();
    }

    init() {
        // Editor-specific class
        this.holder.classed("transition-edge-editor", true);

        // Popup title
        this.setTitle("Edit transition" + (this.edge.transitionIDs.length > 1 ? "s" : ""));

        this.initContent();
        this.initPosition();
        super.setOnClose(() => {this.submit()});
    }

    initContent(): void{
        let table = this.content.append("table");
        this.addHeader(table);
        this.addBody(table);
    }

    addHeader(table: d3.Selection<HTMLTableElement, any, any, any>){
        let header = table.append("thead").append("tr")
        header.append("th").classed("input-symbol", true).text("Input symbol");
        header.append("th").classed("output-symbol", true).text("Output symbol");
        header.append("th").classed("head-action", true).text("Head direction");
        header.append("th").classed("delete-transition", true).text("Delete transition");
    }

    addBody(table: d3.Selection<HTMLTableElement, any, any, any>){
        let body = table.append("tbody");
        this.edge.transitionIDs.forEach(tId => {
            let transition = this.stateMachine.getTransition(tId);
            let row = body.append("tr").datum({ transitionID: tId});
            let cell;
            cell = row.append("td").classed("input-symbol", true);
            this.addTextField(transition.getOnSymbol(), {
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
        });

        this.addPlusButton(body);
    }

    addPlusButton(body){
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

                    CreateEdgeAction.do(fromNode, toNode, this.turingMachine);
                    body.remove();
                    this.addBody(this.content.select("table"));
                })
    }

    addDeleteTransitionButton(holder: d3.Selection<HTMLElement, any, any, any>, row: d3.Selection<HTMLElement, any, any, any>){
        holder
            .append("button")
            .on("click", () => {
                this.stateMachine.removeTransition(holder.datum()["transitionID"]);
                row.remove();
                if(this.holder.select("tbody").selectAll("tr").empty()){
                    this.close();
                }
            })
            .text("Delete");
    }

    addHeadActionSelector(holder: d3.Selection<HTMLElement, any, any, any>, defaultDir: HeadAction) {
        let dirEntry =
            holder
                .append("div")
                .classed("head-action-selector", true);
        dirEntry.datum()["direction"] = defaultDir;

        this.addHeadActionOption(dirEntry, "L", HeadAction.MoveLeft, defaultDir === HeadAction.MoveLeft);
        this.addHeadActionOption(dirEntry, "S", HeadAction.None, defaultDir === HeadAction.None);
        this.addHeadActionOption(dirEntry, "R", HeadAction.MoveRight, defaultDir === HeadAction.MoveRight);
    }

    addHeadActionOption(holder: d3.Selection<HTMLDivElement, any, any, any>, text:string, datum: HeadAction, selected: boolean){
        holder.append("button")
            .text(text)
            .classed("selected", selected)
            .on("click", function () {
                holder.selectAll(".selected").classed("selected", false);
                d3.select(this).classed("selected", true);
                holder.datum()["direction"] = datum;
            });
    }

    submit(): void{
        var t = this
        this.holder.select("tbody").selectAll("tr:not(.new-transition-button-row)").each(function(d) {
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
