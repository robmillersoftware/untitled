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

        this.baseGroup = this.game.add.group();

        this.groundGroup = this.game.add.group();
        this.baseGroup.add(this.groundGroup);

        this.debugGroup = this.game.add.group();
        this.debugGraphics = this.game.add.graphics();
        this.debugGroup.add(this.debugGraphics);
        this.baseGroup.add(this.debugGroup);

        //Store a texture of the various debug drawings. Speeds up everything on render
        this.delaunayTexture = null;
        this.voronoiTexture = null;
        this.sitesTexture = null;
    }

    init() {
        this.loadLayers();
        this.calculateMap();
        this.draw();
    }

    loadLayers() {
        let initX = this.game.world.centerX - Math.floor(this.dimension / 2 * TILE_SIZE);
        let y = this.game.world.centerY - Math.floor(this.dimension / 2 * TILE_SIZE);

        for (let i = 0; i < this.dimension; ++i) {
            let x = initX;
            this.tiles.push([]);
            for (let j = 0; j < this.dimension; ++j) {
                let sprite = this.groundGroup.create(x, y, 'dirt');
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

        this.map.calculate(allSites, this.baseGroup.getLocalBounds());
    }

    draw(delaunay = true, voronoi = true, sites = true, terrain = true) {
        let topLeft = this.baseGroup.left;
        
        if (this.voronoiTexture === null) {
            let tex = this.map.drawVoronoi(this.debugGraphics);
            this.voronoiTexture = this.debugGroup.create(this.baseGroup.left, this.baseGroup.top, tex);
        }

        this.voronoiTexture.visible = voronoi;

        if (this.delaunayTexture === null) {
            let tex = this.map.drawDelaunay(this.debugGraphics);
            this.delaunayTexture = this.debugGroup.create(this.baseGroup.left, this.baseGroup.top, tex);
        }

        this.delaunayTexture.visible = delaunay;

        if (this.sitesTexture === null) {
            this.sitesTexture = this.drawSites();
        }

        this.sitesTexture.visible = sites;

        if (terrain)
            this.groundGroup.visible = true;
        else
            this.groundGroup.visible = false;
    }

    drawSites() {
        this.debugGraphics.clear();
        for (let i = 0; i < this.tiles.length; ++i) {
            for (let j = 0; j < this.tiles[i].length; ++j) {
                this.tiles[i][j].drawSites(this.debugGraphics);
            }
        }

        let tex = this.debugGraphics.generateTexture();
        this.debugGraphics.clear();
        return this.debugGroup.create(this.baseGroup.left, this.baseGroup.top, tex);
    }
}