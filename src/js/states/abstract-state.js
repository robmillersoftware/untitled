export class AbstractState {
    constructor() {
        if (this.constructor === AbstractState) {
            throw new TypeError("Cannot instantiate AbstractState directly");
        }
    }
    
    preload() {
        throw new Error('Preload must be implemented by subclass of AbstractState');
    }
    
    create() {
        throw new Error('Create must be implemented by subclass of AbstractState');
    }
    
    update() {
        throw new Error('Update must be implemented by subclass of AbstractState');
    }
}