import {BootState}      from './gameStates/bootState';
import {LoadState}      from './gameStates/loadState';
import {MenuState}      from './gameStates/menuState';
import {PlayState}      from './gameStates/playState';
import {VictoryState}   from './gameStates/victoryState';

export class GameStates {
    constructor(game) {
        this.states = new Map();
        this.game = game;
    }
    
    init() {
        this.pushState(new BootState(this.game));    
        this.pushState(new LoadState(this.game));
        this.pushState(new MenuState(this.game));
        this.pushState(new PlayState(this.game));
        this.pushState(new VictoryState(this.game));
    }
    
    pushState(state) {
        this.states.set(state.name, state);
        this.game.state.add(state.name, state);
    }
}