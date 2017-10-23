import {Controls} from './controls';

/**
 * This class directs input to a target on each update
 */
export class InputProcessor {
    constructor(game) {
        this.game = game;

        Controls.setKeyboard(this.game.input.keyboard);
        
        this.target = null;
        this.controls = null;
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
        this.target.handleInput();
    }
}