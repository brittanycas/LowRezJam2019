import TitleScreen from './scenes/TitleScreen.js'
import LevelOne from './scenes/LevelOne.js'
import LevelTwo from './scenes/LevelTwo.js'
import LevelThree from './scenes/LevelThree.js'
import GameOver from './scenes/GameOver.js'
import Victory from './scenes/Victory.js'

var gameWidth = 64;
var gameHeight = 64;

var config = {
    type: Phaser.AUTO,
    parent: 'game_window',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      width: gameWidth,
      height: gameHeight,
      min: {
        width: 64,
        height: 64,
      },
      max: {
        width: 512,
        height: 512
      }
    },
    scene:
      [TitleScreen,
        LevelOne,
        LevelTwo,
        LevelThree,
        GameOver,
        Victory],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    }
  };


  var game = new Phaser.Game(config);
