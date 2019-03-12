/**
 * The Boot state preloads the loading screen and sets certain game modes
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'boot'
        });
    }

    preload() {
        this.load.image('logo', 'assets/images/logo.png')
    }

    create() {
        console.log('WE LOADING');
        this.scene.start('load');
    }
}