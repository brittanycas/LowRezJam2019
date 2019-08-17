class GameOver extends Phaser.Scene{
  constructor(config){
    super({key: 'GameOver'})
  }
  preload(){
    this.load.image('title', 'assets/title.png');
  }
  create(){
    this.cameras.main.shake(200);
    this.add.text(this.cameras.main.worldView.left + 15, 5, 'Game\nOver', { fontFamily: '"Roboto Condensed"', fontSize: '14px' });
    this.add.text(this.cameras.main.worldView.left + 13, 35, 'Press Space\nto try again', { fontFamily: '"Roboto Condensed"', fontSize: '8px' })
  }
  update(){
    let cursors = this.input.keyboard.createCursorKeys();
    let spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    if (Phaser.Input.Keyboard.JustDown(spacebar)){
        this.scene.start('LevelOne');
    }
  }
}

export default GameOver
