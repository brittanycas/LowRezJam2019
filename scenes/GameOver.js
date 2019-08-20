class GameOver extends Phaser.Scene{
  constructor(config){
    super({key: 'GameOver'})
  }
  preload(){
    this.load.image('gameover', 'assets/gameover.png');
  }
  create(){
    this.cameras.main.shake(200);
    this.add.image(0, 0, 'gameover').setOrigin(0)
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
