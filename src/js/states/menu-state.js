import {AbstractState} from './abstract-state';

export class MenuState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'menu';
        this.game = game;
    }
    
    preload() {
    }
    
    create() {
        var nameLabel = this.game.add.text(80,80,'My First Game',
                            {font: '50px Arial', fill: '#ffffff'});
        var startLabel = this.game.add.text(80, this.game.world.height - 80,
                            'press the "W" key to start',
                            {font: '25px Arial', fill: '#ffffff'});
        var wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.addOnce(this.start, this);
    }
    
    update() {
        
    }
    
    start() {
        this.game.state.start('play');
    }
}