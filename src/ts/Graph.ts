import d3 = require("d3");

export class Graph {
  svg: any;

  constructor() {
    this.svg = d3.select("#graph").append("svg");
    this.svg.on("mouseup", (e: Event) => this.addNode(e))
  }

  addNode(e: Event) {
    console.log(e)
    /*this.svg
      .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 10)*/
  }
}
