const TILE_SIZE = 16;
const CELLS = 100;

export class Dungeon {
  constructor(seed, container) {
    this.seed = seed;
    this.container = container;
  }

  nextRand(min, max) {
    max = max || 1;
    min = min || 0;

    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;

    return min + rnd * (max - min);
  }

  getRandomPointInCircle() {
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

  roundPos(n, m) {
    return Math.floor(((n + m - 1) / m) * m);
  }
}