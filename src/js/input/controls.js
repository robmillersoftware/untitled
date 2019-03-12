/**
 * This class consists of key bindings for controls and utility functions for
 * testing input
 */
import {CONTROLS} from 'globals.js';

class Ctrls {
    constructor() {
        this.bindings = new Map();
        this.loadDefaultBindings();
    }

    /**
     * TODO: Use a DB or temporary storage for these
     */
    loadDefaultBindings() {
        this.bindings.set(CONTROLS.UP,
            [Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W]);
        this.bindings.set(CONTROLS.DOWN,
            [Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S]);
        this.bindings.set(CONTROLS.LEFT,
            [Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A]);
        this.bindings.set(CONTROLS.RIGHT,
            [Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D]);
    }

    /**
     * Sets the keyboard to be used by the singleton instance of this
     * class
     * @param {Phaser.Keyboard} kb
     */
    setKeyboard(kb) {
        this.keyboard = kb;
    }

    /**
     * Overwrites the bindings on a control
     * @param {CONTROLS} ctrl
     * @param {Array of Phaser.Key} keys
     */
    setBinding(ctrl, keys) {
        this.bindings.set(ctrl, keys);
    }

    /**
     * Test if a control is active
     * @param {CONTROLS} ctrl
     */
    isActive(ctrl) {
        let value = this.bindings.get(ctrl);
        if (value !== undefined) {
            if (!Array.isArray(value)) {
                return this.keyboard.isDown(value);
            } else {
                let pressed = false;
                value.forEach((key, i) => {
                    if (this.keyboard.isDown(key)) {
                        pressed = true;
                    }
                });

                return pressed;
            }
        }
    }
}

//Export a singleton to avoid issues with keybindings
export let Controls = new Ctrls();