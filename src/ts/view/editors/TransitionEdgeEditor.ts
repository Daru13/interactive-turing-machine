import * as d3 from "d3-selection";
import { EdgeSelection } from "../graph/Edge/Edge";
import { HeadAction } from "../../model/Tape";
import { StateMachine } from "../../model/StateMachine";
import { TransitionID } from "../../model/Transition";
import { Editor } from "./Editor";
import { TransitionEdge } from "../graph/Edge/TransitionEdge";

export class TransitionEdgeEditor extends Editor{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    edge: TransitionEdge;
    stateMachine: StateMachine;

    constructor(edge: TransitionEdge, stateMachine: StateMachine){
        super(edge);

        this.edge = edge;
        this.stateMachine = stateMachine;

        this.init();
    }

    init() {
        // Editor-specific class
        this.holder.classed("transition-edge-editor", true);

        // Popup title
        this.setTitle("Edit transition" + (this.edge.transitionIDs.length > 1 ? "s" : ""));

        this.initContent();
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
            this.addTextField(transition.getOnSymbol(), null, null, cell);

            cell = row.append("td").classed("output-symbol", true);
            this.addTextField(transition.getOutputSymbol(), null, null, cell);

            cell = row.append("td").classed("head-action", true);
            this.addHeadActionSelector(cell, transition.getHeadAction());

            cell = row.append("td").classed("delete-transition", true);
            this.addDeleteTransitionButton(cell);
        });
    }

    addDeleteTransitionButton(holder: d3.Selection<HTMLElement, any, any, any>){
        let t = this;
        holder
            .append("button")
            .on("click", function(){
                t.stateMachine.removeTransition(holder.datum()["transitionID"]);
                holder.remove();
                if(t.holder.select("tbody").selectAll("tr").empty()){
                    t.close();
                }
                console.log(t.stateMachine.toString())
            })
            .text("Delete");
    }

    addHeadActionSelector(holder: d3.Selection<HTMLElement, any, any, any>, defaultDir: HeadAction) {
        let dirEntry =
            holder
                .append("div")
                .classed("head-action-selector", true);
        dirEntry.datum()["direction"] = defaultDir;
        console.log(defaultDir);

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
        this.holder.select("tbody").selectAll("tr").each(function(d){
            let row = d3.select(this);
            let onSymbol = (row.select(".input-symbol").select("input").node() as HTMLInputElement).value;
            let outputSymbol = (row.select(".output-symbol").select("input").node() as HTMLInputElement).value;
            let headAction = row.select(".head-action").select(".selected").datum()["direction"];
          
            let transition = t.stateMachine.getTransition(d["transitionID"] as TransitionID);
          
            transition.setOnSymbol(onSymbol);
            transition.setOutputSymbol(outputSymbol);
            transition.setHeadAction(headAction);
        });

        console.log(this.stateMachine.toString());
    }
}
