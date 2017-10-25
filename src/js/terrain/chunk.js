import {MapTile} from './map/map-tile';

//This sorter 
var sorter = require('node-object-hash').makeObjectSorter({coerce: false, sort: true});

export class Chunk {
    constructor(initX, initY, group) {
        this.id = 
        this.tiles = new Array(CHUNK_SIZE).fill(new Array(CHUNK_SIZE));

        this.tiles.forEach((arr, i) => {
            arr.forEach((tile, j) => {
                let x = initX + j * TILE_SIZE;
                let y = initY + i * TILE_SIZE;
                let sprite = group.create(x, y, 'dirt');

                tile = new MapTile(x, y, sprite);
            });
        });

        this.neighbors = new Neighbors();
    }

    equals(chunk) {
        let thisStr = sorter(JSON.stringify(this));
        let thatStr = sorter(JSON.stringify(chunk));

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
        this.NW = null;
        this.N = null;
        this.NE = null;
        this.E = null;
        this.SE = null;
        this.S = null;
        this.SW = null;
        this.W = null;
    }

    get NW() { return (this.NW === null ? null : JSON.parse(this.NW)); }
    get N() { return (this.N === null ? null : JSON.parse(this.N)); }
    get NE() { return (this.NE === null ? null : JSON.parse(this.NE)); }
    get E() { return (this.E === null ? null : JSON.parse(this.E)); }
    get SE() { return (this.SE === null ? null : JSON.parse(this.SE)); }
    get S() { return (this.S === null ? null : JSON.parse(this.S)); }
    get SW() { return (this.SW === null ? null : JSON.parse(this.SW)); }
    get W() { return (this.W === null ? null : JSON.parse(this.W)); }

    set NW(chunk) { this.NW = JSON.stringify(chunk); }
    set N(chunk) { this.NW = JSON.stringify(chunk); }
    set NE(chunk) { this.NW = JSON.stringify(chunk); }
    set E(chunk) { this.NW = JSON.stringify(chunk); }
    set SE(chunk) { this.NW = JSON.stringify(chunk); }
    set S(chunk) { this.NW = JSON.stringify(chunk); }
    set SW(chunk) { this.NW = JSON.stringify(chunk); }
    set W(chunk) { this.NW = JSON.stringify(chunk); }
}