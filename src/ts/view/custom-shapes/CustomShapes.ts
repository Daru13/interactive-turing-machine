/** Enumeration of the different shapes */
export enum customShapes {
    LAMP = "lamp"
}

/** Path to a svg file for each file*/
let customShapesToFiles = {
    "lamp": "../../img/lamp.svg"
};

/** for each custom shape, we define a shape to display if we could not load the file */
let defaultShapes = {
    "lamp": "<circle cx='0' cy='0' r='30'></circle>"
};

/** Not used: A class to manage the shape of the objects in the interface */
export class  CustomShapes{
    static mapShape: Record<customShapes, String> = { } as Record<customShapes, String>;

    /** Load the files for each custom shapes */
    static loadFiles(): void {
        let keys = Object.keys(customShapes);
        for (let i = 0; i < keys.length; i++) {
            CustomShapes.loadSvg(customShapes[keys[i]], customShapesToFiles[customShapes[keys[i]]]);
        }
    }

    /** Load the file associated to the shape 
     * @param shape
     * @param file
    */
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

    /**
     * Gets custom shape
     * @param shape 
     * @returns the corresponding svg as a string 
     */
    static getShape(shape: customShapes): String {
        if (CustomShapes.mapShape.hasOwnProperty(shape)) {
            return defaultShapes[customShapes[shape]];
        }
        return CustomShapes.mapShape[shape];
    }
}
