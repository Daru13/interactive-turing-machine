export enum customShapes {
    LAMP = "lamp"
}

let customShapesToFiles = {
    "lamp": "../../img/lamp.svg"
};

let defaultShapes = {
    "lamp": "<circle cx='0' cy='0' r='30'></circle>"
};

export class  CustomShapes{
    static mapShape: Record<customShapes, String> = { } as Record<customShapes, String>;

    static loadFiles(): void {
        let keys = Object.keys(customShapes);
        for (let i = 0; i < keys.length; i++) {
            CustomShapes.loadSvg(customShapes[keys[i]], customShapesToFiles[customShapes[keys[i]]]);
        }
    }

    static loadSvg(shape: customShapes, file: string): void {
        if (CustomShapes.mapShape.hasOwnProperty(shape)) {
            return;
        }
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function(): void {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    let svg = rawFile.responseText;
                    CustomShapes.mapShape[shape] = svg;
                }
            }
        };
        rawFile.send(null);
    }

    static getShape(shape: customShapes): String {
        if (CustomShapes.mapShape.hasOwnProperty(shape)) {
            return defaultShapes[customShapes[shape]];
        }
        return CustomShapes.mapShape[shape];
    }
}
