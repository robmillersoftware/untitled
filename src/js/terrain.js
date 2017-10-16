import {HeightMap} from './map/height-map';
import {MapTile} from './map/map-tile';

export class Terrain {
    constructor(game) {
        this.game = game;
        
        this.assetSize = 512;

        this.terrainGroup = this.game.add.group();

        //The length of one side of the square
        this.dimension = 5;

        this.heightMaps = [];
    }

    init() {
        this.loadLayers();
    }

    loadLayers() {
        let initX = 0 - this.dimension / 2 * this.assetSize;
        let y = 0 - this.dimension / 2 * this.assetSize;

        for (let i = 0; i < this.dimension; ++i) {
            let x = initX;
            this.heightMaps.push([]);
            for (let j = 0; j < this.dimension; ++j) {
                /*let sprite = this.game.add.sprite(x, y, 'dirt');
                sprite.anchor.x = 0.0;
                sprite.anchor.y = 0.0;
                let hMap = new HeightMap(x, y, sprite.width, sprite.height);
                */
                let hMap = new HeightMap(x, y, 512, 512);
                
                hMap.calculate();

                this.heightMaps[i].push(hMap);
                
                x += this.assetSize;
            }
            y += this.assetSize;
        }
    }

    draw() {
        for (let i = 0; i < this.heightMaps.length; ++i) {
            for (let j = 0; j < this.heightMaps[i].length; ++j) {
                this.heightMaps[i][j].drawMap(this.game);
            }
        }
    }
}