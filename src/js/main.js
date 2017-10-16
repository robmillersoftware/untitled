/**
 * This is the entry point for the game. A bare minimum amount of logic
 * is needed here
 */
import {GameStates} from './states';

/**
 * Create and initialize the game when the window loads
 */
window.onload = () => {
    //Create game object
    var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'game');
    
    //Load the states of the game
    var states = new GameStates(game);
    states.init();

    //Start with the boot screen
    game.state.start('boot');
};