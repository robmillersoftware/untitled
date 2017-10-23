import {InputHandler} from './input/input-handler';

/**
 * This class functions as an input handler and a wrapper for the Phaser.Camera
 */
export class Camera extends InputHandler {
    constructor(game, id = 'camera') {
        super(id);

        //The map of controls handled by this object and the associated callbacks
        let controlMap = new Map([
            [CONTROLS.UP, this.onUp],
            [CONTROLS.DOWN, this.onDown],
            [CONTROLS.LEFT, this.onLeft],
            [CONTROLS.RIGHT, this.onRight]
        ]);
        
        this.setControls(controlMap);

        //When none of the directional controls are active, stop movement.
        //We use the negate argument of registerButtonCombo for this
        this.registerButtonCombo(
            [CONTROLS.UP, CONTROLS.DOWN, CONTROLS.LEFT, CONTROLS.RIGHT],
            this.onStop,
            true);

        this.game = game;
        this.group = this.game.add.group();

        //The cursor is an invisible object that the camera follows. Phaser's camera isn't
        //very good at zooming and moving independently, so having it follow a displayObject 
        //makes it more manageable.
        this.cursor = this.group.create(this.game.world.centerX, this.game.world.centerY);
        this.game.physics.arcade.enableBody(this.cursor);

        //Setting bounds to null allows the camera to move anywhere within the game
        this.game.camera.bounds = null;

        //Zoom out
        this.game.camera.scale.set(0.5, 0.5);
        
        this.game.camera.follow(this.cursor);
    }

    onUp() {
        this.cursor.body.velocity.y = -5000;
    }

    onDown() {
        this.cursor.body.velocity.y = 5000;
    }

    onRight() {
        this.cursor.body.velocity.x = 5000;
    }

    onLeft() {
        this.cursor.body.velocity.x = -5000;
    }

    onStop() {
        this.cursor.body.velocity.x = 0;
        this.cursor.body.velocity.y = 0;
    }
}