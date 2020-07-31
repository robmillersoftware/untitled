const TILE_SIZE = 16;
const CELLS = 100;

const MAX_ROOM_WIDTH = 16;
const MAX_ROOM_HEIGHT = 18;
const MAX_ROOM_RATIO = 4;

let seed;

function nextRand(min, max) {
  max = max || 1;
  min = min || 0;

  seed = (seed * 9301 + 49297) % 233280;
  var rnd = seed / 233280;

  return min + rnd * (max - min);
}

function getRandomPointInCircle(radius) {
  let t = 2 * Math.pi * nextRand();
  let u = nextRand() + nextRand();
  let r = null;

  if (u > 1) {
    r = 2 - u;
  } else {
    r = u;
  }

  return new Phaser.Geom.Point(
    roundPos(radius * r * Math.cos(t), TILE_SIZE),
    roundPos(radius * r * Math.sin(t), TILE_SIZE));
}

function roundPos(n, m) {
  return Math.floor(((n + m - 1) / m) * m);
}

class Room {
  constructor(scene, topLeft) {
    let width = nextRand(1, MAX_ROOM_WIDTH);
    let height = nextRand(1, MAX_ROOM_HEIGHT);

    if (height > width && height / width > MAX_ROOM_RATIO) {
      height = width * MAX_ROOM_RATIO;
    } else if (width > height && width / height > MAX_ROOM_RATIO) {
      width = height * MAX_ROOM_RATIO;
    }

    for (let i = 0; i < width; ++i) {
      let y = topLeft.y;
      for (let j = 0; j < height; ++j) {
        let tile = scene.add.image(topLeft.x + i * TILE_SIZE, y, 'ground');
      }
      topLeft.y += TILE_SIZE;
    }
  }
}

export class Dungeon {
  constructor(s, scene) {
    seed = s;
    this.scene = scene;
    this.rooms = this.spawnRooms();
    //separateRooms(this.rooms);
  }

  spawnRooms() {
    let rooms = [];
    for (let i = 0; i < CELLS; ++i) {
      let topLeft = getRandomPointInCircle(this.scene.sys.game.canvas.width / 2);
      let room = new Room(this.scene, topLeft);
      rooms.push(room);
    }

    return rooms;
  }

  getWidth() {
    return this.scene.sys.game.canvas.width;
  }

  getHeight() {
    return this.scene.sys.game.canvas.height;
  }
}
