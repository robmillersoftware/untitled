import { RoomGraph } from 'room-graph.js';
import { Random } from 'random.js';

//let hash = require('object-hash');

let random;

const TILE_SIZE = 16;
const ITERATIONS = 10;
const ATTEMPTS_PER_ITERATION = 400;
const MIN_ROOM_WIDTH = 3;
const MIN_ROOM_HEIGHT = 2;
const MAX_ROOM_WIDTH = 12;
const MAX_ROOM_HEIGHT = 10;
const MIN_HALL_WIDTH = 1;
const MAX_HALL_WIDTH = 3;
const MEAN_DEVIATION = 1.25;

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

class Hallway {
  constructor(points, width, graphics) {
    this.points = points;
    this.width = width;
    this.graphics = graphics;

    this.drawDebug();
  }

  drawDebug() {
    this.graphics.lineStyle(5, 0xFF00FF, 1.0);
    this.graphics.beginPath();

    for (let i = 0; i < this.points.length - 1; ++i) {
      this.graphics.moveTo(this.points[i].x, this.points[i].y);
      this.graphics.lineTo(this.points[i+1].x, this.points[i+1].y);
    }

    this.graphics.closePath();
    this.graphics.strokePath();
  }
}

class Room {
  constructor(topLeft, scale = 1) {
    this.tiles = [];
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
    this.id = '' + this.bounds.top + this.bounds.bottom + this.bounds.left + this.bounds.right;
    //this.id = hash(this.bounds.top + '' + this.bounds.bottom + '' + this.bounds.left + '' + this.bounds.right);
  }

  createTileSprites(scene) {
    this.container = scene.add.container();
    this.tiles.forEach(row => {
      row.forEach(tile => {
        tile.sprite = new Phaser.GameObjects.Sprite(scene, tile.topLeft.x, tile.topLeft.y, tile.type.toString());
        tile.sprite.displayWidth = 16;
        tile.sprite.displayHeight = 16;
        tile.sprite.setOrigin(0, 0);
        tile.sprite.setPosition(tile.topLeft.x, tile.topLeft.y);
        this.container.add(tile.sprite);
      });
    });

    this.container.setSize(this.bounds.width, this.bounds.height);
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
    //this.graphics.lineStyle(5, 0xFFFFFF, 1.0);
    //this.graphics.strokeCircle(this.center.x, this.center.y, this.radius);

    this.spawnRooms();
    this.calculateHubs();
    this.createSprites();
    this.graph = new RoomGraph(this.hubRooms, this.graphics);

    this.buildHallways();
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
      if (room.width > meanWidth * MEAN_DEVIATION && room.height > meanHeight * MEAN_DEVIATION) {
          this.hubRooms.push(room);
      }
    });
  }

  buildHallways() {
    this.hallways = [];
    this.graph.minimalSpanningTree.forEach(e => {
      let r2 = e.rooms[1];
      let r1 = e.rooms[0];
      let hallPoints = [];

      if (r2.center.x < r1.bounds.right && r2.center.x > r1.bounds.left) {
        if (r2.center.y > r1.center.y) {
          hallPoints.push(new Phaser.Geom.Point(r2.center.x, r1.bounds.bottom));
          hallPoints.push(new Phaser.Geom.Point(r2.center.x, r2.bounds.top));
        } else {
          hallPoints.push(new Phaser.Geom.Point(r2.center.x, r1.bounds.top));
          hallPoints.push(new Phaser.Geom.Point(r2.center.x, r2.bounds.bottom));
        }
      } else if (r2.center.y < r1.bounds.bottom && r2.center.y > r1.bounds.top) {
        if (r2.center.x > r1.center.x) {
          hallPoints.push(new Phaser.Geom.Point(r1.bounds.right, r2.center.y));
          hallPoints.push(new Phaser.Geom.Point(r2.bounds.left, r2.center.y));
        } else {
          hallPoints.push(new Phaser.Geom.Point(r1.bounds.left, r2.center.y));
          hallPoints.push(new Phaser.Geom.Point(r2.bounds.right, r2.center.y));
        }
      } else {
        let midpoint = new Phaser.Geom.Point(r2.center.x, r1.center.y);
        let first = r2.center.x > r1.center.x ?
          new Phaser.Geom.Point(r1.bounds.right, midpoint.y) :
          new Phaser.Geom.Point(r1.bounds.left, midpoint.y);
        let second = r2.center.y > r1.center.y ?
          new Phaser.Geom.Point(midpoint.x, r2.bounds.top) :
          new Phaser.Geom.Point(midpoint.x, r2.bounds.bottom);

        hallPoints.push(first);
        hallPoints.push(midpoint);
        hallPoints.push(second);
      }

      this.hallways.push(new Hallway(hallPoints, 1, this.graphics));
    });
  }

  createSprites() {
    this.rooms.forEach(room => {
      //room.createTileSprites(this.scene);
      this.graphics.lineStyle(5, 0xFF0000, 1.0);
      this.graphics.strokeRectShape(room.bounds);
    });

    this.hubRooms.forEach(room => {
      this.graphics.lineStyle(5, 0x00FF00, 1.0);
      this.graphics.strokeRectShape(room.bounds);
    });
  }

  spawnRooms() {
    this.rooms = [];

    let scale = 1.0;
    let reducer = scale / ITERATIONS;

    for (let i = 0; i < ITERATIONS; ++i) {
      scale -= reducer;
      for (let j = 0; j < ATTEMPTS_PER_ITERATION; ++j) {
        let topLeft = getRandomPointInCircle(this.radius, this.center);
        let room = new Room(topLeft, scale);
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
}
