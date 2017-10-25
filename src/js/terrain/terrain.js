/**
 * This module manages the game terrain. This includes geography, heightmaps, navigation markers, etc.
 * 
 * @export Terrain 
 */
import {MapMesh} from './map/map-mesh';
import {MapTile} from './map/map-tile';
import {Chunk} from './chunk';

/**
 * this class manages the various entities that compose the terrain in the game world
 */
export class Terrain {
    /**
     * This is the only constructor for this class. Game must not be null
     * @param {Phaser.Game} game a reference to the global game object 
     */
    constructor(game) {
        this.game = game;
        this.map = new MapMesh();

        //This is the minimum number of chunks to have loaded around the chunk the player currently occupies
        this.minChunkDistance = 2;

        //Build group hierarchy
        this.baseGroup = this.game.add.group();

        //Ground group holds all terrain elements
        this.groundGroup = this.game.add.group();
        this.baseGroup.add(this.groundGroup);

        //Debug group holds debugging graphics
        this.debugGroup = this.game.add.group();
        this.debugGraphics = this.game.add.graphics();
        this.debugGroup.add(this.debugGraphics);
        this.baseGroup.add(this.debugGroup);

        //Store a texture of the various debug drawings. Speeds up everything on render
        this.delaunayTexture = null;
        this.voronoiTexture = null;
        this.sitesTexture = null;
    }

    /**
     * Generate the first set of chunks
     */
    init() {
        //The rootChunk is the chunk occupied by the player initially
        this.rootChunk = this.loadInitialChunk();

        //Recursively load surrounding chunks until minChunkDistance condition is met in all 8 directions
        this.loadChunks([this.rootChunk]);

        //Draw the initial debug objects
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
        
        if (this.voronoiTexture === null || this.shouldRedraw) {
            let tex = this.map.drawVoronoi(this.debugGraphics);
            this.voronoiTexture = this.debugGroup.create(this.baseGroup.left, this.baseGroup.top, tex);
        }

        this.voronoiTexture.visible = voronoi;

        if (this.delaunayTexture === null || this.shouldRedraw) {
            let tex = this.map.drawDelaunay(this.debugGraphics);
            this.delaunayTexture = this.debugGroup.create(this.baseGroup.left, this.baseGroup.top, tex);
        }

        this.delaunayTexture.visible = delaunay;

        if (this.sitesTexture === null || this.shouldRedraw) {
            this.sitesTexture = this.drawSites();
        }

        this.sitesTexture.visible = sites;

        if (terrain)
            this.groundGroup.visible = true;
        else
            this.groundGroup.visible = false;

        this.loadingZoneBox.bringToTop();

        this.shouldRedraw = false;
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
        for (let i = 0; i < Math.ceil(this.dimension / 2); ++i) {
            console.log(this.baseGroup.left + ',' + this.baseGroup.top + " and " + this.groundGroup.left + ',' + this.groundGroup.top);
            if (left) {
                this.tiles.forEach((arr, i) => {
                    let x = this.baseGroup.left - TILE_SIZE;
                    let y = this.baseGroup.top + i * TILE_SIZE;
                    let sprite = this.groundGroup.create(x, y, 'dirt');
                    this.tiles[i].unshift(new MapTile(x, y, sprite));
                    
                    //TODO: Implement tile caching
                    let tileToCache = this.tiles[i].pop();
                    tileToCache.destroy();
                });
            } else if (right) {
                this.tiles.forEach((arr, i) => {
                    let x = this.baseGroup.right;
                    let y = this.baseGroup.top + i * TILE_SIZE;
                    let sprite = this.groundGroup.create(x, y, 'dirt');
                    this.tiles[i].push(new MapTile(x, y, sprite));

                    let tileToCache = this.tiles[i].shift();
                    tileToCache.destroy();
                });
            }

            this.baseGroup.width = this.boardSize;
            this.baseGroup.height = this.boardSize;
            this.groundGroup.width = this.boardSize;
            this.groundGroup.height = this.boardSize;

            if (top) {
                this.tiles.unshift(new Array(this.tiles[0].length));
                this.tiles[0].forEach((tile, i) => {
                    let x = this.baseGroup.left + i * TILE_SIZE;
                    let y = this.baseGroup.top - TILE_SIZE;
                    let sprite = this.groundGroup.create(x, y, 'dirt');
                    tile = new MapTile(x, y, sprite);
                });

                let tilesToCache = this.tiles.pop();
                tilesToCache.forEach(tile => tile.destroy());
            } else if (bottom) {
                this.tiles.push(new Array(this.tiles[0].length));
                this.tiles[this.tiles.length - 1].forEach((tile, i) => {
                    let x = this.baseGroup.left + i * TILE_SIZE;
                    let y = this.baseGroup.bottom;
                    let sprite = this.groundGroup.create(x, y, 'dirt');
                    tile = new MapTile(x, y, sprite);a
                });

                let tilesToCache = this.tiles.shift();
                tilesToCache.forEach(tile => tile.destroy());
            }
        }

        this.baseGroup.width = this.boardSize;
        this.baseGroup.height = this.boardSize;
        this.groundGroup.width = this.boardSize;
        this.groundGroup.height = this.boardSize;

        if (left || right || top || bottom) {
            this.loadingZoneBox.anchor.set(0.5);
            this.loadingZoneBox.x = this.baseGroup.centerX;
            this.loadingZoneBox.y = this.baseGroup.centerY;

            this.shouldRedraw = true;
            this.calculateMap();
        }
    }

    /**
     * Convenience function to handle loading of the first root chunk in the center of the game world
     */
    loadInitialChunk() {
        let x = this.game.world.centerX - Math.floor(Chunk.width / 2);
        let y = this.game.world.centerY - Math.floor(Chunk.height / 2);
        let rtn = new Chunk(x, y);
        
        return rtn;
    }
}