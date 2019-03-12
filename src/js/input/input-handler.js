
import {Controls} from 'input/controls';

/**
 * This is an abstract class that must be overridden by any object that
 * will be able to respond to input
 */
export class InputHandler {
    constructor(id = '') {
        if (this.constructor === InputHandler) {
            throw new TypeError('Abstract class InputHandler cannot be instantiated');
        }

        this.id = id;
        this.controls = null;
        this.combos = [];
    }

    setControls(controls) {
        this.controls = controls;
    }

    /**
     * Wrapper for Controls.isActive so as to not add another import
     * @param {CONTROLS} ctrl
     */
    isControlActive(ctrl) {
        return Controls.isActive(ctrl);
    }

    /**
     * This is the default input handler. It calls the callback registered
     * in the controls map
     */
    handleInput() {
        this.combos.forEach((combo, i) => {
            combo();
        });

        for (let [key, value] of this.controls) {
            if (this.isControlActive(key)) {
                let callback = value.bind(this);
                callback();
            }
        }
    }

    registerButtonCombo(buttons, callback, negate = false) {
        this.combos.push(() => {
            let shouldExecute = negate;
            for (let i = 0; i < buttons.length; i++) {
                if (this.isControlActive(buttons[i]) === shouldExecute) {
                    return;
                }
            }

            let cb = callback.bind(this);
            cb();
        });
    }
}