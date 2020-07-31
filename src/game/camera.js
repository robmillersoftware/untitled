import {InputHandler} from 'input/input-handler';
import {CONTROLS, MAX_ZOOM} from 'globals.js';

/**
 * This class functions as an input handler and a wrapper for the Phaser.Camera
 */
export class Camera extends InputHandler {
    constructor(scene, group, id = 'camera') {
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

        this.scene = scene;
        this.group = group;

        //The cursor is an invisible object that the camera follows. Phaser's camera isn't
        //very good at zooming and moving independently, so having it follow a displayObject
        //makes it more manageable.
        this.cursor = this.group.create(this.scene.sys.game.canvas.width / 2, this.scene.sys.game.canvas.height / 2);
        //this.scene.matter.enableBody(this.cursor);

        //Setting bounds to null allows the camera to move anywhere within the scene
        //this.scene.camera.bounds = null;

        //Zoom out
        //this.scene.camera.scale.set(0.5, 0.5);
        //this.group.scale.set(0.5, 0.5);
        //this.scene.camera.follow(this.cursor);

        //this.scene.input.mouse.mouseWheelCallback = this.onScroll.bind(this);
    }

    onUp() {
        //this.cursor.body.velocity.y -= 500;
    }

    onDown() {
        //this.cursor.body.velocity.y += 500;
    }

    onRight() {
        //this.cursor.body.velocity.x += 500;
    }

    onLeft() {
        //this.cursor.body.velocity.x -= 500;
    }

    onStop() {
        //this.cursor.body.velocity.x = 0;
        //this.cursor.body.velocity.y = 0;
    }

    onScroll(event) {
        if (this.scene.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
            this.onScrollUp();
        } else {
            this.onScrollDown();
        }

        this.scene.camera.follow(this.cursor);
    }

    onScrollUp() {
        this.group.scale.x += 0.1;
        this.group.scale.y += 0.1;

        if (this.group.scale.y > MAX_ZOOM || this.group.scale.x > MAX_ZOOM) {
            this.group.scale.x = MAX_ZOOM;
            this.group.scale.y = MAX_ZOOM;
        }
    }

    onScrollDown() {
        this.group.scale.x -= 0.1;
        this.group.scale.y -= 0.1;

        if (this.group.scale.y < MIN_ZOOM || this.group.scale.x < MIN_ZOOM) {
            this.group.scale.set(MIN_ZOOM);
        }
    }

    get position() {
        return this.scene.camera.target.position;
    }
}
