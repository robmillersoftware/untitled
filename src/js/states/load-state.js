import {AbstractState} from './abstract-state';

export class LoadState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'load';
        this.game = game;
    }
    
    preload() {
        var logo = this.game.add.sprite(0,0,'logo');
        logo.anchor.setTo(0.5);
        logo.x = this.game.world.width / 2;
        logo.y = this.game.world.height / 2;

        this.game.load.setPreloadSprite(logo);

        var loadingLabel = this.game.add.text(0, logo.height / 2, 'loading...',
                                {font: '30px Courier', fill: '#ffffff'});
        loadingLabel.anchor.set(0.5);
        logo.addChild(loadingLabel);

        this.game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
        this.game.load.image('win', 'assets/images/win.png');
        this.game.load.image('star', 'assets/images/star.png');
        this.game.load.image('sky', 'assets/images/sky.png');
        this.game.load.image('ground', 'assets/images/platform.png');
        this.game.load.start();
        this.game.load.image('dirt', 'assets/images/dirt.png');
        this.game.load.image('grass', 'assets/images/grass.png');
    }
    
    create() {
        //this.game.state.start('menu');
        this.game.state.start('play'); 
    }
    
    update() {
    }
}