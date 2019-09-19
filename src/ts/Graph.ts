import * as d3 from "d3-selection";

export class Graph {
  svg: any;

  constructor() {
    this.svg = d3.select("#graph").append("svg");
    this.svg.on("mouseup", (e: any) => this.addNode(e))
  }

  addNode(e: any) {
    console.log(d3.event);
    let x = d3.event.pageX;
    let y = d3.event.pageY;
    this.svg
      .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 10)
  }
}
