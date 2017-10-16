import {AbstractState} from './abstractState';
import {InputProcessor} from '../inputprocessor';
import {Camera} from '../camera';
import {Terrain} from '../terrain';

export class PlayState extends AbstractState {
    constructor(game) {
        super();
        this.name = 'play';
        this.game = game;
        this.score = 0;
    }
    
    preload() {
    }
    
    create() {
        this.terrain = new Terrain(this.game);
        this.terrain.init();

        this.camera = new Camera(this.game);

        this.input = new InputProcessor(this.game);
        this.input.setTarget(this.camera);
        
        this.game.graphics = this.game.add.graphics(0,0);
        this.game.camera.scale.x = 0.5;
        this.game.camera.scale.y = 0.5;
        this.game.graphics.lineStyle(5, 0x00FF00);
        this.game.graphics.drawCircle(0, 0, 5);

        this.terrain.draw();
    }
    
    update() {
        //Need this line or camera skips around. Not sure why ATM
        this.game.camera.focusOnXY(0, 0);
        this.input.processInput();
    }
}