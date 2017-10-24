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

        //How far the player needs to be from the edge of the current map to start generating the next chunk
        this.loadingBuffer = TILE_SIZE;

        //If a player is outside of this area then we need to start generating/loading from cache.
        this.loadingArea = new Phaser.Rectangle(0, 0, 
            this.dimension * TILE_SIZE - this.loadingBuffer * 2,
            this.dimension * TILE_SIZE - this.loadingBuffer * 2);

        this.debugGraphics.beginFill(0x00FF00, 0.15);
        this.debugGraphics.drawRect(this.loadingArea.left, this.loadingArea.top, this.loadingArea.width, this.loadingArea.height);
        this.debugGraphics.endFill();

        this.loadingZoneTexGreen = this.debugGraphics.generateTexture();
        this.debugGraphics.clear();

        this.debugGraphics.beginFill(0xFF0000, 0.15);
        this.debugGraphics.drawRect(this.loadingArea.left, this.loadingArea.top, this.loadingArea.width, this.loadingArea.height);
        this.debugGraphics.endFill();

        this.loadingZoneTexRed = this.debugGraphics.generateTexture();
        this.debugGraphics.clear();

        this.loadingZoneBox = this.debugGroup.create(0, 0, this.loadingZoneTexGreen);
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

        this.loadingZoneBox.anchor.set(0.5);
        this.loadingZoneBox.x = this.baseGroup.centerX;
        this.loadingZoneBox.y = this.baseGroup.centerY;
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

        this.loadingZoneBox.bringToTop();
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

    checkPlayerPosition(cursor) {
        if (!this.loadingZoneBox.overlap(cursor)) {
            this.loadingZoneBox.loadTexture(this.loadingZoneTexRed);
            this.addToMap(cursor.x < this.loadingZoneBox.left,
                cursor.y < this.loadingZoneBox.top,
                cursor.x > this.loadingZoneBox.right,
                cursor.y > this.loadingZoneBox.bottom);
        } else {
            if (this.loadingZoneBox.texture !== this.loadingZoneTexGreen) {
                this.loadingZoneBox.loadTexture(this.loadingZoneTexGreen);
            }
        }
    }

    addToMap(left, top, right, bottom) {
        if (left) {
            let newTiles = [...Array(this.dimension).keys()].map(i => Array(this.dimension + 1));
            this.tiles.forEach((arr, i) => {
                let sprite = this.groundGroup.create(this., y, 'dirt');
                let tile = new MapTile(x, y, sprite);
            }
        }
    }
}