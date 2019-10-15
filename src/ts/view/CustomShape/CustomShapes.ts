export enum customShapes {
    LAMP = "lamp"
};

let customShapesToFiles = {
    "lamp": "../../svg/lamp.svg"
}

let defaultShapes = {
    "lamp": "<circle cx='0' cy='0' r='30'></circle>"
}

export class  CustomShapes{
    static mapShape: Record<customShapes, String> = {} as Record<customShapes, String>;

    static loadFiles(){
        for(var shape in Object.keys(customShapes)){
            CustomShapes.loadSvg(customShapes[shape], customShapesToFiles[customShapes[shape]]);
        }
    }

    static loadSvg(shape: customShapes, file) {
        if (CustomShapes.mapShape.hasOwnProperty(shape)){
            return;
        }
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var svg = rawFile.responseText;
                    CustomShapes.mapShape[shape] = svg;
                }
            }
        }
        rawFile.send(null);
    }

    static getShape(shape: customShapes): String{
        if (CustomShapes.mapShape.hasOwnProperty(shape)) {
            return defaultShapes[customShapes[shape]];
        }
        return CustomShapes.mapShape[shape];
    }
}
