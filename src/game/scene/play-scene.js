import {InputProcessor} from 'input/input-processor';
import {Camera} from 'camera';
import {Dungeon} from 'dungeon';

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'play',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false // change if you need
        }
      }
    });
   }

  create() {
    //this.camera = new Camera(this, this.sceneryGroup);
    //this.input = new InputProcessor(this);
    //this.input.setTarget(this.camera);
    this.physics.world.setBounds(0, 0, this.sys.game.canvas.width, this.sys.game.canvas.height);

    this.dungeon = new Dungeon(this, 1234567890);
  }

  update() {
    //this.input.processInput();
  }

  /*resize(width, height) {
    this.sceneryGroup.centerX = this.sys.game.canvas.width / 2;
    this.sceneryGroup.centerY = this.sys.game.canvas.height / 2;
  }*/

  render() {
  }
}
