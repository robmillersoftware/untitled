//Used to launch instances of the RandomNumbers class
let startingSeed;
let instances = [];

class RandomNumbers {
  constructor() {
    let exists = false;
    for (let instance in instances) {
      if (instance.startingSeed === startingSeed) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      this.startingSeed = startingSeed;
      this.seed = startingSeed;
    }
  }

  getStartingSeed() {
    return this.startingSeed;
  }

  getInstance(s) {
    startingSeed = s;
    return new RandomNumbers();
  }

  nextRand(min, max) {
    if (!this.seed) {
      console.log('Attempting to use unseeded Random, returning 0');
      return 0;
    }

    max = max || 1;
    min = min || 0;

    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;

    return min + rnd * (max - min);
  }
}

export let Random = new RandomNumbers();
