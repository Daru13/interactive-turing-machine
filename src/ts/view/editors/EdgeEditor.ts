import * as d3 from "d3-selection";
import { EdgeHandleSelection } from "../graph/Edge";
import { HeadAction } from "../../model/Tape";
import { StateMachine } from "../../model/StateMachine";
import { TransitionID } from "../../model/Transition";
import { Editor } from "./Editor";

export class EdgeEditor extends Editor{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    edge: EdgeHandleSelection;
    stateMachine: StateMachine;

    constructor(edge: EdgeHandleSelection, stateMachine: StateMachine){
        super(edge);
        this.edge = edge;
        this.stateMachine = stateMachine;

        this.holder.classed("edge-editor", true);

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
        header.append("th").classed("input-symbol", true).text("Read");
        header.append("th").classed("output-symbol", true).text("Write");
        header.append("th").classed("head-action", true).text("Direction");
        header.append("th").classed("delete-transition", true).text("");
    }

    addBody(table: d3.Selection<HTMLTableElement, any, any, any>){
        let body = table.append("tbody");
        this.edge.datum().transitionID.forEach(tId => {
            let transition = this.stateMachine.getTransition(tId);
            let row = body.append("tr").datum({ transitionID: tId});
            let cell;
            cell = row.append("td")
            this.addTextField(transition.getOnSymbol(), "input-symbol", null, cell);

            cell = row.append("td")
            this.addTextField(transition.getOutputSymbol(), "output-symbol", null, cell);

            cell = row.append("td")
            this.addHeadActionSelector(row, transition.getHeadAction(), "head-action");

            cell = row.append("td")
            this.addDeleteTransitionButton(row);
        });
    }

    addDeleteTransitionButton(holder: d3.Selection<HTMLElement, any, any, any>){
        let t = this;
        holder
            .append("button")
            .classed("delete-action", true)
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

    addHeadActionSelector(holder: d3.Selection<HTMLElement, any, any, any>, defaultDir: HeadAction, id: string) {
        let dirEntry =
            holder
                .append("div")
                .attr("id", id)
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
            let onSymbol = (d3.select(this).select("#input-symbol").node() as HTMLInputElement).value;
            let outputSymbol = (d3.select(this).select("#output-symbol").node() as HTMLInputElement).value;
            let headAction = d3.select(this).select("#head-action").datum()["direction"];
          
            let transition = t.stateMachine.getTransition(d["transitionID"] as TransitionID);
          
            transition.setOnSymbol(onSymbol);
            transition.setOutputSymbol(outputSymbol);
            transition.setHeadAction(headAction);
        });

        console.log(this.stateMachine.toString());
    }
}
