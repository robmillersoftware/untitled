import {MapTile} from './tile';
 
var sorter = require('node-object-hash')({coerce: false, sort: true});

export class Chunk {
    constructor(initX, initY, group) {
        this.id = 
        this.tiles = [...Array(CHUNK_SIZE)].map(() => new Array(CHUNK_SIZE));
        this.group = group;
        this.topLeft = new Phaser.Point(initX, initY);

        this.tiles.forEach((arr, i) => {
            arr.forEach((tile, j) => {
                let x = initX + j * TILE_SIZE;
                let y = initY + i * TILE_SIZE;
                let sprite = this.group.create(x, y, 'dirt');

                tile = new MapTile(x, y, sprite);
            });
        });

        this.neighbors = new Neighbors();
    }

    buildNeighbors() {
        if (this.neighbors.NW === null) {
            this.neighbors.NW = new Chunk(
                this.topLeft.x - CHUNK_SIZE * TILE_SIZE,
                this.topLeft.y - CHUNK_SIZE * TILE_SIZE,
                this.group);
        }

        if (this.neighbors.N === null) {
            this.neighbors.N = new Chunk(
                this.topLeft.x,
                this.topLeft.y - CHUNK_SIZE * TILE_SIZE,
                this.group);
        }

        if (this.neighbors.NE === null) {
            this.neighbors.NE = new Chunk(
                this.topLeft.x + CHUNK_SIZE * TILE_SIZE,
                this.topLeft.y - CHUNK_SIZE * TILE_SIZE,
                this.group);
        }

        if (this.neighbors.E === null) {
            this.neighbors.E = new Chunk(
                this.topLeft.x + CHUNK_SIZE * TILE_SIZE,
                this.topLeft.y,
                this.group);
        }

        if (this.neighbors.SE === null) {
            this.neighbors.SE = new Chunk(
                this.topLeft.x + CHUNK_SIZE * TILE_SIZE,
                this.topLeft.y + CHUNK_SIZE * TILE_SIZE,
                this.group);
        }

        if (this.neighbors.S === null) {
            this.neighbors.S = new Chunk(
                this.topLeft.x,
                this.topLeft.y + CHUNK_SIZE * TILE_SIZE,
                this.group);
        }

        if (this.neighbors.SW === null) {
            this.neighbors.SW = new Chunk(
                this.topLeft.x - CHUNK_SIZE * TILE_SIZE,
                this.topLeft.y + CHUNK_SIZE * TILE_SIZE,
                this.group);
        }

        if (this.neighbors.W === null) {
            this.neighbors.W = new Chunk(
                this.topLeft.x - CHUNK_SIZE * TILE_SIZE,
                this.topLeft.y,
                this.group);
        }

        this.neighbors.NW.neighbors.W = this.neighbors.N;
        this.neighbors.NW.neighbors.S = this.neighbors.W;

        this.neighbors.N.neighbors.W = this.neighbors.NW;
        this.neighbors.N.neighbors.E = this.neighbors.NE;

        this.neighbors.NE.neighbors.W = this.neighbors.N;
        this.neighbors.NE.neighbors.S = this.neighbors.E;

        this.neighbors.E.neighbors.N = this.neighbors.NE;
        this.neighbors.E.neighbors.S = this.neighbors.SE;

        this.neighbors.SE.neighbors.N = this.neighbors.E;
        this.neighbors.SE.neighbors.W = this.neighbors.S;

        this.neighbors.S.neighbors.E = this.neighbors.SE;
        this.neighbors.S.neighbors.W = this.neighbors.SW;

        this.neighbors.SW.neighbors.E = this.neighbors.S;
        this.neighbors.SW.neighbors.N = this.neighbors.W;

        this.neighbors.W.neighbors.N = this.neighbors.NW;
        this.neighbors.W.neighbors.S = this.neighbors.SW;
    }

    /**
     * TODO: CURRENTLY RETURNS TOO MANY CHUNKS, NO IDEA WHY
     * @param {*} root 
     */
    static getAllChunks(root) {
        if (root === null) return [];

        let rtn = [];
        rtn.push(root);

        root.visited = true;
        root.neighbors.all.forEach(n => {
            if (n === null) return;

            if (n.visited === undefined || !n.visited) 
                rtn.push([...Chunk.getAllChunks(n)]);
        });

        console.log('returning: ' + rtn);
        return rtn;
    }

    static clearFlags(chunk) {
        Chunk.getAllChunks(chunk).forEach(chunk => {
            chunk.visited = false;
        });
    }

    get sites() {
        let rtn = [];
        this.tiles.forEach((arr, i) => {
            arr.forEach((tile, j) => {
                rtn.push([...tile.centers]);
            });
        });

        return rtn;
    }

    drawSites(graphics) {
        this.tiles.forEach(arr => {
            arr.forEach(tile => {
                tile.drawSites(graphics);
            })
        })
    }

    equals(chunk) {
        let thisStr = sorter.sort(safeStringify(this));
        let thatStr = sorter.sort(safeStringify(chunk));

        return thisStr === thatStr;
    }

    static get width() {
        return CHUNK_SIZE * TILE_SIZE;
    }

    static get height() {
        return CHUNK_SIZE * TILE_SIZE;
    }
}

/**
 * This is a wrapper class for storing the neighbors of a chunk. It converts the objects to JSON when it stores them to save memory
 */
class Neighbors {
    constructor() {
        this._NW = null;
        this._N = null;
        this._NE = null;
        this._E = null;
        this._SE = null;
        this._S = null;
        this._SW = null;
        this._W = null;
    }

    /*get NW() { return (this._NW === null ? null : JSON.parse(this._NW)); }
    get N() { return (this._N === null ? null : JSON.parse(this._N)); }
    get NE() { return (this._NE === null ? null : JSON.parse(this._NE)); }
    get E() { return (this._E === null ? null : JSON.parse(this._E)); }
    get SE() { return (this._SE === null ? null : JSON.parse(this._SE)); }
    get S() { return (this._S === null ? null : JSON.parse(this._S)); }
    get SW() { return (this._SW === null ? null : JSON.parse(this._SW)); }
    get W() { return (this._W === null ? null : JSON.parse(this._W)); }*/

    get all() {
        return [this.NW, this.N, this.NE, this.E, this.SE, this.S, this.SW, this.W];
    }

    get NW() { return this._NW; }
    get N() { return this._N; }
    get NE() { return this._NE; }
    get E() { return this._E; }
    get SE() { return this._SE; }
    get S() { return this._S; }
    get SW() { return this._SW; }
    get W() { return this._W; }

    set NW(chunk) { this._NW = chunk; }
    set N(chunk) { this._N = chunk; }
    set NE(chunk) { this._NE = chunk; }
    set E(chunk) { this._E = chunk; }
    set SE(chunk) { this._SE = chunk; }
    set S(chunk) { this._S = chunk; }
    set SW(chunk) { this._SW = chunk; }
    set W(chunk) { this._W = chunk; }

    /*set NW(chunk) { this._NW = safeStringify(chunk); }
    set N(chunk) { this._N = safeStringify(chunk); }
    set NE(chunk) { this._NE = safeStringify(chunk); }
    set E(chunk) { this._E = safeStringify(chunk); }
    set SE(chunk) { this._SE = safeStringify(chunk); }
    set S(chunk) { this._S = safeStringify(chunk); }
    set SW(chunk) { this._SW = safeStringify(chunk); }
    set W(chunk) { this._W = safeStringify(chunk); }*/
}