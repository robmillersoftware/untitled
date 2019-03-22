/**
 * Create and initialize the game when the window loads
 */
import { BootScene, LoadScene, MenuScene, PlayScene } from 'scene';

window.onload = () => {
  //Create game object
  var game = new Phaser.Game({
    width: '100%',
    height: '100%',
    renderer: Phaser.CANVAS,
    scene: [
      BootScene,
      LoadScene,
      MenuScene,
      PlayScene
    ],
    parent: 'game'
  });
};
