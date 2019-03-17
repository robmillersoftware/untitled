import {InputProcessor} from 'input/input-processor';
import {Camera} from 'camera';

export class PlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'play',
        });
     }

    create() {
        this.sceneryGroup = this.add.group();

        this.camera = new Camera(this, this.sceneryGroup);
        this.input = new InputProcessor();
        this.input.setTarget(this.camera);
    }

    update() {
        this.input.processInput();
    }

    resize(width, height) {
        this.sceneryGroup.centerX = this.sys.game.canvas.width / 2;
        this.sceneryGroup.centerY = this.sys.game.canvas.height / 2;
    }

    render() {
    }
}