import {AbstractState} from './abstractState';

export class PlayState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'play';
        this.game = game;
    }
    
    preload() {
    }
    
    create() {
        this.keyboard = this.game.input.keyboard;
        this.player = this.game.add.sprite(16,16,'player');
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.win = this.game.add.sprite(256,256,'win');
        this.game.physics.enable(this.win, Phaser.Physics.ARCADE);
    }
    
    update() {
        this.game.physics.arcade.overlap(this.player, this.win, this.victory, null, this);
        
        if (this.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = -175;
        } else if (this.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = 175;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.body.velocity.y = -175;
        } else if (this.keyboard.isDown(Phaser.Keyboard.S)) {
            this.player.body.velocity.y = 175;
        } else {
            this.player.body.velocity.y = 0;
        }
    }
    
    victory() {
        this.game.state.start('victory');
    }
}