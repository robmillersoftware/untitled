import {MapMesh} from './map-mesh';
import {MapTile} from './map-tile';

/**
 * This class represents the entire terrain of the game. This includes the actual
 * map, environment information, events, and interactive objects.
 */
export class Terrain {
    constructor(game) {
        this.game = game;

        //The length of one side of the square
        this.dimension = 7;
        this.tiles = [];

        this.map = new MapMesh();

        this.baseLayer = this.game.add.group();

        this.debugGroup = this.game.add.group();
        this.debugGraphics = this.game.add.graphics();
        this.debugGroup.add(this.debugGraphics);
    }

    init() {
        this.loadLayers();
        this.calculateMap();
    }

    loadLayers() {
        let initX = this.game.world.centerX - Math.floor(this.dimension / 2 * TILE_SIZE);
        let y = this.game.world.centerY - Math.floor(this.dimension / 2 * TILE_SIZE);

        for (let i = 0; i < this.dimension; ++i) {
            let x = initX;
            this.tiles.push([]);
            for (let j = 0; j < this.dimension; ++j) {
                let sprite = this.baseLayer.create(x, y, 'dirt');
                let tile = new MapTile(x, y, sprite);
                this.tiles[i].push(tile);
                
                x += TILE_SIZE;
            }
            y += TILE_SIZE;
        }
    }

    calculateMap() {
        let allSites = [];
        this.tiles.forEach((arr, i) => {
            arr.forEach((tile, j) => {
                allSites.push(...tile.centers);
            });
        });

        this.map.calculate(allSites, this.baseLayer.getLocalBounds());
    }

    draw(delaunay, voronoi, sites, terrain) {
        this.debugGraphics.clear();
        this.map.draw(this.debugGraphics, delaunay, voronoi);

        if (sites) {
            for (let i = 0; i < this.tiles.length; ++i) {
                for (let j = 0; j < this.tiles[i].length; ++j) {
                    this.tiles[i][j].draw(this.debugGraphics);
                }
            }
        }

        if (terrain)
            this.baseLayer.visible = true;
        else
            this.baseLayer.visible = false;
    }
}