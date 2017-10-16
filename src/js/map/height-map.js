import {Delaunay} from "delaunay-fast";
import {HeightMapVertex} from "./height-map-vertex";

//The maximum net height for terrain
const EVEREST = 29000;

//The minimum net height for terrain
const MARIANA = -11000;

//The maximum raw value for terrain height in the game
const MAX_HEIGHT = EVEREST - MARIANA;

export class HeightMap {
    constructor(x, y, w, h) {
        //The bounding rectangle
        this.bounds = new Phaser.Rectangle(x, y, w, h);

        this.numRows = 20;
        this.numCols = 20;

        //The number of high points to keep
        this.numPeaks = 5;
        
        //The number of low points to keep
        this.numValleys = 5;

        //Draw debug info if true
        this.debug = false;

        //The average height in the map
        this.averageHeight = 0;

        //Preserve a reference to "this"
        let obj = this;

        //A 2d array containing vertices
        //this.vertices = this.generateSquareGrid(0.0);
        this.vertices = this.generateSquareGrid(0.5);
    }
    
    /**
     * Generates a 2D array of points
     * @param chaosFactor The higher this number is the more the vertices
     *  will be perturbed when generated
     */
    generateSquareGrid(chaosFactor = 0.0) {
        let obj = this;
        return Array.from(
            new Array(obj.numRows), (val, i) => 
                Array.from(new Array(obj.numCols), (val, j) => {
                    let xRand = Math.random();
                    let yRand = Math.random();
                    let edgeWidth = obj.bounds.width / obj.numCols;
                    let edgeHeight = obj.bounds.height / obj.numRows;

                    let xFactor = xRand > 0.5 ? -Math.floor(Math.random() * edgeWidth / 2 * chaosFactor) : Math.floor(Math.random() * edgeWidth / 2 * chaosFactor);
                    let yFactor = yRand > 0.5 ? -Math.floor(Math.random() * edgeHeight / 2 * chaosFactor) : Math.floor(Math.random() * edgeHeight / 2 * chaosFactor);

                    let x = obj.bounds.topLeft.x + edgeWidth * i + edgeWidth / 2 + xFactor;
                    let y = obj.bounds.topLeft.y + edgeHeight * j + edgeHeight / 2 + yFactor;
                    let height = Math.floor(Math.random() * MAX_HEIGHT);

                    return new HeightMapVertex(x, y, height);
                }));
                    
    }

    /**
     * Inform vertices of their neighbors and apply smoothing
     */
    calculate() {
    }
    
    drawMap(game) {
        this.vertices.forEach((arr, i) => {
            arr.forEach((vert, j) => {
                game.graphics.lineStyle(1, this.hexFromHeight(vert.height));
                game.graphics.drawCircle(vert.x, vert.y, 2);
            });
        });
    }

    /**
     * Map height range to hex colors. 0-255 are valid ranges for each comopnent.
     * 767 is maximum output value (256 * 3 - 1)
     * @param {*} height 
     */
    hexFromHeight(height) {
        let output = Math.floor((height + MARIANA) / MAX_HEIGHT * 767);
        let r, g, b = 0

        if (output < 255) { 
            r = output;
        } else if (output > 255 && output < 512) {
            r = 255;
            g = output - 255;
        } else {
            g = 255;
            r = 767 - output;
        }

        //console.log('rgb(' + r + ',' + g + ',' + b + ')');
        return r << 16 | g << 8 | b;
    }
}