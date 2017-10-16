/**
 * The Boot state preloads the loading screen and sets certain game modes
 */
import {AbstractState} from './abstractState';

export class BootState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'boot';
        this.game = game;
    }
    
    /**
     * Load assets needed for loading screen in this method
     */
    preload() {
        this.game.load.image('logo', 'assets/images/phaser.png');
    }
    
    /**
     * Set game modes and environment variables in this method
     */
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        
        this.game.state.start('load');
    }
    
    /**
     * This method must be overridden to avoid throwing errors but
     * update will never be called while booting
     */
    update() {}
}