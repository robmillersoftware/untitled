/**
 * This module manages the scene terrain. This includes geography, heightmaps, navigation markers, etc.
 *
 * @export Terrain
 */
import {MapMesh, MapTile, Chunk} from 'terrain';
import * as Utils from 'utils.js';

/**
 * this class manages the various entities that compose the terrain in the scene world
 */
export class Terrain {
    /**
     * This is the only constructor for this class. scene must not be null
     * @param {Phaser.scene} scene a reference to the global scene object
     */
    constructor(scene) {
        this.scene = scene;
        this.map = new MapMesh();

        //This is the minimum number of chunks to have loaded around the chunk the player currently occupies
        this.minChunkDistance = 2;

        //Build group hierarchy
        this.baseGroup = this.scene.add.container();

        //Ground group holds all terrain elements
        this.groundGroup = this.scene.add.container();
        this.baseGroup.add(this.groundGroup);

        //Debug group holds debugging graphics
        this.debugGroup = this.scene.add.container();
        this.debugGraphics = this.scene.add.graphics();
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
        this.loadChunks();

        //Calculates the heightmap for all loaded chunks
        this.calculateMap();

        //Draw the initial debug objects
        this.draw();
    }

    loadChunks(chunks = [this.rootChunk], dist = 0) {
        dist++;
        if (dist > this.minChunkDistance) return;

        let obj = this;
        chunks.forEach(chunk => {
            chunk.buildNeighbors();
            obj.loadChunks(chunk.neighbors.all, dist);
        });

        return;
    }

    calculateMap() {
        let topLeft = new Phaser.Geom.Point(this.scene.sys.game.canvas.width / 2,
            this.scene.sys.game.canvas.height / 2);
        let bottomRight = new Phaser.Geom.Point(this.scene.sys.game.canvas.width / 2,
            this.scene.sys.game.canvas.height / 2);

        let allSites = [];
        Chunk.getAllChunks(this.rootChunk).forEach(chunk => {
            console.log(chunk.topLeft + ' ' + topLeft);
            if (!chunk.topLeft) {
                console.log(Utils.safeStringify(chunk));
            }
            if (chunk.topLeft.x <= topLeft.x && chunk.topLeft.y <= topLeft.y) {
                topLeft = chunk.topLeft;
            } else if (chunk.bottomRight.x >= bottomRight.x && chunk.bottomRight.y >= bottomRight.y) {
                bottomRight = chunk.bottomRight;
            }

            let sites = chunk.sites;
            if (sites) {
                allSites.push(...chunk.sites);
            }
        });

        Chunk.clearFlags(this.rootChunk);

        let bounds = new Phaser.Geom.Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
        this.map.calculate(allSites, bounds);
    }

    /**
     * Convenience function to handle loading of the first root chunk in the center of the scene world
     */
    loadInitialChunk() {
        let x = this.scene.sys.game.canvas.width / 2 - Math.floor(Chunk.width / 2);
        let y = this.scene.sys.game.canvas.height / 2 - Math.floor(Chunk.height / 2);
        let rtn = new Chunk(x, y);
        rtn.buildNeighbors();

        return rtn;
    }

    /**
     * This function handles the drawing of the debug view
     * @param {boolean} delaunay
     * @param {boolean} voronoi
     * @param {boolean} sites
     * @param {boolean} terrain
     */
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

    /**
     * Draws the array of sites as circles
     */
    drawSites() {
        this.debugGraphics.clear();
        Chunk.getAllChunks(this.rootChunk).forEach(chunk => {
            chunk.drawSites(this.debugGraphics);
        });

        Chunk.clearFlags(this.rootChunk);
        let tex = this.debugGraphics.generateTexture();
        this.debugGraphics.clear();
        return this.debugGroup.create(this.baseGroup.left, this.baseGroup.top, tex);
    }
}