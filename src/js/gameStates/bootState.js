import {AbstractState} from './abstractState';

export class BootState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'boot';
        this.game = game;
    }
    
    preload() {
        
    }
    
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('load');
    }
    
    update() {
        
    }
}