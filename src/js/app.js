import {GameStates} from './states';

window.onload = () => {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create });
};
