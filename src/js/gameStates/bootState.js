import {AbstractState} from './abstractState';

export class BootState extends AbstractState {
    constructor(game) {
        super();
        this.game = game;
    }
    
    preload() {
        
    }
    
    create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
    
    update() {
        
    }
}