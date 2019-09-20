import * as d3 from "d3-selection";
export class SVGInteraction {
  eX: number;
  eY: number;
  svg: any;
  nodeId: number;

  constructor(svg: any){
    this.eX = 0;
    this.eY = 0;
    this.svg = svg
    this.nodeId = 0
  }

  pointerDown(e: any){
    this.eX = e.x;
    this.eY = e.y;
  }

  pointerMove(e: any){}

  pointerUp(e: any){
    this.svg
      .append("circle")
        .attr("cx", this.eX)
        .attr("cy", this.eY)
        .attr("r", 30)
        .classed("node", true)
        .attr("id", this.nodeId)
        .datum(this.nodeId);
    this.nodeId += 1;
  }
}
