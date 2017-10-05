import {AbstractState} from './abstractState';

export class MenuState extends AbstractState {
    constructor(game) {
        super();
        this.game = game;
    }
    
    preload() {
    }
    
    create() {
        var nameLabel = game.add.text(80,80,'My First Game',
                            {font: '50px Arial', fill: '#ffffff'});
        var startLabel = game.add.text(80, game.world.height - 80,
                            'press the "W" key to start',
                            {font: '25px Arial', fill: '#ffffff'});
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.addOnce(this.start, this);
    }
    
    update() {
        
    }
    
    start() {
        this.game.start('play');
    }
}