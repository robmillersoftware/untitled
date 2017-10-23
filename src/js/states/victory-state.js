import {AbstractState} from './abstract-state';

export class VictoryState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'victory';
        this.game = game;
    }
    
    preload() {
    }
    
    create() {
        var victoryLabel = this.game.add.text(80, 80, 'YOU WON!!!',
                            {font: '50px Arial', fill: '#00FF00'});
        var startLabel = this.game.add.text(80, this.game.world.height - 80,
                            'press the "W" key to restart', 
                            {font: '25px Arial', fill: '#ffffff'});
        var wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.addOnce(this.restart, this);
    }
    
    restart() {
        this.game.state.start('menu');
    }
    
    update() {
        
    }
}