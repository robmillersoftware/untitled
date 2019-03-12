export class MenuScene extends Phaser.Scene {
    constructor(game) {
        super({ key: 'menu' });
    }

    preload() {
    }

    create() {
    }

    update() {

    }

    start() {
        this.scene.start('play');
    }
}