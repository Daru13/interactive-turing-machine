"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customShapes;
(function (customShapes) {
    customShapes["LAMP"] = "lamp";
})(customShapes = exports.customShapes || (exports.customShapes = {}));
let customShapesToFiles = {
    "lamp": "../../img/lamp.svg"
};
let defaultShapes = {
    "lamp": "<circle cx='0' cy='0' r='30'></circle>"
};
class CustomShapes {
    static loadFiles() {
        let keys = Object.keys(customShapes);
        for (let i = 0; i < keys.length; i++) {
            CustomShapes.loadSvg(customShapes[keys[i]], customShapesToFiles[customShapes[keys[i]]]);
        }
    }
    static loadSvg(shape, file) {
        if (CustomShapes.mapShape.hasOwnProperty(shape)) {
            return;
        }
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    let svg = rawFile.responseText;
                    CustomShapes.mapShape[shape] = svg;
                }
            }
        };
        rawFile.send(null);
    }
    static getShape(shape) {
        if (CustomShapes.mapShape.hasOwnProperty(shape)) {
            return defaultShapes[customShapes[shape]];
        }
        return CustomShapes.mapShape[shape];
    }
}
exports.CustomShapes = CustomShapes;
CustomShapes.mapShape = {};
//# sourceMappingURL=CustomShapes.js.map