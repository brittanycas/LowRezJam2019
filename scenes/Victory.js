class Victory extends Phaser.Scene{
  constructor(config){
    super({key: 'Victory'})
  }
  preload(){
    this.load.image('victory', 'assets/victory.png');
    this.load.audio('winaudio', 'assets/victory.wav')
  }
  create(){
    this.add.image(0, 0, 'victory').setOrigin(0);
    this.sound.add('winaudio').play()
  }
  update(){
    let cursors = this.input.keyboard.createCursorKeys();
    let spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    if (Phaser.Input.Keyboard.JustDown(spacebar)){
        this.scene.start('LevelOne');
    }
  }
}

export default Victory
