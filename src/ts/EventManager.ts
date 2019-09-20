import * as d3 from "d3-selection";
import { NodeInteraction } from "./interaction/nodeInteraction";

export class EventManager {
  classInteraction: Object;
  idInteraction: Object;
  tagInteraction: Object;
  idToInteraction: Object;

  constructor(){
    this.classInteraction = {};
    this.idInteraction = {};
    this.tagInteraction = {};
    this.idToInteraction = {};

    var t = this;

    document.querySelector("body").addEventListener("pointerdown",
      function(e){t.downEvent(t.transformEvent(e))})
    document.querySelector("body").addEventListener("pointermove",
      function(e){t.moveEvent(t.transformEvent(e))})
    document.querySelector("body").addEventListener("pointerup",
      function(e){t.upEvent(t.transformEvent(e))})
    document.querySelector("body").addEventListener("pointercancel",
      (e: PointerEvent) => console.log("cancel"))
  }

  downEvent(e){
    let target = d3.select(e.target as any)
    for(var x in this.tagInteraction){
      if(target.node().tagName == x){
        this.idToInteraction[e.pointerId] = this.tagInteraction[x];
        this.idToInteraction[e.pointerId].pointerDown(e);
        return;
      }
    }

    for(var x in this.idInteraction){
      if(target.attr("id") != undefined){
        if(target.attr("id") == x){
          this.idToInteraction[e.pointerId] = this.idInteraction[x];
          this.idToInteraction[e.pointerId].pointerDown(e);
          return;
        }
      }
    }

    for(var x in this.classInteraction){
      if(target.classed(x)){
        this.idToInteraction[e.pointerId] = this.classInteraction[x];
        this.idToInteraction[e.pointerId].pointerDown(e);
        return;
      }
    }
  }

  moveEvent(e){
    if(this.idToInteraction[e.pointerId] != undefined){
      this.idToInteraction[e.pointerId].pointerMove(e);
    }
  }

  upEvent(e){
    console.log("up")
    if(this.idToInteraction[e.pointerId] != undefined){
      this.idToInteraction[e.pointerId].pointerUp(e);
      delete this.idToInteraction[e.pointerId]
    }
  }

  transformEvent(e: PointerEvent){
    console.log(e.pointerId)
    e.preventDefault()
    e.stopPropagation()
    var pointerType = e.pointerType;
    if(e.pointerType == "mouse") {
      pointerType = "touch";
    }

    if(e.altKey && e.pointerType == "mouse") {
      pointerType = "pen";
    }

    if((e.pointerType == "pen" && e.button == 5) || (e.shiftKey && e.pointerType == "mouse")) {
      pointerType = "eraser";
    }

    if((e.pointerType == "pen" || e.pointerType == "mouse") && e.button == 2) {
      pointerType = "modify";
    }

    return {"pointerId":e.pointerId, "pointerType": pointerType, "x": e.x,"y": e.y, offsetX:e.offsetX, offsetY:e.offsetY, "originEvent": e, target:e.target};
  }

  addEventForClass(className: string, interaction){
    this.classInteraction[className] = interaction
  }

  addEventForTag(tagName: string, interaction){
    this.tagInteraction[tagName] = interaction
  }

  addEventForId(id: string, interaction){
    this.idInteraction[id] = interaction
  }
}
