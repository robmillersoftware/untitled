import {InputProcessor} from 'input/input-processor';
import {Camera} from 'camera';
import {Dungeon} from 'dungeon';

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'play'
    });
   }

  create() {
    this.sceneryGroup = this.add.container();
    //this.camera = new Camera(this, this.sceneryGroup);
    //this.input = new InputProcessor(this);
    //this.input.setTarget(this.camera);

    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xFFFFFF, 1.0);
    this.graphics.fillRect(0, 0, this.sys.game.canvas.width, this.sys.game.canvas.height);

    // set the boundaries of our game world
    this.dungeon = new Dungeon(1234567890, this.sceneryGroup);
  }

  update() {
    //this.input.processInput();
  }

  resize(width, height) {
    this.sceneryGroup.centerX = this.sys.game.canvas.width / 2;
    this.sceneryGroup.centerY = this.sys.game.canvas.height / 2;
  }

  render() {
  }
}
