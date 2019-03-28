import { DelaunayGraph } from 'delaunay-graph.js';
import { Random } from 'random.js';

//Have to use require instead of import for compatibility for this module
let Delaunator = require('delaunator');
let random;

const TILE_SIZE = 16;
const ITERATIONS = 10;
const ATTEMPTS_PER_ITERATION = 400;
const MIN_ROOM_WIDTH = 3;
const MIN_ROOM_HEIGHT = 2;
const MAX_ROOM_WIDTH = 12;
const MAX_ROOM_HEIGHT = 10;

function getRandomPointInCircle(radius, center) {
  let t = 2 * Math.PI * random.nextRand();
  let u = random.nextRand() + random.nextRand();
  let r = null;

  if (u > 1) {
    r = 2 - u;
  } else {
    r = u;
  }

  return new Phaser.Geom.Point(
    roundPos(radius * r * Math.cos(t) + center.x, TILE_SIZE),
    roundPos(radius * r * Math.sin(t) + center.y, TILE_SIZE));
}

function roundPos(n, m) {
  return Math.floor(((n + m - 1) / m) * m);
}

class Room {
  constructor(topLeft, scene, scale = 1) {
    this.scene = scene;
    this.tiles = [];
    this.container = scene.add.container();
    this.topLeft = topLeft;

    this.width = Math.floor(random.nextRand(Math.ceil(MIN_ROOM_WIDTH * scale), Math.ceil(MAX_ROOM_WIDTH * scale)));
    this.height = Math.floor(random.nextRand(Math.ceil(MIN_ROOM_HEIGHT * scale), Math.ceil(MAX_ROOM_HEIGHT * scale)));

    let y = topLeft.y;
    for (let i = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++) {
        let tile = new Tile(new Phaser.Geom.Point(topLeft.x + j * TILE_SIZE, y), TileTypes.FLOOR);
        row.push(tile);
      }

      this.tiles.push(row);
      y += TILE_SIZE;
    }

    this.bounds = new Phaser.Geom.Rectangle(topLeft.x, topLeft.y, this.width * TILE_SIZE, this.height * TILE_SIZE);
    this.center = new Phaser.Geom.Point(this.bounds.centerX, this.bounds.centerY);
  }

  createTileSprites() {
    this.tiles.forEach(row => {
      row.forEach(tile => {
        tile.sprite = new Phaser.GameObjects.Sprite(this.scene, tile.topLeft.x, tile.topLeft.y, tile.type.toString());
        tile.sprite.displayWidth = 16;
        tile.sprite.displayHeight = 16;
        tile.sprite.setOrigin(0, 0);
        tile.sprite.setPosition(tile.topLeft.x, tile.topLeft.y);
        this.container.add(tile.sprite);
      });
    });

    this.container.setSize(this.bounds.width, this.bounds.height);
    this.scene.physics.world.enable(this.container);
  }
}

const enumValue = (name) => Object.freeze({toString: () => name});

const TileTypes = Object.freeze({
    FLOOR: enumValue("floor")
});

class Tile {
  constructor(topLeft, type, sprite) {
    this.topLeft = topLeft;
    this.sprite = sprite;
    this.type = type;
  }
}

export class Dungeon {
  constructor(scene, s) {
    random = Random.getInstance(s);
    this.seed = s;
    this.radius = 512;
    this.center = new Phaser.Geom.Point(scene.sys.game.canvas.width / 2, scene.sys.game.canvas.height / 2);;
    this.scene = scene;
    this.delaunay = null;

    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(5, 0xFFFFFF, 1.0);
    this.graphics.strokeCircle(this.center.x, this.center.y, this.radius);

    this.spawnRooms();
    this.calculateHubs();
    this.calculateDelaunay();
    this.createSprites();
  }

  createSprites() {
    this.rooms.forEach(room => {
      //room.createTileSprites();
      this.graphics.lineStyle(5, 0xFF0000, 1.0);
      this.graphics.strokeRectShape(room.bounds);
    });

    this.hubRooms.forEach(room => {
      this.graphics.lineStyle(5, 0x00FF00, 1.0);
      this.graphics.strokeRectShape(room.bounds);
    });

    //this.drawDelaunay();
  }

  spawnRooms() {
    this.rooms = [];

    let scale = 1.0;
    let reducer = scale / ITERATIONS;

    for (let i = 0; i < ITERATIONS; ++i) {
      scale -= reducer;
      for (let j = 0; j < ATTEMPTS_PER_ITERATION; ++j) {
        let topLeft = getRandomPointInCircle(this.radius, this.center);
        let room = new Room(topLeft, this.scene, scale);
        let valid = true;

        this.rooms.forEach(r => {
          let intersection = Phaser.Geom.Rectangle.Intersection(room.bounds, r.bounds);

          if (intersection.width !== 0 || intersection.height !== 0) {
            valid = false;
          }
        });

        if (valid) {
          this.rooms.push(room);
        }
      }
    }
  }

  calculateHubs() {
    let sumWidth = 0;
    let sumHeight = 0;

    this.hubRooms = [];

    this.rooms.forEach(room => {
      sumWidth += room.width;
      sumHeight += room.height;
    });

    let meanWidth = sumWidth / this.rooms.length;
    let meanHeight = sumHeight / this.rooms.length;

    this.rooms.forEach(room => {
    if (room.width > meanWidth * 1.25 && room.height > meanHeight * 1.25) {
        this.hubRooms.push(room);
      }
    });
  }

  /*drawDelaunay() {
    this.graphics.beginPath();
    this.graphics.lineStyle(2, 0x882288);

    for (let i = 0; i < this.delaunay.triangles.length; i += 3) {
      let first = this.delaunay.triangles[i];
      let second = this.delaunay.triangles[i+1];
      let third = this.delaunay.triangles[i+2];

      this.graphics.moveTo(this.centers[first].x, this.centers[first].y);
      this.graphics.lineTo(this.centers[second].x, this.centers[second].y);
      this.graphics.lineTo(this.centers[third].x, this.centers[third].y);
    }

    this.graphics.closePath();
    this.graphics.strokePath();
  */

  calculateDelaunay() {
    this.centers = [];
    this.hubRooms.forEach(room => {
      this.centers.push(room.center);
    });

    this.delaunay = new DelaunayGraph(this.centers, random, this.graphics);
  }
}
