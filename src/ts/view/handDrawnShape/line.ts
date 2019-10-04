export function addHandDrawnLine(holder: d3.Selection<SVGElement, any, any, any>, len: number, strokeWidth: number, classOfLine: string) {
  //len of drawing: 284 height: 22
  holder.append("g").classed(classOfLine, true)
    .attr("transform", "scale(" + (len/ 284).toString() +"," +  (strokeWidth/22).toString() +")")
    .append("path")
    .attr("d", "M262.9,-12.864 C237.394,-13.934 88.48,-26.94 4.024,-6.744 C-2.096,-5.52 -0.872,4.883 5.249,4.271 C92.765,-6.744 242.192,1.931 267.185,3.047 C292.673,1.435 288.405,-11.795 262.9,-12.864 z" )
    .style("fill", "#000");
}