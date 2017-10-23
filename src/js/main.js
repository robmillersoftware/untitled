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
    var game = new Phaser.Game({
        width: '100%',
        height: '100%',
        renderer: Phaser.CANVAS,
        scaleMode: Phaser.ScaleManager.RESIZE,
        parent: 'game'
    });
    
    //Load the states of the game
    var states = new GameStates(game);
    states.init();

    //Start with the boot screen
    game.state.start('boot');
};