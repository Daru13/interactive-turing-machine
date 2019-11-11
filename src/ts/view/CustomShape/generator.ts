export function addGenerator(holder: d3.Selection<SVGElement, any, any, any>, r: number): void {
    //size of drawing: 115
    holder.append("g")
        .attr("transform", "scale(" + (2 * r / 115).toString() + ")")
        .node().innerHTML = '<g id="generator">   <defs>    <radialGradient id="Gradient_1" gradientUnits="userSpaceOnUse" cx="0.001" cy="-5.223" r="45.625">      <stop offset="0" stop-color="#FCEE21" stop-opacity="0.4"/>      <stop offset="1" stop-color="#FCEE21" stop-opacity="0"/>    </radialGradient>  </defs>  <g id="Layer_1">    <g>      <g id="Base_16_">        <g>          <path d="M-0,56.748 C-31.291,56.748 -56.748,31.291 -56.748,-0 C-56.748,-31.291 -31.291,-56.748 -0,-56.748 C31.291,-56.748 56.748,-31.291 56.748,-0 C56.748,31.291 31.291,56.748 -0,56.748 z" fill="#545656"/>          <path d="M-0,-55.748 C30.789,-55.748 55.748,-30.789 55.748,-0 C55.748,30.788 30.789,55.748 -0,55.748 C-30.789,55.748 -55.748,30.788 -55.748,-0 C-55.748,-30.789 -30.788,-55.748 -0,-55.748 M-0,-57.748 C-31.842,-57.748 -57.748,-31.842 -57.748,-0 C-57.748,31.843 -31.842,57.748 -0,57.748 C31.843,57.748 57.748,31.843 57.748,-0 C57.748,-31.842 31.843,-57.748 -0,-57.748 L-0,-57.748 z" fill="#000000"/>        </g>        <path d="M-0,-55.748 C-30.789,-55.748 -55.748,-30.789 -55.748,-0 C-55.748,13.376 -51.032,25.648 -43.179,35.256 C-45.735,31.6 -62.388,5.701 -45.021,-24.721 C-39.939,-33.621 -34.371,-39.918 -28.95,-44.918 L28.431,-44.918 C33.878,-39.918 39.466,-33.621 44.547,-24.721 C63.3,8.129 42.635,35.683 42.635,35.683 L42.646,35.879 C50.816,26.181 55.748,13.669 55.748,-0.005 C55.748,-30.794 30.789,-55.748 -0,-55.748 z" fill="#333333"/>        <path d="M-0,-30.825 C28.525,-30.825 51.654,-7.74 51.734,20.766 C54.314,14.346 55.748,7.342 55.748,-0 C55.748,-30.789 30.789,-55.748 -0,-55.748 C-30.789,-55.748 -55.748,-30.789 -55.748,-0 C-55.748,7.342 -54.314,14.346 -51.735,20.766 C-51.654,-7.74 -28.525,-30.825 -0,-30.825 z" fill="#999999" display="none"/>        <path d="M-0,-49.598 C21.825,-49.598 40.957,-38.106 51.703,-20.849 C43.446,-41.306 23.415,-55.748 -0,-55.748 C-23.415,-55.748 -43.445,-41.306 -51.702,-20.849 C-40.957,-38.106 -21.825,-49.598 -0,-49.598 z" fill="#545656" display="none"/>        <g>          <path d="M-0,44.319 C-27.358,44.319 -49.616,22.061 -49.616,-5.297 C-49.616,-32.655 -27.358,-54.913 -0,-54.913 C27.358,-54.913 49.616,-32.655 49.616,-5.297 C49.616,22.061 27.359,44.319 -0,44.319 z" fill="#808080"/>          <path d="M-0,-54.413 C27.127,-54.413 49.116,-32.423 49.116,-5.297 C49.116,21.829 27.127,43.819 -0,43.819 C-27.126,43.819 -49.116,21.829 -49.116,-5.297 C-49.116,-32.423 -27.126,-54.413 -0,-54.413 M-0,-55.413 C-27.634,-55.413 -50.116,-32.931 -50.116,-5.297 C-50.116,22.337 -27.634,44.819 -0,44.819 C27.634,44.819 50.116,22.337 50.116,-5.297 C50.117,-32.931 27.634,-55.413 -0,-55.413 L-0,-55.413 z" fill="#000000"/>        </g>      </g>      <g>        <path d="M-1.737,3.019 C-6.078,1.501 -10.227,0.051 -14.591,-1.475 C-2.871,-15.001 8.722,-28.38 20.315,-41.758 C20.419,-41.707 20.522,-41.656 20.626,-41.605 C14.946,-29.884 9.267,-18.164 3.509,-6.282 C7.788,-4.784 11.939,-3.331 16.37,-1.78 C4.016,9.302 -8.17,20.233 -20.354,31.163 C-20.444,31.089 -20.535,31.013 -20.625,30.938 C-14.361,21.679 -8.098,12.422 -1.737,3.019 z" fill="#FFE461"/>        <path d="M-1.737,3.019 C-6.078,1.501 -10.227,0.051 -14.591,-1.475 C-2.871,-15.001 8.722,-28.38 20.315,-41.758 C20.419,-41.707 20.522,-41.656 20.626,-41.605 C14.946,-29.884 9.267,-18.164 3.509,-6.282 C7.788,-4.784 11.939,-3.331 16.37,-1.78 C4.016,9.302 -8.17,20.233 -20.354,31.163 C-20.444,31.089 -20.535,31.013 -20.625,30.938 C-14.361,21.679 -8.098,12.422 -1.737,3.019 z" fill-opacity="0" stroke="#000000" stroke-width="2" stroke-miterlimit="10"/>      </g>      <path d="M45.626,-5.223 C45.626,19.975 25.199,40.402 0.001,40.402 C-25.197,40.402 -45.624,19.975 -45.624,-5.223 C-45.624,-30.421 -25.197,-50.848 0.001,-50.848 C25.199,-50.848 45.626,-30.421 45.626,-5.223 z" fill="url(#Gradient_1)"/>      <g>        <path d="M-31.989,-5.071 C-31.989,-1.88 -34.576,0.707 -37.767,0.707 C-40.958,0.707 -43.545,-1.88 -43.545,-5.071 C-43.545,-8.262 -40.958,-10.849 -37.767,-10.849 C-34.576,-10.849 -31.989,-8.262 -31.989,-5.071 z" fill="#545656" display="none"/>        <path d="M-33.045,-5.428 C-33.045,-2.83 -35.151,-0.724 -37.749,-0.724 C-40.347,-0.724 -42.453,-2.83 -42.453,-5.428 C-42.453,-8.026 -40.347,-10.132 -37.749,-10.132 C-35.151,-10.132 -33.045,-8.026 -33.045,-5.428 z" fill="#999999" display="none"/>        <g display="none">          <path d="M-41.84,-2.151 L-33.886,-8.7" fill="#999999"/>          <path d="M-41.84,-2.151 L-33.886,-8.7" fill-opacity="0" stroke="#545656" stroke-width="3" stroke-miterlimit="10"/>        </g>      </g>      <g>        <path d="M44.011,-5.071 C44.011,-1.88 41.424,0.707 38.233,0.707 C35.042,0.707 32.455,-1.88 32.455,-5.071 C32.455,-8.262 35.042,-10.849 38.233,-10.849 C41.424,-10.849 44.011,-8.262 44.011,-5.071 z" fill="#545656" display="none"/>        <path d="M42.955,-5.428 C42.955,-2.83 40.849,-0.724 38.251,-0.724 C35.653,-0.724 33.547,-2.83 33.547,-5.428 C33.547,-8.026 35.653,-10.132 38.251,-10.132 C40.849,-10.132 42.955,-8.026 42.955,-5.428 z" fill="#999999" display="none"/>        <g display="none">          <path d="M34.16,-2.151 L42.114,-8.7" fill="#999999"/>          <path d="M34.16,-2.151 L42.114,-8.7" fill-opacity="0" stroke="#545656" stroke-width="3" stroke-miterlimit="10"/>        </g>      </g>    </g>  </g></g>';
}