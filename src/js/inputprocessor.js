/**
 * This class parses button presses and passes the events to a target
 */
export class InputProcessor {
    constructor(game) {
        this.game = game;
        this.target = null;

        //This is a map of controls. The values are callbacks that check if
        //the control should be activated
        this.controls = new Map([
            ['up', () => {
                return this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.W);
            }],
            ['left', () => {
                return this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.A);
            }],
            ['down', () => {
                return this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.S);
            }],
            ['right', () => {
                return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.D);
            }]
        ]);
    }

    /**
     * Overwrites the current control handler function with a new one
     * @param {*} key 
     * @param {*} handler 
     */
    setControl(key, handler) {
        this.controls.set(key, handler);
    }

    /**
     * Sets the target object that input is being passed to
     * @param {*} target 
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * Determine which registered keys are being pressed and pass each of
     * them to the current target
     */
    processInput() {
        this.numPressed = 0;

        for (let [key, value] of this.controls) {
            if (value()) {
                this.target.handleInput(key);
                this.numPressed++;
            }
        }

        if (this.numPressed == 0) {
            this.target.handleInput('');
        }
    }
}