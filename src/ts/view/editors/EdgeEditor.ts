import * as d3 from "d3-selection";
import { EdgeHandleSelection } from "../graph/Edge";
import { HeadAction } from "../../model/Tape";
import { StateMachine } from "../../model/StateMachine";
import { TransitionID } from "../../model/Transition";

export class EdgeEditor{
    holder: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    edge: EdgeHandleSelection;
    stateMachine: StateMachine;

    constructor(edge: EdgeHandleSelection, stateMachine: StateMachine){
        d3.select("body").selectAll(".EdgeEditor").remove();
        d3.selectAll(".edge.selected").classed("selected", false);
        this.holder = d3.select("body").append("div").classed("EdgeEditor", true);
        this.edge = edge;
        this.edge.classed("selected", true);
        this.stateMachine= stateMachine;
        this.setupUI();
    }

    setupUI(): void{
        this.addHeader();
        this.addBody();
        this.addFooter();
    }

    addHeader(){
        let header = this.holder.append("div").classed("header", true);
        header.append("div").classed("cell", true).text("Read");
        header.append("div").classed("cell", true).text("Write");
        header.append("div").classed("cell", true).text("Direction");
    }

    addBody(){
        let body = this.holder.append("div").classed("body", true)
        this.edge.datum().transitionID.forEach(tId => {
            let row = body.append("div").classed("row", true).datum(tId);
            this.addTextField(row, this.stateMachine.getTransition(tId).getOnSymbol(), "OnSymbol");
            this.addTextField(row, this.stateMachine.getTransition(tId).getOutputSymbol(), "OutputSymbol");
            this.addDirEntry(row, this.stateMachine.getTransition(tId).getHeadAction(), "HeadAction");
        });
    }

    addFooter(){
        let footer = this.holder.append("div").classed("footer", true)
        this.addButton(footer, "Submit", "submit", this.submit);
        this.addButton(footer, "Cancel", "cancel", this.close);
    }

    addDirEntry(holder: d3.Selection<HTMLElement, any, any, any>, defaultDir: HeadAction, id: string) {
        let dirEntry =
            holder.append("div")
                .attr("id", id)
                .classed("cell", true)
                .append("div")
                .classed("dirEntryButton", true);

        this.addDirButton(dirEntry, "L", HeadAction.MoveLeft, false);
        this.addDirButton(dirEntry, "S", HeadAction.None, true);
        this.addDirButton(dirEntry, "R", HeadAction.MoveRight, false);
    }

    addDirButton(holder: d3.Selection<HTMLDivElement, any, any, any>, text:string, datum: HeadAction, selected: boolean){
        holder.append("div")
            .text(text)
            .attr("id", "rightSwitch")
            .datum(datum)
            .classed("selected", selected)
            .on("click", function () {
                holder.select(".selected").classed("selected", false);
                d3.select(this).classed("selected", true);
            });
    }

    addButton(holder: d3.Selection<HTMLElement, any, any, any>, text: string, id: string, funct): void {
        var t = this;
        holder.append("div")
            .attr("id", id)
            .classed("cell", true)
            .append("div")
                .classed("button", true)
                .on("click", e => funct(t))
                .text(text);
    }

    addTextField(holder: d3.Selection<HTMLElement, any, any, any>, defaultText: string, id: string) {
        holder
            .append("input")
                .attr("type", "text")
                .attr("id", id)
                .attr("value", defaultText)
    }

    submit(edgeEditor: EdgeEditor): void{
        edgeEditor.holder.select(".body").selectAll(".row").each(function(d){
            let onSymbol = (d3.select(this).select("#OnSymbol").node() as HTMLInputElement).value;
            let outputSymbol =  (d3.select(this).select("#OutputSymbol").node() as HTMLInputElement).value;
            let headAction = d3.select(this).select("#HeadAction").select(".selected").datum() as HeadAction;
          
            let transition = edgeEditor.stateMachine.getTransition(d as TransitionID);
          
            transition.setOnSymbol(onSymbol);
            transition.setOutputSymbol(outputSymbol);
            transition.setHeadAction(headAction);
        });

        console.log(edgeEditor.stateMachine.toString());        
        edgeEditor.close(edgeEditor);
    }

    close(edgeEditor): void{
        edgeEditor.edge.classed("selected", false);
        d3.select("body").selectAll(".EdgeEditor").remove();
    }
}
