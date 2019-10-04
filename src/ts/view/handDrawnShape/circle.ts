export function addHandDrawnCircle(holder: d3.Selection<SVGElement, any, any, any>, r: number, classOfCircle: string){
  //size of drawing: 612
  holder.append("g").classed(classOfCircle, true)
    .attr("transform", "scale(" + (2 * r / 612).toString() + 
          ") rotate(" + (Math.floor(Math.random() * 360).toString() + ")") )
    .append("path")
    .attr("d", "M-323.5,-11.5 C-323.5,160.419 -148.768,317.075 15.427,305.958 C188.147,294.263 306.5,185.119 306.5,13.199 C306.5,-158.72 185.621,-287.5 12.5,-287.5 C-160.621,-287.5 -298.037,-166.132 -298.037,5.788 C-298.037,177.707 -160.621,336.5 12.5,336.5 C185.621,336.5 274.123,183.826 288.5,12.5 C303.427,-165.379 188.548,-305.5 15.427,-305.5 C-157.694,-305.5 -275.5,-171.419 -275.5,0.5" )
      .style("fill", "#fff")
      .style("stroke", "#000000") 
      .style("stroke-width", (1.5*612/(2*r)).toString());
}