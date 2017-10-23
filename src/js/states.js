/**
 * This class is a simple wrapper for initializing the various game states
 */
import {BootState}      from './states/boot-state';
import {LoadState}      from './states/load-state';
import {MenuState}      from './states/menu-state';
import {PlayState}      from './states/play-state';
import {VictoryState}   from './states/victory-state';

export class GameStates {
    constructor(game) {
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
        this.game.state.add(state.name, state);
    }
}