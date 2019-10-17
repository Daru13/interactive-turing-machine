export function addGenerator(holder: d3.Selection<SVGElement, any, any, any>, r: number) {
    //size of drawing: 115
    holder.append("g")
        .attr("transform", "scale(" + (2 * r / 115).toString() +")")
        .node().innerHTML = '<g id="generator">  <g><path d="M-57,-12.1 L-41,-12.1 L-41,-0.1 L-57,-0.1 z" fill="#AD6464"/><path d="M-57,-10.1 L-41,-10.1 L-41,-4.1 L-57,-4.1 z" fill="#E88787"/>  </g>  <g><path d="M-57,4.9 L-41,4.9 L-41,16.9 L-57,16.9 z" fill="#6581AA"/><path d="M-57,6.9 L-41,6.9 L-41,12.9 L-57,12.9 z" fill="#88ADE5"/>  </g>  <g><g id="Base_1_">  <g><path d="M14.861,57.496 C-16.43,57.496 -41.887,32.039 -41.887,0.748 C-41.887,-30.543 -16.43,-56 14.861,-56 C46.152,-56 71.609,-30.543 71.609,0.748 C71.609,32.039 46.152,57.496 14.861,57.496 z" fill="#BCBFBF"/><path d="M14.861,-55 C45.65,-55 70.609,-30.041 70.609,0.748 C70.609,31.536 45.65,56.496 14.861,56.496 C-15.928,56.496 -40.887,31.536 -40.887,0.748 C-40.887,-30.041 -15.927,-55 14.861,-55 M14.861,-57 C-16.981,-57 -42.887,-31.094 -42.887,0.748 C-42.887,32.591 -16.981,58.496 14.861,58.496 C46.704,58.496 72.609,32.591 72.609,0.748 C72.609,-31.095 46.704,-57 14.861,-57 L14.861,-57 z" fill="#545656"/>  </g>  <path d="M14.861,-55 C-15.928,-55 -40.887,-30.041 -40.887,0.748 C-40.887,14.124 -36.171,26.396 -28.318,36.004 C-30.874,32.348 -47.527,6.484 -30.16,-23.937 C-25.078,-32.837 -19.51,-39.335 -14.089,-44.099 L43.292,-44.099 C48.739,-39.335 54.327,-32.837 59.408,-23.937 C78.161,8.913 57.496,36.45 57.496,36.45 L57.507,36.638 C65.677,26.94 70.609,14.423 70.609,0.749 C70.609,-30.041 45.65,-55 14.861,-55 z" fill="#999999"/>  <path d="M14.861,-30.078 C43.386,-30.078 66.515,-6.993 66.595,21.513 C69.175,15.093 70.609,8.089 70.609,0.747 C70.609,-30.042 45.65,-55.001 14.861,-55.001 C-15.928,-55.001 -40.887,-30.042 -40.887,0.747 C-40.887,8.089 -39.453,15.093 -36.874,21.513 C-36.793,-6.993 -13.664,-30.078 14.861,-30.078 z" fill="#999999" display="none"/>  <path d="M14.861,-48.85 C36.686,-48.85 55.818,-37.358 66.564,-20.101 C58.307,-40.558 38.276,-55 14.861,-55 C-8.554,-55 -28.584,-40.558 -36.841,-20.101 C-26.096,-37.358 -6.964,-48.85 14.861,-48.85 z" fill="#545656" display="none"/>  <g><path d="M14.861,45.067 C-12.497,45.067 -34.755,22.809 -34.755,-4.549 C-34.755,-31.907 -12.497,-54.165 14.861,-54.165 C42.219,-54.165 64.477,-31.907 64.477,-4.549 C64.477,22.809 42.22,45.067 14.861,45.067 z" fill="#DCE2E2"/><path d="M14.861,-53.665 C41.988,-53.665 63.977,-31.675 63.977,-4.549 C63.977,22.577 41.988,44.567 14.861,44.567 C-12.265,44.567 -34.255,22.577 -34.255,-4.549 C-34.255,-31.675 -12.265,-53.665 14.861,-53.665 M14.861,-54.665 C-12.773,-54.665 -35.255,-32.183 -35.255,-4.549 C-35.255,23.085 -12.773,45.567 14.861,45.567 C42.495,45.567 64.977,23.085 64.977,-4.549 C64.978,-32.183 42.495,-54.665 14.861,-54.665 L14.861,-54.665 z" fill="#999999"/>  </g></g><g>  <path d="M13.625,4.17 C9.284,2.652 5.135,1.202 0.77,-0.324 C12.49,-13.85 24.083,-27.229 35.676,-40.608 C35.78,-40.557 35.883,-40.506 35.987,-40.455 C30.307,-28.734 24.628,-17.014 18.87,-5.131 C23.149,-3.633 27.3,-2.18 31.731,-0.629 C19.377,10.453 7.191,21.383 -4.993,32.314 C-5.083,32.24 -5.174,32.164 -5.264,32.089 C1,22.83 7.263,13.572 13.625,4.17 z" fill="#FFE461"/>  <path d="M13.625,4.17 C9.284,2.652 5.135,1.202 0.77,-0.324 C12.49,-13.85 24.083,-27.229 35.676,-40.608 C35.78,-40.557 35.883,-40.506 35.987,-40.455 C30.307,-28.734 24.628,-17.014 18.87,-5.131 C23.149,-3.633 27.3,-2.18 31.731,-0.629 C19.377,10.453 7.191,21.383 -4.993,32.314 C-5.083,32.24 -5.174,32.164 -5.264,32.089 C1,22.83 7.263,13.572 13.625,4.17 z" fill-opacity="0" stroke="#969654" stroke-width="2" stroke-miterlimit="10"/></g><g>  <path d="M-17.128,-4.323 C-17.128,-1.132 -19.715,1.455 -22.906,1.455 C-26.097,1.455 -28.684,-1.132 -28.684,-4.323 C-28.684,-7.514 -26.097,-10.101 -22.906,-10.101 C-19.715,-10.101 -17.128,-7.514 -17.128,-4.323 z" fill="#999999"/>  <path d="M-18.184,-4.68 C-18.184,-2.082 -20.29,0.024 -22.888,0.024 C-25.486,0.024 -27.592,-2.082 -27.592,-4.68 C-27.592,-7.278 -25.486,-9.384 -22.888,-9.384 C-20.29,-9.384 -18.184,-7.278 -18.184,-4.68 z" fill="#BCBFBF"/>  <g><path d="M-26.479,-0.903 L-18.525,-7.453" fill="#999999"/><path d="M-26.479,-0.903 L-18.525,-7.453" fill-opacity="0" stroke="#999999" stroke-width="3" stroke-miterlimit="10"/>  </g></g><g>  <path d="M58.872,-4.323 C58.872,-1.132 56.285,1.455 53.094,1.455 C49.903,1.455 47.316,-1.132 47.316,-4.323 C47.316,-7.514 49.903,-10.101 53.094,-10.101 C56.285,-10.101 58.872,-7.514 58.872,-4.323 z" fill="#999999"/>  <path d="M57.816,-4.68 C57.816,-2.082 55.71,0.024 53.112,0.024 C50.514,0.024 48.408,-2.082 48.408,-4.68 C48.408,-7.278 50.514,-9.384 53.112,-9.384 C55.71,-9.384 57.816,-7.278 57.816,-4.68 z" fill="#BCBFBF"/>  <g><path d="M49.521,-0.903 L57.475,-7.453" fill="#999999"/><path d="M49.521,-0.903 L57.475,-7.453" fill-opacity="0" stroke="#999999" stroke-width="3" stroke-miterlimit="10"/>  </g></g>  </g></g>'
}