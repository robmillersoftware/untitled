export class GameStates {
    constructor() {
        this.states = new Map();
    }
    
    addState(state) {
        this.states.set(state.name, state);
    }
    
    getState(name) {
        if (this.states.has(name)) {
            return this.states.get(name);
        }
        
        return null;
    }
}