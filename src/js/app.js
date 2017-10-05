import {GameStates} from './states';

window.onload = () => {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    var states = new GameStates(game);
    
    states.init();
    game.state.start('boot');
};
