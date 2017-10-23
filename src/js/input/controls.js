/**
 * This class consists of key bindings for controls and utility functions for
 * testing input
 */
class Ctrls {
    constructor() {
        this.bindings = new Map();
        this.loadDefaultBindings();
    }

    /**
     * TODO: Use a DB or temporary storage for these
     */
    loadDefaultBindings() {
        this.bindings.set(CONTROLS.UP, [Phaser.Keyboard.UP, Phaser.Keyboard.W]);
        this.bindings.set(CONTROLS.DOWN, [Phaser.Keyboard.DOWN, Phaser.Keyboard.S]);
        this.bindings.set(CONTROLS.LEFT, [Phaser.Keyboard.LEFT, Phaser.Keyboard.A]);
        this.bindings.set(CONTROLS.RIGHT, [Phaser.Keyboard.RIGHT, Phaser.Keyboard.D]);
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